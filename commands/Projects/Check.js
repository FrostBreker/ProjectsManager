const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorCommand } = require('../../embeds/Misc');
const { resumeProject } = require('../../embeds/Projects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check your projects.")
        .addStringOption(option => option
            .setName('project_id')
            .setDescription('What project do you want to check.')
            .setRequired(true)
            .setAutocomplete(true)
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
        await interaction.deferReply({ ephemeral: true });
        const project_id = interaction.options.getString('project_id');
        const project = await client.getProjectById(project_id);

        if (!project) return await interaction.reply({ embeds: [errorCommand("Project not found!", "Unable to find the project.")], ephemeral: true });

        return await interaction.editReply({ embeds: [resumeProject(project)] });
    }
}