const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { db } = require('../../events/init_database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('setting up ur kalam acc')
        .addStringOption(option =>
            option.setName('nim')
                .setDescription('enter nim  ')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('password')
                .setDescription('enter password')
                .setRequired(true)
        ),

    async execute(interaction) {
        const nim = interaction.options.getString('nim');
        const password = interaction.options.getString('password')
        const discordTag = interaction.user.tag

        const embed = new EmbedBuilder()
            .setColor('#76c8f5')
            .setTitle('account saved!')
            .setDescription(`nim: ${nim} \npassword: ${password}`)
            .setTimestamp()

        const insertQuery = 'INSERT INTO account (user_tag, nim, password) VALUES (?, ?, ?)'

        db.query(insertQuery, [discordTag, nim, password], (err, results) => {
            if (err) {
                console.error('error inserting data: ', err)
                interaction.reply({ content: `${discordTag} already registered!`, ephemeral: true })
            } else {
                console.log(`[db]${discordTag} inputted data`)

                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
        })
    }
}