const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('time for bot to took response'),

    async execute(interaction) {
        await interaction.reply(`ping: ${Math.round(interaction.client.ws.ping)}ms`)
    }

}