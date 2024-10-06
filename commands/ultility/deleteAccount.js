const { SlashCommandBuilder } = require('discord.js')
const { db } = require('../../events/init_database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('delete current kalam acc'),

    async execute(interaction) {
        const userTag = interaction.user.tag;

        const deleteQuery = `delete from account where user_tag = '${userTag}'`

        db.query(deleteQuery, (err, result) => {
            if (result.affectedRows === 0) {
                interaction.reply({ content: `cant found ${userTag} in db!`, ephemeral: true })
            } else {
                console.log(`[db]${userTag} deleted!`)
                interaction.reply({ content: `${userTag} deleted from db!`, ephemeral: true })
            }
        })
    }
}