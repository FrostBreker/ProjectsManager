const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorCommand, successCommand } = require('../../embeds/Misc');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete your projects.")
        .addStringOption(option => option
            .setName('project_id')
            .setDescription('What project do you want to manage')
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

        for (let i = 0; i < project.channels.length; i++) {
            const channel = project.channels[i];
            const channelObj = await interaction.guild.channels.fetch(channel.id);
            channelObj.delete();
        };

        const categoryObj = await interaction.guild.channels.fetch(project.categoryId);
        categoryObj.delete();

        if (!project) return await interaction.reply({ embeds: [errorCommand("Project not found!", "Unable to find the project.")], ephemeral: true });
        return await project.deleteOne().then(() => {
            return interaction.editReply({ embeds: [successCommand("Project deleted!", "The project has been deleted.")], ephemeral: true })
        })
    }
}