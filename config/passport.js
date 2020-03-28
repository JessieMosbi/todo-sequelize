// config/passport.js
const LocalStrategy = require('passport-local').Strategy

// 載入 User model
const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')

module.exports = passport => {
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
    })
  )

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
