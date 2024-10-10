const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const dbName = process.env.DB_NAME

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: dbName,
})

db.connect((err) => {
    if (err) {
        console.error('couldnt connect to database: ', err)
        return
    }
    console.log('connected to db!')

    const checkdb = `show databases`

    db.query(checkdb, (err, result) => {
        if (err) {
            console.error(err)
        } else if (result.length > 0) {
            db.query(`use ${dbName}`)
        } else {
            console.log(`${dbName} didnt exist`)
        }
    })
})

module.exports = { db }
