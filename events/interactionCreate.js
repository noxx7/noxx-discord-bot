const { Events } = require('discord.js')
const { startPuppeteer } = require('../commands/ultility/run')
const { stopPuppeteer } = require('../commands/ultility/stop')
const { db } = require('../events/init_database')
const run = require('../commands/ultility/run')

let runningTask

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.error(`no command matching ${interaction.commandName}`)
            return
        }

        const { commandName } = interaction

        if (commandName === 'run') {
            if (runningTask) {
                await interaction.reply({ content: 'task already running', ephemeral: true })
            } else {

                const userTag = interaction.user.tag
                const getDataQ = `select * from account where user_tag = '${userTag}'`
                //const dataArr = []

                db.query(getDataQ, (err, result) => {
                    if (err) {
                        console.error('failed to get data: ', err)
                        interaction.reply('akunmu belum terdaftar di db! daftar dengan melakukan perintah /register')
                    } else {
                        try {
                            const nim = result[0].nim
                            const password = result[0].password

                            runningTask = setInterval(() => {
                                //console.log(result)
                                startPuppeteer(nim, password)
                            }, 10000)

                        } catch (error) {
                            console.error(`${userTag}`, error)
                            clearInterval(runningTask)
                            runningTask = null
                            interaction.reply({ content: 'task stopped because of wrong nim or password!', ephemeral: true })
                        }
                    }

                    //console.log(dataArr
                })
            }
        } else if (commandName === 'stop') {
            if (runningTask) {
                clearInterval(runningTask)
                runningTask = null
                await interaction.reply({ content: 'task stopped', ephemeral: true })
            } else {
                await interaction.reply({ content: 'no task running', ephemeral: true })
            }
        }

        if (commandName === 'status') {
            if (runningTask) {
                await interaction.reply({ content: 'task is running!', ephemeral: true })
            } else {
                await interaction.reply({ content: 'no task running', ephemeral: true })
            }
        }

        try {
            await command.execute(interaction)
            console.log(`${interaction.user.tag} used [/]${interaction.commandName} command!`)
        } catch (error) {
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}