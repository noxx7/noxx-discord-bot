const { Routes, REST } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('node:fs')
const path = require('node:path')

dotenv.config()

const commands = []

const folderPath = path.join(__dirname, 'commands')
const commandsFolders = fs.readdirSync(folderPath)

for (const folder of commandsFolders) {
    const commandsPath = path.join(folderPath, folder)
    const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFile) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON())
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`)
        }
    }
}

const rest = new REST().setToken(process.env.BOT_TOKEN); //make sure to add ; 

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application [/] commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application [/] commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }

    process.exit(0)
})();

