const jwt = require('jsonwebtoken')

async function isAuthenticated(req, res, next) {
    const token = req.header["authorization"].split(" ")[1]

    await jwt.verify(token, "secret", (err, user) => {
        if(err) {
            return res.json({ message: err })
        }
        else {
            req.user = user
            next()
        }
    })
}

module.exports = isAuthenticated