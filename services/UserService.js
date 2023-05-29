const fs = require("fs");
const User = require("../classes/User");

/**
 * Helper class to perform user related operations
 */
class UserService {

    constructor() {
        this.fake_db_address = "./models/db.json"    // not a real db. it's just the json file where I save the bots
    }

    static async create() { //since I cannot return a promise in a constructor
        return new UserService();
    }

    /**
     * Create a new user
     * @param {*} data
     * @returns
     */

    async addUser(data) {
        let new_user = new User(data);
        await this.addToFakeDB(new_user);
        return `created user named ${data.id}`;
    }

    /**
     * Insert user data into the data base
     * @param {*} data
     * @returns
     */
    async addToFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        db_content["users"].push(data);
        fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
        return true;
    }

    /**
     * Check if a user exists
     * @param data
     * @returns {boolean}
     */
    exists(data) {
        try {
            const ignored = this.getUser(data);
            return true;
        } catch (err) {
            return false;
        }

    }

    /**
     * Get a user
     * @param {*} data
     * @returns
     */
    getUser(data) {
        console.log(data)
        return this.getFromFakeDB(data);
    }

    /**
     * Get one user's data from the database
     * @param data
     * @returns {*|null}
     */
    getFromFakeDB(data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        let index = db_content["users"].findIndex(e => e.id === data.id && e.pwd === data.pwd);
        if (index > -1) {
            return db_content["users"][index]["id"];
        }
        return null;
    }
}

module.exports = UserService;