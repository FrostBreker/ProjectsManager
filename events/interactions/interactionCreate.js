const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { errorCommand, successCommand } = require('../../embeds/Misc');
const { resumeProject, createProject } = require('../../embeds/Projects');

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        const guild = interaction.guild;

        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return await interaction.reply("Cette commande n'existe pas!");
            return cmd.runSlash(client, interaction);
        } else if (interaction.isAutocomplete()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return await interaction.reply({ content: "This command does not exist! Please contact an administrator !", ephemeral: true });
            return cmd.autoComplete(client, interaction);
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'setup-project') {
                await interaction.deferReply({ ephemeral: true });
                // Get the data entered by the user
                const projectName = interaction.fields.getTextInputValue('projectName');
                const textChannels = interaction.fields.getTextInputValue('textChannels').replace(/ /g, '-').split(',-');
                const voiceChannels = interaction.fields.getTextInputValue('voiceChannels').replace(/ /g, '-').split(',-');

                // Create a new category
                const category = await guild.channels.create({
                    name: `Project: ${projectName}`,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                });

                // Create a text channels
                const newTextChannels = [];
                if (textChannels[0] !== "") {
                    for (const channel of textChannels) {
                        const newChannel = await guild.channels.create({
                            name: channel,
                            type: ChannelType.GuildText,
                            parent: category.id,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        newTextChannels.push({
                            name: newChannel.name,
                            channelType: newChannel.type,
                            id: newChannel.id
                        })
                    }
                }

                // Create a voice channels
                const newVoiceChannels = [];
                if (voiceChannels[0] !== "") {
                    for (const channel of voiceChannels) {
                        const newChannel = await guild.channels.create({
                            name: channel,
                            type: ChannelType.GuildVoice,
                            parent: category.id,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        newVoiceChannels.push({
                            name: newChannel.name,
                            channelType: newChannel.type,
                            id: newChannel.id
                        })
                    }
                }
                const newProject = await client.createProject(
                    guild.id,
                    interaction.user.id,
                    {
                        projectName,
                        categoryId: category.id,
                        textChannels: newTextChannels,
                        voiceChannels: newVoiceChannels
                    }
                );

                if (client.isEmpty(newProject)) return await interaction.editReply({ embeds: [errorCommand("Error", "An error occurred while creating the project.")] });


                // Send a response to the user
                await interaction.editReply({ embeds: [createProject({ projectName, categoryId: category.id, ownerId: interaction.user.id, newTextChannels, newVoiceChannels })] });
            } else if (interaction.customId.split("-")[0] === 'manage') {
                await interaction.deferReply({ ephemeral: true });
                const project_id = interaction.customId.split("-")[1];
                const project = await client.getProjectById(project_id);

                if (!project) return await interaction.editReply({ embeds: [errorCommand("Project not found!", "Unable to find the project.")], ephemeral: true });

                // Get the data entered by the user
                const textChannels = interaction.fields.getTextInputValue('textChannels').replace(/ /g, '-').split(',-');
                const voiceChannels = interaction.fields.getTextInputValue('voiceChannels').replace(/ /g, '-').split(',-');

                // Create a text channels
                const newTextChannels = [];
                if (textChannels[0] !== "") {
                    for (const channel of textChannels) {
                        const newChannel = await guild.channels.create({
                            name: channel,
                            type: ChannelType.GuildText,
                            parent: project.categoryId,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        project.users.forEach(async e => {
                            const user = await client.users.fetch(e);
                            newChannel.permissionOverwrites.create(user, {
                                ViewChannel: true,
                                SendMessages: true
                            })
                        });
                        newTextChannels.push({
                            name: newChannel.name,
                            channelType: newChannel.type,
                            id: newChannel.id
                        })
                    }
                };


                // Create a voice channels
                const newVoiceChannels = [];
                if (voiceChannels[0] !== "") {
                    for (const channel of voiceChannels) {
                        const newChannel = await guild.channels.create({
                            name: channel,
                            type: ChannelType.GuildVoice,
                            parent: project.categoryId,
                            permissionOverwrites: [
                                {
                                    id: guild.roles.everyone.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        project.users.forEach(async e => {
                            const user = await client.users.fetch(e);
                            newChannel.permissionOverwrites.create(user, {
                                ViewChannel: true,
                                SendMessages: true
                            })
                        });
                        newVoiceChannels.push({
                            name: newChannel.name,
                            channelType: newChannel.type,
                            id: newChannel.id
                        })
                    }
                };

                newTextChannels.map((x) => {
                    project.channels.push(x)
                })
                newVoiceChannels.map((x) => {
                    project.channels.push(x)
                })

                await project.save().then(async (docs) => {
                    return await interaction.editReply({ embeds: [resumeProject(docs)] });
                })
            }
        }
    }
}