const fs = require("fs");
const User = require("../classes/User");

/**
 * Helper class to perform users related operations
 */
class UserService {

    constructor() {
        this.fake_db_address = "./models/db.json"    // not a real db. it's just the json file where i save the bots
        this.users = [];
    }

    static async create(){ //since I cannot return a promise in a constructor
        return new UserService();
    }

    /**
     * Create a new user
     * @param {*} data
     * @returns
     */
    async addUser(data) {
        let new_user;
        if (this.getFromFakeDB(data) != null) {
            throw new Error("User already exists");
        }
        new_user = new User(data);
        this.users.push(new_user);
        console.log("Current users: ", this.users);
        this.addToFakeDB(new_user);
        return `created user named ${data.id}`;
    }

    /**
     * Insert data into the data base
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

    addExistingUser(data) {
        this.users.push(data);
    }

    /**
     * Deletes a pokemon
     * @param {*} name
     * @returns
     */
    async removeUser(id){
        let index = this.users.findIndex(e => e.id == id);
        if(index >-1){
            this.users.splice(index,1);
            this.removeFromFakeDB(id);
            return `removed user ${id}`;
        }
        throw new Error(`cannot find user ${id}`);

    }

    /**
     * Delete data from the data base
     * @param {*} index
     */
    async removeFromFakeDB(id) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        let index = db_content["users"].findIndex(e => e.id == id);
        if (index > -1) {
            db_content["users"].splice(index,1);
        }
        fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
    }

    /**
     * Modify the informations of a pokemon
     * @param {*} key
     * @param {*} new_data must be like {name: str type: str, ability: str}
     * @returns
     */
    async patchUser(id, new_data) {
        if (undefined == new_data.id) {
            throw new Error("Missing new data");
        }
        if (undefined == new_data.pwd) {
            throw new Error("Missing new data");
        }
        try {
            let index = this.users.findIndex(e => e.id == id);
            if (index > -1) {
                this.users[index] = new_data;
                /*
                this.bots[index].data.name = new_data.name;
                this.bots[index].data.type = new_data.type;
                this.bots[index].data.ability = new_data.ability;*/
                this.modifyInFakeDB(id, new_data);
            }
        } catch(err) {
            throw err;
        }
        return `patched user ${id}`;
    }

    /**
     * Modifies data in the data base
     * @param {*} index
     * @param {*} new_data
     */
    async modifyInFakeDB(id, new_data) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        let index =  db_content["users"].findIndex(e => e.id == id);
        db_content["users"][index] = new_data;
        /*
        db_content[index].data.name = new_data.name;
        db_content[index].data.type = new_data.type;
        db_content[index].data.ability = new_data.ability;*/
        fs.writeFileSync(this.fake_db_address, JSON.stringify(db_content), {encoding: "utf-8", flag: 'w'});
    }

    /**
     * Get a bot with a specific name
     * @param {*} key
     * @returns
     */
    getUser(data){
        let user = this.getFromFakeDB(data, true);
        if (user != null) {
            this.users.push(user);
            return user;
        }
        throw new Error("cannot find this user");
    }

    getFromFakeDB(data, connect=false) {
        let dbString = fs.readFileSync(this.fake_db_address, {encoding: "utf-8", flag: 'r'});
        let db_content = JSON.parse(dbString);
        let index;
        if (connect)
            index = db_content["users"].findIndex(e=> e.id == data.id && e.pwd == data.pwd);
        else
            index = db_content["users"].findIndex(e=> e.id == data.id);
        if (index > -1) {
            return db_content["users"][index];
        }
        return null;
    }

    isConnected(userId) {
        return this.users.findIndex(e => e.id == userId) !== -1;
    }

    /**
     * Get all the bots
     * @returns
     */
    getConnectedUsers(){
        return this.users;
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

module.exports = UserService;