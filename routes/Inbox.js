const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Inbox } = require('../models');

router.get("/:auth/:id", async (req, res) => {
    const userId = req.params.auth;
    const receiver = req.params.id;
    const messageList1 = await Inbox.findAll({ where: { UserId: userId }});

    let arr1 = [];
    for (let i of messageList1) {
        if (i.receiver === receiver) {
            arr1.push(i);
        }
    }

    const messageList2 = await Inbox.findAll({ where: { UserId: receiver }});

    let arr2 = [];
    for (let i of messageList2) {
        if (i.receiver === userId) {
            arr2.push(i);
        }
    }

    const arr = [...arr1, ...arr2];

    for(var i = 0; i < arr.length; i++) {
        for (var j = 0; j < (arr.length - i - 1); j++) {
            if (arr[j].id > arr[j+1].id) {
                var temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }

    res.json(arr);
})

router.post("/new", async (req, res) => {

    const data = {
        message: req.body.message,
        UserId: req.body.UserId,
        receiver: req.body.receiver,
        author: req.body.author,
        room: req.body.room,
        time: req.body.time,
    }

    await Inbox.create(data);
    res.json(data);
});

module.exports = router;
