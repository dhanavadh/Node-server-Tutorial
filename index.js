const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT
    })
}

app.get('/testdb', async (req, res) => {
    try {
        const result = await conn.query('SELECT * FROM user')
        res.json(result[0])
    } catch (err) {
        console.error('Error:', err)
        res.status(500).send('An error occurred')
    }
})


app.get('/users', async (req, res) => {
    const result = await conn.query('SELECT * FROM user')
    res.json(result[0])
})

app.post('/users', async (req, res) => {
    try{
        let user = req.body
        const result = await conn.query('INSERT INTO user SET ?', user)
        console.log('Insert result:', result)
        res.json({
            message: 'User created successfully',
            data: result[0],
        })
    } catch (err) {
        console.error('Error inserting user:', err)
        res.status(500).send('An error occurred while creating user')
    }
})

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id
    try {
        const result = await conn.query('SELECT * FROM user WHERE id = ?', userId)
        if (result[0].length === 0) {
            return res.status(404).send('User not found')
        }
        res.json(result[0][0])
    } catch (err) {
        console.error('Error fetching user:', err)
        res.status(500).send('An error occurred while fetching user')
    }
}
)

app.put('/users/:id', async (req, res) => {
    
    try{
        let id = req.params.id
        let updateUser = req.body    
        const result = await conn.query('UPDATE user SET ? WHERE id = ?', [updateUser, id])
        console.log('Update result:', result)
        res.json({
            message: 'User updated successfully',
            data: result[0],
        })
    } catch (err) {
        console.error('Error inserting user:', err)
        res.status(500).send('An error occurred while creating user')
    }
})

app.delete('/users/:id', async (req, res) => {
    
    try{
        let id = req.params.id
        const result = await conn.query('DELETE FROM user WHERE id = ?', id)
        res.json({
            message: 'User deleted successfully',
            data: result[0],
        })
    } catch (err) {
        console.error('Error deleted user:', err)
        res.status(500).send('An error occurred while deleting user')
    }
})


// Promise
// app.get('/test', (req,res) =>{
//     mysql.createConnection({
//         host: '127.0.0.1',
//         user: 'root',
//         password: 'root',
//         database: 'tutorial',
//         port: 8889
//     }).then((conn) => {
//         conn.query('SELECT id FROM user')
//         .then((result) => {
//             res.json(result[0])
//         }).catch(err => {
//             console.error('Error executing query:', err)
//             res.status(500).send('Database query failed')
//         })
//     })
// })

// Async-await
// app.get('/testasync', async (req,res) =>{
//     try {
//         const conn = await mysql.createConnection({    
//         host: '127.0.0.1',
//         user: 'root',
//         password: 'root',
//         database: 'tutorial',
//         port: 8889
//         })
//         const result = await conn.query('SELECT * FROM user')
//         res.json(result[0])
//     } catch (err) {
//         console.error('Error:', err)
//         res.status(500).send('An error occurred')
//     }
    
   
// })

let users = []
let counter = 1

app.listen(8000, async (req, res) => {
    await initMySQL()
    console.log('Server started on port 8000')
})