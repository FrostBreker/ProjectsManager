const { EmbedBuilder } = require("discord.js");
const { embedOptions } = require("../config");

class ProjectsEmbed {
    static createProject({ projectName, categoryId, ownerId, newTextChannels, newVoiceChannels }) {
        return new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Project created!")
            //Voici un résumé du projet que vous venez de créer
            .setDescription(`Here is a summary of the project you just created.`)
            .setColor(embedOptions.colors.success)
            .setTimestamp()
            .addFields(
                { name: "Name of the Project:", value: projectName },
                { name: "Category:", value: `<#${categoryId}>` },
                { name: "Owner:", value: `<@${ownerId}>` },
                {
                    name: "Text channels:", value: newTextChannels.map((x) => {
                        return `<#${x.id}>`;
                    }).join(", ")
                },
                {
                    name: "Voice channels:", value: newVoiceChannels.map((x) => {
                        return `<#${x.id}>`;
                    }).join(", ")
                }
            );
    }

    static resumeProject({ projectName, categoryId, ownerId, channels, users }) {
        const textChannels = channels.filter((x) => x.channelType === 0);
        const voiceChannels = channels.filter((x) => x.channelType === 2);

        console.log(textChannels);
        console.log(voiceChannels);
        console.log(users);
        console.log(projectName);
        console.log(categoryId);
        console.log(ownerId);

        const embed = new EmbedBuilder()
            .setTitle(`> ${embedOptions.icons.success} ` + "Summary of your project")
            .setDescription(`Here is a summary of your project.`)
            .setColor(embedOptions.colors.success)
            .setTimestamp()
            .addFields(
                { name: "Name of the Project:", value: projectName },
                { name: "Category:", value: `<#${categoryId}>` },
                { name: "Owner:", value: `<@${ownerId}>` }
            );

        if (textChannels.length > 0) {
            embed.addFields(
                {
                    name: "Text channels:", value: textChannels.map((x) => {
                        return `- <#${x.id}>`;
                    }).join("\n")
                }
            )
        }
        if (voiceChannels.length > 0) {
            embed.addFields(
                {
                    name: "Voice channels:", value: voiceChannels.map((x) => {
                        return `- <#${x.id}>`;
                    }).join("\n")
                }
            )
        }
        if (users.length > 0) {
            embed.addFields(
                {
                    name: "Users:", value: users.map((x) => {
                        return `- <@${x}>`;
                    }).join("\n")
                }
            )
        }

        return embed;
    }
}

module.exports = ProjectsEmbed;