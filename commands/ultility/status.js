const { SlashCommandBuilder } = require('discord.js')
const { runningTask } = require('../../events/interactionCreate')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('check the status of the bot'),

    async execute(interaction) {
        return
    }
}