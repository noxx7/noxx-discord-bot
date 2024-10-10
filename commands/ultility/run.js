const puppeteer = require('puppeteer')
const { SlashCommandBuilder } = require('discord.js')
const { db } = require('../../events/init_database');
const { RETRY_DELAY } = require('puppeteer');
const wait = require('node:timers/promises').setTimeout;
//const { startInterval } = require('../../events/interactionCreate')

let isLogin
let isAbsen

function startPuppeteer(nim, password) {
    runPuppeteer(nim, password)
    console.log('running task')
}

async function runPuppeteer(nim, password) {

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    //await page.setViewport({ width: 1080, height: 1024 });

    try {
        await page.goto("https://kalam.umi.ac.id/login/index.php");

        await page.locator('#username').fill(nim)
        await page.locator('#password').fill(password)

        await page.locator('#loginbtn').click()

        await page.waitForNavigation()

        await page.goto('https://kalam.umi.ac.id/calendar/view.php')

        isLogin = true

        const absentEvent = await page.evaluate(() => {
            const absenElement = document.querySelectorAll('.m-t-1')
            const absenArray = [];

            absenElement.forEach(event => {
                const absenTime = event.querySelector('.row > .col-xs-11 > a')?.innerText || "no event name"
                const courseName = event.querySelector('.mt-1 > .col-xs-11 > a')?.innerText || "no event name"

                absenArray.push({
                    time: absenTime,
                    course: courseName
                })
            })
            return absenArray
        })

        if (absentEvent[0].time === 'Today') {
            console.log('login true ')

            console.log(`\nada absen ${absentEvent[0].course} hari ini`)

            setTimeout(() => { }, 2000)
            await page.locator('.mt-1 > .col-xs-11 > a').click()
            await page.waitForNavigation()

            await page.locator('#module-710017 > div > .mod-indent-outer > div > .activityinstance > a').click();

            await page.waitForNavigation()

            console.log(`mengisi absen ${absentEvent[0].course}....`)
            await page.locator('.c2 > a').click()

            await page.waitForNavigation()
            await page.locator('#id_status_255952').click();

            await page.locator('.fitem > span > #id_submitbutton').click()

            console.log(`absen ${absentEvent[0].course} sudah terisi!`)
            matkulName = absentEvent[0].course
            isAbsen = true
        } else {
            console.log(`${userTag} tidak memiliki absen`)
            isAbsen = false
        }

        await browser.close()
    } catch (error) {
        isLogin = false
        console.error(`${userTag}: `, error)
        await browser.close();
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('run')
        .setDescription('run bot absen'),

    async execute(interaction) {
        const getUserTag = interaction.user.tag
        userTag = getUserTag

        await interaction.deferReply()
        await wait(15_000)

        if (!isLogin) {
            await interaction.editReply({ content: `nim atau password salah!`, ephemeral: true })
        } else if (isLogin) {
            await interaction.editReply({ content: 'berhasil login!', ephemeral: true })
        }

        if (isAbsen) {
            await wait(4_000)
            interaction.editReply({ content: `berhasil mengisi absen untuk matkul ${matkulName}`, ephemeral: true })
        }
    },

    startPuppeteer
}