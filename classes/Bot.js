const RiveScript = require("rivescript");

/**
 * Represents a Bot
 */
class Bot {

    constructor() {
        this.bot = null;
    }

    create(data) {
        this.bot = new RiveScript({utf8: true});
        this.bot.name = data.name;
        this.bot.user = data.user;
        this.bot.loadFile(`./rivescripts/${data.personality}.rive`)
            .then(() => {console.log("file loaded")})
            .catch((err) => {
                console.log(`Error when loading personality ${data.personality} for bot ${data.name}`);
                console.log(err);
                throw err;
            });
    }
}

module.exports = Bot;