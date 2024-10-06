const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { db } = require('../../events/init_database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('edit your account')
        .addStringOption(option =>
            option.setName('nim')
                .setDescription('enter nim')
        )
        .addStringOption(option =>
            option.setName('password')
                .setDescription('enter password')
        ),

    async execute(interaction) {
        const nim = interaction.options.getString('nim')
        const pw = interaction.options.getString("password");
        const userTag = interaction.user.tag

        if (nim && pw) {

            const alterTableBothQ = `update account set nim = '${nim}', password = '${pw}' where user_tag = '${userTag}'`
            //console.log(alterTableBothQ)

            db.query(alterTableBothQ, [nim, pw], (err, result) => {
                if (err) {
                    console.error('failed to edit data: ', err)
                    interaction.reply({ content: `cant find user_tag with value of ${userTag}`, ephemeral: true })
                } else if (result.affectedRows === 0) {
                    console.log(`cant find ${userTag} in db`)
                    interaction.reply({ content: `cant find ${userTag} in db`, ephemeral: true })
                } else {
                    //console.log(result)
                    interaction.reply({ content: 'successfully changed nim and password!', ephemeral: true })
                }
            })


        } else if (nim || pw) {

            const alterTableOneQ = `update account set ${nim ? 'nim' : 'password'} = '${nim ? nim : pw}' where user_tag = '${userTag}'`
            //console.log(alterTableOneQ)

            db.query(alterTableOneQ, [nim ? nim : pw], (err, result) => {
                if (err) {
                    console.err('failed to edit data: ', err)
                    interaction.reply({ content: `cant find user_tag with value of ${userTag}`, ephemeral: true })

                } else if (result.affectedRows === 0) {
                    interaction.reply({ content: `cant find ${userTag} in db`, ephemeral: true })
                } else {
                    console.log(result)
                    interaction.reply({ content: `successfully changed ${nim ? 'nim' : 'password'}!`, ephemeral: true })
                }
            })
        } else {
            await interaction.reply({ content: 'fill either one of these option!', ephemeral: true })
        }
    }
}