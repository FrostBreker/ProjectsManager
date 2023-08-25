const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup a projects."),
    runSlash: async (client, interaction) => {
        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('setup-project')
            .setTitle('Setup Project');

        // Add components to modal

        // Create the text input components
        const projectName = new TextInputBuilder()
            .setCustomId('projectName')
            // The label is the prompt the user sees for this input
            .setLabel("What's the name of your project?")
            .setRequired(true)
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

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
        const firstActionRow = new ActionRowBuilder().addComponents(projectName);
        const secondActionRow = new ActionRowBuilder().addComponents(textChannels);
        const thirdActionRow = new ActionRowBuilder().addComponents(voiceChannels);

        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    }
}