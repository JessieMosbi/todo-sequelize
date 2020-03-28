// params
const types = [
  { id: 'all', name: '所有狀態' },
  { id: 0, name: '未完成' },
  { id: 1, name: '已完成' }
]

const express = require('express')
const router = express.Router()

// 載入 model
const db = require('../models')
const Todo = db.Todo
const User = db.User

// 載入 auth middleware
const { authenticated } = require('../config/auth')

// sequelize: MySQL's ORM
const { Op } = require('sequelize')

// 設定首頁路由
// 列出全部 Todo
router.get('/', authenticated, (req, res) => {
  // sql where condition
  const whereCond = { UserId: req.user.id }
  let selType = req.query.type
  if (selType && selType !== 'all') whereCond.done = selType
  else selType = 'all'

  const selDate = req.query.date
  if (selDate) {
    // whereCond.createdAt = { [Op.like]: selDate + '%' }
    // whereCond.updatedAt = { [Op.like]: selDate + '%' }
    const tmpDate = new Date(selDate)
    if (selType === 'all' || selType === '0') {
      whereCond.createdAt = {
        [Op.lt]: tmpDate.setDate(tmpDate.getDate() + 1), // < value
        [Op.gte]: tmpDate.setDate(tmpDate.getDate() - 1) // >= value (tmpData already +1, then -1 to become original)
      }
    }
    if (selType === 'all' || selType === '1') {
      whereCond.updatedAt = {
        [Op.lt]: tmpDate.setDate(tmpDate.getDate() + 1),
        [Op.gte]: tmpDate.setDate(tmpDate.getDate() - 1)
      }
    }
  }

  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error('user not found')

      // return promise object
      return Todo.findAll({
        raw: true, // row, nest: 把資料庫回傳的特殊物件整理成 JavaScript 內建的單純物件
        nest: true,
        where: whereCond
      })
    })
    .then((todos) => {
      // 這裡不用用 get() 再給 template 嗎？不用，findAll 裡面已轉
      return res.render('index', { todos, types, selType, selDate })
    })
    // Sequelize 的查詢沒有自動處理錯誤的功能，故要自己用 catch 接收
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router
