const { ChannelType } = require("discord.js");
const { Projects } = require("../schemas")

module.exports = async client => {

    //Projects Functions

    //Get a project by id
    client.getProjectById = async (id) => {
        try {
            const project = await Projects.findById(id);
            return project;
        } catch (err) {
            return null
        }
    };

    //Create Projects
    client.createProject = async (guildId, ownerId, { projectName, categoryId, textChannels, voiceChannels }) => {
        const project = await Projects({
            guildId,
            ownerId,
            projectName,
            categoryId
        });
        textChannels.map((x) => {
            project.channels.push(x)
        })
        voiceChannels.map((x) => {
            project.channels.push(x)
        })
        return await project.save().then((docs) => {
            return docs;
        })
    };

    //Retrieves all Projects
    client.getAllProjects = async () => {
        try {
            const giveways = await Projects.find({});
            return giveways;
        } catch (err) {
            return []
        }
    };


    //Format projects list for command
    client.formatProjectsList = async (projects) => {
        let values = [];
        projects.forEach((project) => {
            values.push({
                name: `${project.projectName} | ${client.timestampParser(project.createdAt)}`,
                value: project._id
            });
        })
        return values;
    };

    //Retrieve all projects with categories (not used)
    client.getAllProjectsWithCategories = async () => {
        const guild = client.guilds.cache.get("588359330701639716");
        const channels = await guild.channels.fetch();
        const notProject = "967845085041541120";
        const allCategories = channels.filter(channel => channel.type === ChannelType.GuildCategory && channel.id !== notProject);

        const cats = allCategories.values();

        const projects = [];
        for (const category of cats) {
            const project = {
                ownerId: "284792282249428993",
                guildId: guild.id,
                projectName: category.name,
                categoryId: category.id,
                channels: [],
                users: []
            };
            const channels = await category.children.cache.values();
            for (const channel of channels) {
                project.channels.push({
                    name: channel.name,
                    channelType: channel.type,
                    id: channel.id
                });
                const permissionOverwrites = category.permissionOverwrites.cache
                for (const permissionOverwrite of permissionOverwrites) {
                    if (permissionOverwrite[1].type === 1) {
                        project.users.push(permissionOverwrite[1].id);
                    }
                }
            }
            projects.push(project);
        }
    };

    //MISC FUNCTIONS
    //Get the timestamp
    client.timestampParser = num => {
        const date = new Date(num ? num : Date.now()).toLocaleDateString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        return date.toString();
    };

    //Check if a value is empty
    client.isEmpty = (value) => {
        return (
            value === undefined ||
            value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0)
        );
    };
};