const { Client, Collection, Partials, GatewayIntentBits } = require("discord.js");
//Load .env file
require("dotenv").config();

//Create a new client
const client = new Client({
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ],
        repliedUser: true
    },
    autoReconnect: true,
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ],
    restTimeOffset: 0
});

//Token of the bot
const TOKEN = process.env.TOKEN;

//Setup Functions
require("./utils/functions")(client);
//Setup Mongoose
client.mongoose = require("./utils/mongoose");
client.mongoose.init(client.timestampParser());
//Setup Commands
client.commands = new Collection();
//Setup Handlers
['CommandUtil', 'EventUtil'].forEach(handler => { require(`./utils/handlers/${handler}`)(client) });

//Handle Uncaught Errors
process.on("exit", code => { console.log(`The process shutdown with error code: ${code}!`); });
process.on("uncaughtException", (err, origin) => { console.log(`uncaughtException: ${err}`, `Origine: ${origin}`); console.log(err); });
process.on("unhandledRejection", (reason, promise) => { console.log(`UNHANDLED_REJECTION: ${reason}\n--------\n`, promise); });
process.on("warning", (...args) => { console.log(...args); });

//Login to Discord
client.login(TOKEN);