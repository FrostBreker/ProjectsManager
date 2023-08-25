const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class MiscEmbed {
    static successCommand(title, description) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.success)
            .setTimestamp();
    }
    static errorCommand(title, description) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.error} ` + title)
            .setDescription(description)
            .setColor(embedOptions.colors.error)
            .setTimestamp();
    }
}

module.exports = MiscEmbed;