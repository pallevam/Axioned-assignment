const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const mongoose = require('mongoose')
mongoose.set('bufferCommands', false)
const User = require('./User')
const jwt = require('jsonwebtoken')

mongoose.connect("mongodb+srv://vamsipalle:Password123@testclustervamsi.sfthy.mongodb.net/Auth-Service", {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log(`Auth-Service database connected`)
})

app.use(express.json())

// Routing
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if(!user) {
        return res.json({ message: "User does not exist!"})
    } else {
        if(password !== user.password) {
            return res.json({ message: "Password incorrect" })
        }
        const payload = {
            email,
            name: user.name,
        }
        jwt.sign(payload, "secret", (err, token) => {
            if(err) console.log(err)
            else {
                return res.json({ token: token })
            }
        })
    }
})


app.post('/auth/register', async (req, res) => {
    const { email, password, name } = req.body

    const userExists = await User.findOne({ email })

    if(userExists) {
        return res.json({ message: "User already exists" })
    }else {
        const newUser = new User({
            name,
            email,
            password
        })
        newUser.save()
        return res.json(newUser)
    }
})

app.listen(PORT, () => {
    console.log(`Auth-Service listening on port ${PORT}`)
})

