const { SlashCommandBuilder } = require('discord.js')
//const { startPuppeteer } = require('./run')
//const { stopInterval } = require('../../events/interactionCreate')

function stopPuppeteer() {
    clearInterval(runningTask)
    console.log('bot stopped')
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop the bot'),

    async execute(interaction) {
        return
    },

    stopPuppeteer
}