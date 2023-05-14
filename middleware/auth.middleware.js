const express = require("express")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../model/user.model")
var cookieParser = require('cookie-parser')
const { BlacklistModel } = require("../model/block")
const fs = require("fs")
const app= express()
app.use(cookieParser())

const authenticate = async (req, res, next) => {
  let token = fs.readFileSync('./token.txt',
    { encoding: 'utf8'});
 console.log("middleware", token)
  if (token) {
    const blocked = await BlacklistModel.find({ token })
    if (blocked.length > 0) {
      res.end("Your Logged out, Please login again")
    }

    jwt.verify(token, "imran", async (err, decoded) => {
      if (decoded) {
        // req.body.user = decoded.userId
        // req.user = await UserModel.find({ _id: decoded.userId })
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        next()
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      }
      else {
        res.send({ "msg": "Please login first" })
      }
    });
  }
  else {
    res.send({ "msg": "Please login first" })
    // res.status(400).send({ "msg": "Please login first" })
  }

}

module.exports = {
  authenticate
}