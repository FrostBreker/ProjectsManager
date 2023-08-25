const { glob } = require("glob");
const { join } = require("path");

module.exports = async client => {
    (await glob(`${process.cwd()}/events/*/*.js`)).map(async eventFile => {
        const event = require(join(process.cwd(), eventFile));

        if (!eventsList.includes(event.name) || !event.name) {
            return console.log(`------\nEvenement non-déclenchée: erreur de typo (ou pas de nom)\nFichier --> ${eventFile}`);
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }

        console.log(`events Chargé [🛄] : ${event.name}`);

    })
}

const eventsList = ['apiRequest', 'modalSubmit', 'apiResponse', 'applicationCommandCreateD', 'applicationCommandDeleteD', 'applicationCommandUpdateD', 'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'debug', 'emojiCreate', 'emojiDelete', 'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate', 'guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd', 'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interactionD', 'interactionCreate', 'invalidated', 'invalidRequestWarning', 'inviteCreate', 'inviteDelete', 'messageD', 'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji', 'messageUpdate', 'presenceUpdate', 'rateLimit', 'ready', 'roleCreate', 'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate', 'stickerCreate', 'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate', 'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpdate']
