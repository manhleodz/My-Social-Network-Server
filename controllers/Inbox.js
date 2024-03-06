const { Users, Inbox, Channels, ChannelMembers } = require("../models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getMessage = async (req, res) => {

    try {

        const ChannelId = req.params.channelId;
        const userId = req.user.id;

        const checker = await ChannelMembers.findAll({
            attributes: ['id', 'role', 'UserId'],
            where: {ChannelId: ChannelId}
        })

        const list = await Inbox.findAll({
            attributes: ['id', 'sender', 'message', 'room', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']],
            limit: 20,
            where: { ChannelId: ChannelId },
        })

        res.status(200).json({
            message: "Lấy thành công ông ơi",
            data: list.reverse(),
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

const OpenChat = async (req, res) => {

    try {

        const User2 = req.params.user;
        const UserId = req.user.id;

        if (UserId === User2) {

        } else {
            const checker = await UserRela.findOne({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { User1: UserId }, { User1: User2 }
                            ]
                        },
                        {
                            [Op.or]: [
                                { User2: User2 }, { User2: UserId }
                            ]
                        }
                    ]
                }
            })

        }

    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
}

const createGroup = async (req, res) => {
    try {

        const { name, avatar, public } = req.body;
        const userId = req.user.id;

        if (!name) throw new Error("Thiếu tên kênh chat!");

        if (!public) throw new Error("Thiếu trường bảo mật của kênh chat!");

        if (!avatar) throw new Error("Thiếu ảnh đại diện của kênh chat!");

        await Channels.create({
            name,
            public,
            avatar
        }).then(async (result) => {
            const member = await ChannelMembers.create({
                ChannelId: result.id,
                role: 1,
                UserId: userId,
            });

            res.status(200).json({
                message: "Created successfully!",
                channel: result,
                member: member
            });
        }).catch((err) => {
            throw new Error(err.message);
        });

    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
}

const deleteGroup = async (req, res) => {
    try {

        const ChannelId = req.query.ChannelId;
        const userId = req.user.id;

        const checker = await ChannelMembers.findOne({
            attributes: ['id', 'role'],
            where: { ChannelId: ChannelId, UserId: userId }
        })

        if (!checker) throw new Error("No such channel id");

        if (checker.role === 2) throw new Error("You dont have permission!");

        if (checker.role === 1) {
            await Channels.destroy({ where: { id: ChannelId } });
            res.status(200).json({
                message: "Deleted successfully!"
            });
        }

    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
}

module.exports = {
    getMessage,
    sendMessaeg,
    deleteMessage,
    createGroup,
    deleteGroup
}