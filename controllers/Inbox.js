const { Users, Inbox, Channels, ChannelMembers } = require("../models");
const Sequelize = require('sequelize');
const op = Sequelize.Op;

const getMessage = async (req, res) => {

    try {

        const friend = req.params.friend;
        const userId = req.user.id;

        const list = await Inbox.findAll({
            attributes: ['id','sender', 'message', 'room', 'createdAt'],
            where: {
                [op.or]: [
                    { receiver: userId, sender: friend },
                    { receiver: friend, sender: userId },
                ]
            },
            limit: 20,
            offset: 0
        })

        res.status(200).json({
            message: "Lấy thành công ông ơi",
            data: list,
        })
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server",
            error: err.message
        });
    }
}

const sendMessaeg = async (req, res) => {
    try {

        let data = req.body;
        const sender = req.user.id;

        data.sender = sender;

        const newMessage = await Inbox.create(data);

        res.status(200).json({
            message: "Send successfully",
            data: newMessage
        })
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server",
            error: err.message
        });
    }
}

const deleteMessage = async (req, res) => {

    try {

        const id = req.params.id;
        const userId = req.user.id;

        const checker = await Inbox.findByPk(id, {
            attributes: ['sender']
        });

        if (checker.sender == userId) {
            await Inbox.destroy({
                id: id
            });

            res.status(200).json({
                message: "Deleted successfully",
            })
        } else {
            res.status(200).json({
                message: "You don't have permission",
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server",
            error: err.message
        });
    }
}

const createGroup = async (req, res) => {

}

const deleteGroup = async (req, res) => {

}

module.exports = {
    getMessage,
    sendMessaeg,
    deleteMessage,
    createGroup,
    deleteGroup
}