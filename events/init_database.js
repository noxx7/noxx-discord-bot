const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.connect((err) => {
    if (err) {
        console.error('couldnt connect to database: ', err)
        return
    }
    console.log('connected to db!')
})

module.exports = { db }
