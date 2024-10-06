const { Client, Collection, Events, GatewayIntentBits, ClientVoiceManager } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const dotenv = require('dotenv')

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ]
})

client.commands = new Collection()

const folderPath = path.join(__dirname, 'commands')
const commandsFolders = fs.readdirSync(folderPath)

for (const folder of commandsFolders) {
    const commandsPath = path.join(folderPath, folder)
    const commandFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFile) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`)
        }
    }
}

const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(process.env.BOT_TOKEN)