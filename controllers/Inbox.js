const { list } = require("firebase/storage");
const { Users, UserRela, Inbox, Channels, ChannelMembers, InboxGroup } = require("../models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getConversationMessage = async (req, res) => {

    try {

        const RelationshipId = req.params.RelationshipId;
        const userId = req.user.id;

        const list = await Inbox.findAll({
            attributes: ['id', 'sender', 'message', 'RelationshipId', 'createdAt', 'updatedAt'],
            order: [['id', 'DESC']],
            limit: 20,
            where: { RelationshipId: RelationshipId },
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

const seenMessage = async (req, res) => {
    try {

        const idx = (req.params.RelationshipId);

        await UserRela.update({
            seen: true,
        }, { where: { id: idx } })

        res.status(200).json("Succes")
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server",
            error: err.message
        });
    }
};

const sendConversationMessage = async (req, res) => {
    try {

        const { receiver, message, type, RelationshipId } = req.body;

        if (!receiver || !message || !type || !RelationshipId) throw new Error("Cannot send conversation message");
        const sender = req.user.id;

        const data = { receiver, message, type, RelationshipId, sender };
        const newMessage = await Inbox.create(data);

        await UserRela.update({
            lastMessage: newMessage.id,
            seen: false,
            updatedAt: Sequelize.fn("now")
        }, { where: { id: RelationshipId } });

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
                where: { id: id }
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

const changeMessage = async (req, res) => {

    try {

        const id = req.params.id;
        const userId = req.user.id;
        const { message } = req.body;

        const checker = await Inbox.findByPk(id, {
            attributes: ['sender']
        });

        if (checker.sender == userId) {
            await Inbox.update({
                message: message,
                updatedAt: Sequelize.fn("now")
            }, { where: { id: id } });

            res.status(200).json({
                message: "Successfully",
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

const getListGroups = async (req, res) => {

    try {

        const userId = req.user.id;

        const data = await Channels.findAll({
            attributes: ['id', 'name', 'avatar', 'background', 'createdAt', 'lastMessage', 'updatedAt'],
            include: [{
                model: InboxGroup,
                required: false,
                where: Sequelize.literal(`"InboxGroups"."id" =  "Channels"."lastMessage"`),
                attributes: ['message', 'type', 'sender'],
                include: [{
                    model: ChannelMembers,
                    required: false,
                    attributes: ['nickname']
                }]
            }, {
                model: ChannelMembers,
                attributes: ["id", "nickname", "role"],
                where: { UserId: userId }
            }]
        })

        if (data.length === 0) res.status(204).json("success");

        else {

            res.status(200).json({
                message: "Successfully",
                data: data
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
};

const getGroupById = async (req, res) => {

    try {

        const userId = req.user.id;
        const id = req.params.id;

        const result = await Channels.findByPk(id, {
            attributes: ['id', 'name', 'avatar', 'background', 'updatedAt', 'lastMessage'],
            include: [{
                model: InboxGroup,
                where: { ChannelId: id }
            }]
        })

        if (!result) res.status(404).json("");

        else {
            res.status(200).json({
                message: "Successfully",
                data: result
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
};

const getGroupMessage = async (req, res) => {

    try {

        const ChannelId = req.params.ChannelId;
        const userId = req.user.id;

        const checker = await ChannelMembers.findOne({
            where: {
                ChannelId: ChannelId,
                UserId: userId
            }
        });

        if (!checker) throw new Error("Bạn không có quyền truy cập nhóm chat này!");

        const list = await InboxGroup.findAll({
            attributes: ['id', 'sender', 'message', 'ChannelId', 'createdAt', 'updatedAt'],
            order: [['id', 'DESC']],
            limit: 20,
            include: [{
                attributes: ['nickname', 'UserId', 'role'],
                model: ChannelMembers,
                include: [{
                    model: Users,
                    attributes: ['username', 'smallAvatar']
                }]
            }],
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
};

const sendGroupMessage = async (req, res) => {
    try {

        const { message, type, ChannelId } = req.body;

        if (!message || !type || !ChannelId) throw new Error("Cannot send group message");
        const userId = req.user.id;

        const checker = await ChannelMembers.findOne({
            attributes: ['id'],
            where: { UserId: userId, ChannelId: ChannelId }
        })

        if (!checker) throw new Error("Bạn không phải thành viên của nhóm chat này");

        const data = { message, type, ChannelId, sender: checker.id };

        const newMessage = await InboxGroup.create(data)

        await Channels.update({
            lastMessage: newMessage.id,
            updatedAt: Sequelize.fn("now")
        }, { where: { id: ChannelId } })

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

const deleteGroupMessage = async (req, res) => {

    try {

        const id = req.params.id;
        const userId = req.user.id;

        const checker = await InboxGroup.findByPk(id, {
            attributes: ['sender']
        });

        if (checker.sender == userId) {
            await InboxGroup.destroy({
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

const changeGroupMessage = async (req, res) => {

    try {

        const id = req.params.id;
        const userId = req.user.id;
        const { message } = req.body;

        const checker = await InboxGroup.findByPk(id, {
            attributes: ['sender']
        });

        if (checker.sender == userId) {
            await InboxGroup.update({
                message: message,
                updatedAt: Sequelize.fn("now")
            }, { where: { id: id } });

            res.status(200).json({
                message: "Successfully",
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

const addUserIntoGroup = async (req, res) => {

    try {
        const userId = req.user.id;
        const { ListUser, ChannelId } = req.body;

        if (!ListUser) throw new Error("Thiếu danh sách người dùng");

        if (!ChannelId) throw new Error("Thiếu thông tin id của nhóm chat");

        const checkRole = await ChannelMembers.findOne({
            attributes: ['id', 'role'],
            where: { UserId: userId, ChannelId: ChannelId }
        })

        if (!checkRole) throw new Error("Thành viên nhóm không tồn tại");

        if (checkRole.role !== 1) throw new Error("Bạn không có quyền thêm người dùng!")

        let ListId = [];
        for (let e of ListUser) {
            ListId.push(e.id);
        }

        const checker = await ChannelMembers.findAll({
            where: {
                ChannelId: ChannelId,
                UserId: ListId
            }
        })

        if (checker.length > 0) {
            throw new Error("Người dùng đã trong nhóm chat");
        }

        if (ListId.length === 1) {
            await ChannelMembers.create({
                ChannelId: ChannelId,
                role: 2,
                UserId: ListId[0],
                nickname: ListUser[0].nickname
            });

            res.status(200).json({
                message: "Thêm người dùng thành công",
            });
        } else {

            const data = [];

            for (let i of ListUser) {
                data.push({
                    ChannelId: ChannelId,
                    UserId: i.id,
                    role: 2,
                    nickname: i.nickname
                })
            }

            await ChannelMembers.bulkCreate(data);

            res.status(200).json({
                message: "Thêm người dùng thành công",
                data: checkRole
            });
        }
    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
}

const changeRoleUser = async (req, res) => {

    try {

        const { UserId, role, ChannelId } = req.body;

    } catch (err) {
        res.status(400).json({
            message: "Lỗi bé ơi",
            error: err.message
        });
    }
};

const createGroup = async (req, res) => {
    try {

        const { name, avatar, public, nickname } = req.body;
        const userId = req.user.id;

        if (!nickname) throw new Error("Thiếu tên người tạo kênh chat");

        if (!name) throw new Error("Thiếu tên kênh chat!");

        if (!public) throw new Error("Thiếu trường bảo mật của kênh chat!");

        if (!avatar) throw new Error("Thiếu ảnh đại diện của kênh chat!");

        const newChannel = await Channels.create({
            name,
            public,
            avatar
        })

        await ChannelMembers.create({
            ChannelId: newChannel.id,
            role: 1,
            UserId: userId,
            nickname: nickname
        }).then(async (result) => {

            let channel = newChannel;
            channel = {
                ...channel,
                "ChannelMembers": [result]
            }

            res.status(200).json({
                message: "Created successfully!",
                data: {
                    ...channel["dataValues"],
                    ChannelMembers: channel["ChannelMembers"]
                }
            });
        }).catch(async (err) => {
            await Channels.destroy({
                where: { id: newChannel.id }
            })
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
    getConversationMessage,
    sendConversationMessage,
    deleteMessage,
    changeMessage,
    createGroup,
    getListGroups,
    deleteGroup,
    sendGroupMessage,
    deleteGroupMessage,
    getGroupById,
    changeGroupMessage,
    getGroupMessage,
    seenMessage,
    addUserIntoGroup
}