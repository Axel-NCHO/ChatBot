const fs = require("fs");
const RiveScript = require("rivescript");

/**
 * Helper class to perform bots related operations
 */
class BotService {

    constructor() {
        this.fake_db_address = "./models/db.json"    // not a real db. it's just the json file where i save the bots
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
        if (await this.exists({id: data.id, name: data.name})) {
            throw new Error("You already created a bot with this name");
        }
        this.addToFakeDB({name: data.name, personality: data.personality, user: data.id});
        return `created bot named ${data.name} with personality ${data.personality}`;
    }

    /**
     * Insert data into the data base
     * @param {*} data
     * @returns
     */
    async addToFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        db_content["bots"].push(data);
        fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
        return true;
    }

    /**
     * Deletes a pokemon
     * @param {*} name
     * @returns
     *//*
    async removeBot(name){
        let botName = capitalize(name);
        let index = this.bots.findIndex(e => e.name == botName);
        if(index >-1 ){
            this.bots.splice(index,1);
            this.removeFromFakeDB(index);
            return `removed bot named ${botName}`;
        }
        throw new Error(`cannot find bot named ${botName}`);

    }*/

    /**
     * Delete data from the data base
     * @param {*} index
     *//*
    async removeFromFakeDB(index) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        db_content["bots"].splice(index,1);
        fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
    }*/

    /**
     * Modify the informations of a pokemon
     * @param {*} key
     * @param {*} new_data must be like {name: str type: str, ability: str}
     * @returns
     *//*
    async patchBot(name, new_data) {
        let botName = capitalize(name);
        if (undefined == new_data.name) {
            throw new Error(`Missing new data for bot named ${botName}`);
        }
        try {
            let index = this.bots.findIndex(e => e.name == botName);
            if (index > -1) {
                this.bots[index] = new_data;
                this.modifyInFakeDB(index, new_data);
            }
        } catch(err) {
            throw err;
        }
        return `patched bot named ${botName}`;
    }*/

    /**
     * Modifies data in the data base
     * @param {*} data
     */

    async modifyInFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        let index = db_content["bots"].findIndex(e => e.name === data.name && e.user === data.user);
        db_content["bots"][index] = data;
        fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
    }

    /**
     * Get a bot with a specific name
     * @param {*} key
     * @returns
     *//*
    getBotByName(data){
        data.name = capitalize(data.name);
        let bots = this.bots[data.user];
        let index = bots.findIndex(e=> e.name == data.name);
        if(index >-1 ){
            return  (this.bots)[index];
        }
        throw new Error(`cannot find bot named ${botName}`);
    }*/

    async getBot(data, forUse=false) {
        data.name = capitalize(data.name);
        let bots = await this.getBots(data, forUse);
        let index = bots.findIndex(e => e.name === data.name);
        console.log("getbot")
        console.log(bots[index])
        return bots[index];
    }

    /**
     * Get all the bots
     * @returns
     */
    async getBots(data, forUse = false) {
        console.log("getbots")
        return await this.getFromFakeDB({user: data.id}, forUse);
    }

    async getFromFakeDB(data, forUse = false) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        console.log("Got from db: ", db_content["bots"]);
        let bots = [];
        if (db_content["bots"].length !== 0) {
            for (const bot of db_content["bots"]) {
                if (bot.user === data.user) {
                    if (forUse) {
                        let botObject = new RiveScript({utf8: true});
                        botObject.name = bot.name;
                        botObject.personality = bot.personality;
                        botObject.user = bot.user;
                        await botObject.loadFile(`./rivescripts/${bot.personality}.rive`).catch(err => console.log(err));
                        botObject.sortReplies();
                        if (bot.userVars)
                            await botObject.setUservars(data.user, bot.userVars).catch(err => console.log(err));
                        bots.push(botObject);
                        console.log("pushed");
                    } else
                        bots.push({name: bot.name, personality: bot.personality, id: bot.user});
                }
            }
        }
        console.log("from db")
        return bots;
    }

    async exists(data) {
        console.log("exists")
        return await this.getBot(data) !== undefined;
    }

    async saveContext(userid, bot){
        let data = {
            name: bot.name,
            personality: bot.personality,
            user: userid,
            userVars: await bot.getUservars(userid)
        };
        this.modifyInFakeDB(data);
        console.log(`Saved context for bot ${data.name} of user ${data.user}`);
    }

    async getResponse(data) {
        console.log("replying");
        let bot = await this.getBot(data, true);
        let response = await bot.reply(data.id, data.input_text);
        await this.saveContext(data.id, bot);
        return response;
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