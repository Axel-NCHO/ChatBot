const fs = require("fs");
const Bot = require("../classes/Bot");
const JSONC = require("jsonc");
const RiveScript = require("rivescript");

/**
 * Helper class to perform bots related operations
 */
class BotService {

    constructor() {
        this.fake_db_address = "./models/db.json"    // not a real db. it's just the json file where i save the bots
        this.bots = {};
    }

    static async create(){ //since I cannot return a promise in a constructor
        return new BotService();
    }

    /**
     * Create a new bot
     * @param {*} data
     * @returns
     */
    async addBot(data) {
        data.name = capitalize(data.name);
        if (this.exists({user: data.user, name: data.name})) {
            throw new Error("You already created a bot with this name");
        }
        let new_bot = new RiveScript({utf8: true});
        new_bot.name = data.name;
        new_bot.personality = data.personality;
        new_bot.user = data.user;
        new_bot.loadFile(`./rivescripts/${data.personality}.rive`)
            .then(() => {
                new_bot.sortReplies();
                if(data.user in this.bots)
                    this.bots[data.user]["bots"].push(new_bot);
                else
                    this.bots[data.user] = {bots: [new_bot], inUse: null}  ;
            })
            .then(() => {
                console.log("Current bots: ", this.bots);
                this.addToFakeDB(data);
                return `created bot named ${data.name} with personality ${data.personality}`;
        });
    }

