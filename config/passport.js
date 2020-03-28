const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

// 載入 User model
const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')

module.exports = passport => {
  // local strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ where: { email: email } })
        .then(user => {
          if (!user) {
            return done(null, false)
          }
          // notice: bcrypt.pswd 要放第一個
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return console.log(err)
            if (!isMatch) {
              return done(null, false)
            }
            return done(null, user) // 會把 user 存在 req.user 裡
          })
        })
        .catch((err) => console.log(err))
    })
  )

  // facebook strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ where: { email: profile._json.email } })
      .then((user) => {
        if (!user) {
          // 產生密碼
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) => {
            if (err) return console.log(err)
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              if (err) return console.log(err)
              User.create({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
                .then((user) => done(null, user))
                .catch((err) => console.log(err))
            })
          })
        } else return done(null, user)
      })
      .catch((err) => console.log(err))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then((user) => {
      user = user.get() // 將複雜的資料庫 Object 轉成 JavaScript 原生的簡單物件 (template 可能要用)
      done(null, user)
    })
  })
}
