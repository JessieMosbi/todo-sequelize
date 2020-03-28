const express = require('express')
const router = express.Router()

// 載入 model
const db = require('../models')
const Todo = db.Todo
const User = db.User

// 載入 auth middleware
const { authenticated } = require('../config/auth')

// 設定首頁路由
// 列出全部 Todo
router.get('/', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error('user not found')

      // return promise object
      return Todo.findAll({
        raw: true, // row, nest: 把資料庫回傳的特殊物件整理成 JavaScript 內建的單純物件
        nest: true,
        where: { UserId: req.user.id }
      })
    })
    .then((todos) => {
      // 這裡不用用 get() 再給 template 嗎？不用，findAll 裡面已轉
      return res.render('index', { todos })
    })
    // Sequelize 的查詢沒有自動處理錯誤的功能，故要自己用 catch 接收
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router