    /**
     * Insert data into the data base
     * @param {*} data
     * @returns
     */
    async addToFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSONC.parse(dbString);
        db_content["bots"].push(data);
        fs.writeFileSync(this.fake_db_address, JSONC.stringify(db_content), {encoding: "utf-8", flag: 'w'});
        return true;
    }

    addExistingBot(data) {
        this.bots[data.user] = data;
    }

    /**
     * Deletes a pokemon
     * @param {*} name
     * @returns
     */
    async removeBot(name){
        let botName = capitalize(name);
        let index = this.bots.findIndex(e => e.name == botName);
        if(index >-1 ){
            this.bots.splice(index,1);
            this.removeFromFakeDB(index);
            return `removed bot named ${botName}`;
        }
        throw new Error(`cannot find bot named ${botName}`);

    }

    /**
     * Delete data from the data base
     * @param {*} index
     */
    async removeFromFakeDB(index) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSONC.parse(dbString);
        db_content["bots"].splice(index,1);
        fs.writeFileSync(this.fake_db_address, JSONC.stringify(db_content), {encoding: "utf-8", flag: 'w'});
    }

    /**
     * Modify the informations of a pokemon
     * @param {*} key
     * @param {*} new_data must be like {name: str type: str, ability: str}
     * @returns
     */
    async patchBot(name, new_data) {
        let botName = capitalize(name);
        if (undefined == new_data.name) {
            throw new Error(`Missing new data for bot named ${botName}`);
        }
        try {
            let index = this.bots.findIndex(e => e.name == botName);
            if (index > -1) {
                this.bots[index] = new_data;
                /*
                this.bots[index].data.name = new_data.name;
                this.bots[index].data.type = new_data.type;
                this.bots[index].data.ability = new_data.ability;*/
                this.modifyInFakeDB(index, new_data);
            }
        } catch(err) {
            throw err;
        }
        return `patched bot named ${botName}`;
    }

    /**
     * Modifies data in the data base
     * @param {*} index
     * @param {*} new_data
     */
    async modifyInFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSONC.parse(dbString);
        let index = db_content["bots"].findIndex(e => e.name == data.name && e.user == data.user);
        db_content["bots"][index] = data;
        fs.writeFileSync(this.fake_db_address, JSONC.stringify(db_content), {encoding: "utf-8", flag: 'w'});
    }

    /**
     * Get a bot with a specific name
     * @param {*} key
     * @returns
     */
    getBotByName(data){
        data.name = capitalize(data.name);
        let bots = this.bots[data.user];
        let index = bots.findIndex(e=> e.name == data.name);
        if(index >-1 ){
            return  (this.bots)[index];
        }
        throw new Error(`cannot find bot named ${botName}`);
    }

    /**
     * Get all the bots
     * @returns
     */
    async getBots(userId) {
        this.bots[userId] = {bots: [], inUse: null};
        await this.getFromFakeDB({user: userId});
        return this.bots[userId]["bots"].map(e => {
            return {name: e.name, personality: e.personality, user: e.user}
        });
    }

    async getFromFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSONC.parse(dbString);
        console.log("Got from db: ", db_content["bots"]);
        if (db_content["bots"].length !== 0) {
            for (const bot of db_content["bots"]) {
                if (bot.user === data.user) {
                    let botObject = new RiveScript({utf8: true});
                    botObject.name = bot.name;
                    botObject.personality = bot.personality;
                    botObject.user = bot.user;
                    await botObject.loadFile(`./rivescripts/${bot.personality}.rive`).catch(err => console.log(err));
                    botObject.sortReplies();
                    if (bot.userVars)
                        await botObject.setUservars(data.user, bot.userVars).catch(err => console.log(err));
                    this.bots[data.user]["bots"].push(botObject);
                    console.log("pushed");

                }
            }
        }
    }

    exists(data) {
        console.log("Current bots: ", this.bots);
        let index = this.bots[data.user]["bots"].findIndex(e=> e.name == data.name);
        return index > -1;
    }

    async saveContext(userid){
        console.log("userid: ", userid);
        console.log("bots: ", this.bots[userid]);
        if (this.bots[userid]["inUse"] != null) {
            let index = this.bots[userid]["bots"].findIndex(e => e.name === this.bots[userid]["inUse"]);
            if (index > -1) {
                let data = {
                    name: this.bots[userid]["inUse"],
                    personality: this.bots[userid]["bots"][index].personality,
                    user: userid,
                    userVars: await this.bots[userid]["bots"][index].getUservars(userid)
                };
                this.modifyInFakeDB(data);
                console.log(`Saved context for bot ${data.name} of user ${data.user}`);
            } else
                console.log("Error on index", index);

        }
    }

    async logOut(userid) {
        this.saveContext(userid)
            .then(() => {
                delete this.bots[userid];
            })
            .catch((err) => {console.log(err)});
    }

    async useBot(data) {
        this.saveContext(data.user)
            .then(() => {
                this.bots[data.user]["inUse"] = data.name;
            });
    }

    async getResponse(data) {
        let index = this.bots[data.user]["bots"].findIndex(e => e.name === this.bots[data.user]["inUse"]);
        let bot = this.bots[data.user]["bots"][index];
        return await bot.reply(data.user, data.input);
    }

    /**
     * Get a type
     * @param {*} name
     * @returns
     */
    /*
    getType(name){
        let index = this.types.findIndex(e=> e.name == name);
        if(index >-1 ){
            return  (this.types)[index];
        }
        throw new Error(`cannot find pokemon of id ${id}`);
    }*/

    /**
     * Get all the types
     * @returns
     */
    /*
    getTypes(){
        return this.types;
    }*/

    /**
     * A a new ability to the data base
     * @param {*} data
     * @returns
     */
    /*
    async addAbility(data) {
        if (undefined == data.name) {
            throw new Error("Missing name for ability")
        }
        if (undefined == data.description) {
            throw new Error("Missing description for ability")
        }
        if (undefined == data.genfamily) {
            throw new Error("Missing genfamily for ability")
        }
        this.abilities.push({name: data.name, description: data.description, genfamily: data.genfamily});
        return (`added type ${data.name}`);
    }*/

    /**
     * Get an ability
     * @param {*} name
     * @returns
     */
    /*
    getAbility(name){
        let index = this.abilities.findIndex(e=> e.name == name);
        if(index >-1 ){
            return  (this.abilities)[index];
        }
        throw new Error(`cannot find pokemon of id ${id}`);
    }*/

    /**
     * Get all the abilities
     * @returns
     */
    /*
    getAbilities(){
        return this.abilities;
    }*/

    /**
     * Converts a number to a valid pokemon key
     * @param {*} key an integer
     * @returns a pokemon key
     */
    /*
    toPokemonKey(key) {
        return intLenPad(key, this.MIN_KEY_LENGTH);
    }*/
}

/**
 * Formats an integer so that it has a specific number of digits.
 * If it has less than 3 digits, it is filled with zeros
 * @param {*} value an integer
 * @param {*} length the number of digits
 * @returns
 */
/*
function intLenPad(value, length) {
    return ( new Array(length+1).join('0') + value).slice(-length);
}*/

/**
 * Puts the first caracter of a string to upper case
 * @param {*} string
 * @returns
 */
function capitalize(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } catch(err) {
        throw err
    }

}

module.exports = {BotService, capitalize};