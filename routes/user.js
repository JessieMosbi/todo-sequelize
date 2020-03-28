const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// 載入 user model
const db = require('../models')
const User = db.User

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})
// 登入檢查
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: '帳密錯誤，請重新登入'
  })(req, res, next)
})
// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})
// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  const errors = []

  // 輸入值檢查
  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有欄位均為必填' })
  }
  if (password !== password2) {
    errors.push({ message: '兩次密碼不一致' })
  }
  if (errors.length > 0) {
    res.render('register', { name, email, password, password2, errors })
    return false
  }

  User.findOne({ where: { email: email } }).then(user => {
    if (user) {
      errors.push({ message: '此信箱已被申請，請更換信箱' })
      res.render('register', { name, email, password, password2, errors })
      return false
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return console.log(err)
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) return console.log(err)
          User.create({
            name,
            email,
            password: hash
          })
            .then(() => {
              req.flash('success_msg', '您已成功註冊，請立即登入')
              res.redirect('/users/login')
            })
            .catch((err) => console.log(err))
        })
      })
    }
  })
})
// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出，若欲繼續使用請重新登入')
  res.redirect('/users/login')
})

module.exports = router
