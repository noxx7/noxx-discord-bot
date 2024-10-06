const { Events, ActivityType } = require('discord.js')

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute(client) {
        console.log(`logged in as ${client.user.tag}!`)
        client.user.setPresence({
            activities: [{ name: 'lea cantikk', type: ActivityType.Watching }],
            status: 'idle'
        })
        console.log('presence set!')
    }
}