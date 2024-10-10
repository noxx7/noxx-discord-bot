const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { db } = require('../../events/init_database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription('get account info'),

    async execute(interaction) {

        const userTag = interaction.user.tag
        const query = `select * from account where user_tag = '${userTag}'`

        db.query(query, (err, result) => {
            if (err) {
                console.error('err: ', err)
            } else if (result.length === 0) {
                interaction.reply({ content: `cant find account with user tag: ${userTag}`, ephemeral: true })
            } else {
                const embed = new EmbedBuilder()
                    .setTitle(`${userTag} account!`)
                    .setColor('Random')
                    .setDescription(`nim: ${result[0].nim}\n password: ${result[0].password}`)

                interaction.reply({ embeds: [embed], ephemeral: true })
            }

            //console.log(result)
        })
    }
}