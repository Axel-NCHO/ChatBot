const fs = require("fs");
const path = require("path")
const RiveScript = require("rivescript");

/**
 * Helper class to perform bot related operations
 */
class BotService {

    constructor() {
        this.fake_db_address = "./models/db.json"    // not a real db. it's just the json file where I save the bots
    }

    static async create() { //since I cannot return a promise in a constructor
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
        await this.addToFakeDB({name: data.name, personality: data.personality, user: data.id});
        return `created bot named ${data.name} with personality ${data.personality}`;
    }

    /**
     * Insert a bot into the database
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
     * Delete a bot
     * @param {*} data
     * @returns
     */
    async removeBot(data) {
        data.name = capitalize(data.name);
        data.user = data.id;
        await this.removeFromFakeDB(data);
        return `removed bot ${data.name} of user ${data.id}`
    }

    /**
     * Remove a bot from the database
     * @param {*} data
     */
    async removeFromFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        let index = db_content["bots"].findIndex(e => e.name === data.name && e.user === data.user);
        if (index > -1) {
            db_content["bots"].splice(index, 1);
            fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
        } else
            throw new Error(`Couldn't find bot ${data.name} of user ${data.user}`);
    }

    /**
     * Modify the information of a bot
     * @param {*} data
     * @returns
     */
    async patchBot(data) {
        data.name = capitalize(data.name);
        let old_bot = await this.getBot(data, true);
        let new_bot = {
            name: old_bot.name,
            personality: data.personality,
            user: old_bot.user,
            userVars: await old_bot.getUservars()
        }
        await this.modifyInFakeDB(new_bot);
        return `patched bot named ${data.name}`;
    }

    /**
     * Modify a bot in the database
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
     * Get a bot
     * @param data containing user credentials and bot name
     * @param forUse true if you plan to use the bot
     * @returns {Promise<*>}
     */
    async getBot(data, forUse = false) {
        data.name = capitalize(data.name);
        let bots = await this.getBots(data, forUse);
        let index = bots.findIndex(e => e.name === data.name);
        console.log("get bot")
        console.log(bots[index])
        return bots[index];
    }

    /**
     * Get all the bots
     * @returns
     */
    async getBots(data, forUse = false) {
        console.log("get bots")
        return await this.getFromFakeDB({user: data.id}, forUse);
    }

    /**
     * Get all the bots from the database
     * @param data
     * @param forUse true if you plan to use at least one of the bots
     * @returns {Promise<[]>}
     */
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

    /**
     * Check if a bot exists
     * @param data
     * @returns {Promise<boolean>}
     */
    async exists(data) {
        console.log("exists")
        return await this.getBot(data) !== undefined;
    }

    /**
     * Save the context of a bot
     * @param userid user id
     * @param bot bot name
     * @returns {Promise<void>}
     */
    async saveContext(userid, bot) {
        let data = {
            name: bot.name,
            personality: bot.personality,
            user: userid,
            userVars: await bot.getUservars(userid)
        };
        this.modifyInFakeDB(data);
        console.log(`Saved context for bot ${data.name} of user ${data.user}`);
    }

    /**
     * Reply to user input
     * @param data containing user credentials, bot name and user input
     * @returns {Promise<*>}
     */
    async getResponse(data) {
        console.log("replying");
        let bot = await this.getBot(data, true);
        let response = await bot.reply(data.id, data.input);
        await this.saveContext(data.id, bot);
        return response;
    }

    /**
     * Get all personalities available
     * @returns {string[]}
     */
    getPersonalities() {
        return this.listFilesWithoutExtensions("./rivescripts");
    }

    /**
     * Get the list of all files in a directory without the extensions
     * @param directoryPath
     * @returns {string[]}
     */
    listFilesWithoutExtensions(directoryPath) {
        return fs.readdirSync(directoryPath)
            .filter(file => {
                const filePath = path.join(directoryPath, file);
                const fileStats = fs.statSync(filePath);
                return fileStats.isFile() && path.extname(file) !== '';
            })
            .map(file => path.parse(file).name);
    }
}

/**
 * Puts the first character of a string to an upper case
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
