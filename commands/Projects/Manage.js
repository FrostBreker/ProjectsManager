const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { errorCommand, successCommand } = require('../../embeds/Misc');
const { resumeProject } = require('../../embeds/Projects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("manage")
        .setDescription("Manage your projects.")
        .addStringOption(option => option
            .setName('project_id')
            .setDescription('What project do you want to manage')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('What user do you want to add to the project?')
        )
        .addBooleanOption(option => option
            .setName('channels')
            .setDescription('Do you want to add channels to the project?')
        ),
    autoComplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        let choices;


        switch (focusedOption.name) {
            case 'project_id': {
                choices = await client.formatProjectsList(await client.getAllProjects())
                break;
            }
            default:
                break;
        }
        await interaction.respond(choices);
    },
    runSlash: async (client, interaction) => {
        const project_id = interaction.options.getString('project_id');
        const user = interaction.options.getUser('user');
        const channels = interaction.options.getBoolean('channels');
        const project = await client.getProjectById(project_id);

        if (!project) return await interaction.reply({ embeds: [errorCommand("Project not found!", "Unable to find the project.")], ephemeral: true });

        if (user) {
            if (project.ownerId !== interaction.user.id) return await interaction.reply({ embeds: [errorCommand("You are not the owner of this project!", "You are not the owner of this project.")], ephemeral: true });
            if (project.users.includes(user.id)) return await interaction.reply({ embeds: [errorCommand("User already in project!", "The user is already in the project.")], ephemeral: true });
            project.users.push(user.id);

            const categoryObj = await interaction.guild.channels.fetch(project.categoryId);
            categoryObj.permissionOverwrites.create(user, {
                ViewChannel: true,
                SendMessages: true
            })
            project.channels.map(async (channel) => {
                const channelObj = await interaction.guild.channels.fetch(channel.id);
                channelObj.permissionOverwrites.create(user, {
                    ViewChannel: true,
                    SendMessages: true
                })
            })
            await project.save().then(async (docs) => {
                await interaction.reply({ embeds: [resumeProject(docs)], ephemeral: true });
            })
        }

        if (channels) {
            if (project.ownerId !== interaction.user.id) return await interaction.reply({ embeds: [errorCommand("You are not the owner of this project!", "You are not the owner of this project.")], ephemeral: true });

            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId('manage-' + project_id)
                .setTitle('Manage Project');

            // Add components to modal
            const textChannels = new TextInputBuilder()
                .setCustomId('textChannels')
                .setLabel("What text channels do you want to create?")
                .setPlaceholder("separate with comma")
                .setRequired(false)
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            const voiceChannels = new TextInputBuilder()
                .setCustomId('voiceChannels')
                .setLabel("What voice channels do you want to create?")
                .setPlaceholder("separate with comma")
                .setRequired(false)
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            // An action row only holds one text input,
            // so you need one action row per text input.
            const secondActionRow = new ActionRowBuilder().addComponents(textChannels);
            const thirdActionRow = new ActionRowBuilder().addComponents(voiceChannels);

            // Add inputs to the modal
            modal.addComponents(secondActionRow, thirdActionRow);

            // Show the modal to the user
            await interaction.showModal(modal);
        }
    }
}