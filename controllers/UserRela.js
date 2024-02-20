const nodemailer = require('nodemailer');
const { Op, where } = require("sequelize");

const { Users, UserRela } = require("../models");
require('dotenv').config();

const addFriends = async (req, res) => {
    try {
        const User1 = req.user.id;
        const User2 = req.body.user;

        if (User1 === User2) {
            res.status(400).json({
                message: "error",
                error: "Invalid userid"
            });
        } else {
            const checker = await UserRela.findOne({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { User1: User1 }, { User1: User2 }
                            ]
                        },
                        {
                            [Op.or]: [
                                { User2: User2 }, { User2: User1 }
                            ]
                        }
                    ]
                }
            })

            if (checker === null) {
                await UserRela.create({ User1: User1, User2: User2 })
                res.status(201).json({
                    message: "Add Friend Successfully"
                })
            } else if (checker !== null) {
                if (checker.status === 0 && User1 === checker.User2) {
                    const newFr = await UserRela.update({ status: 1 }, { where: { id: checker.id } });
                    res.status(200).json({
                        message: "Confirm friend invitation!"
                    })
                } else if (checker.status === 0 && User1 === checker.User1) {
                    res.status(400).json({
                        message: "error",
                        error: "Wait for response!!!"
                    })
                } else if (checker.status === 1) {
                    res.status(200).json({
                        message: "Already be friend!"
                    })
                }
            }
        }

    } catch (err) {
        res.status(400).json({
            message: "error",
            error: err.message
        });
    }
}

const deleteFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.query.id;

        const checker = await UserRela.findOne({
            attributes: ['id', 'User1', 'User2'],
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { User1: userId }, { User1: id }
                        ]
                    },
                    {
                        [Op.or]: [
                            { User2: id }, { User2: userId }
                        ]
                    }
                ]
            }
        })

        if (checker === null) {
            res.status(400).json({
                message: "error",
                error: "Not found in the friend list"
            });
        } else {
            if (checker.User1 === userId || checker.User2 === userId) {
                await UserRela.destroy({ where: { id: checker.id } });
                res.status(200).json({
                    message: "Unfriend",
                })
            } else {
                res.status(400).json({
                    message: "error",
                    error: "You are not allowed to delete"
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            message: "error",
            error: err.message
        });
    }
}

const getListFriend = async (req, res) => {
    try {
        const id = req.user.id;

        const list = await UserRela.findAll({
            attributes: ['User1', 'User2'],
            where: {
                status: 1,
                [Op.or]: [
                    { User1: id },
                    { User2: id }
                ]
            }
        });

        const friendIds = list.map(fr => {
            if (fr.User1 === id)
                return fr.User2;
            else
                return fr.User1;
        })

        const friends = await Users.findAll({
            attributes: ['id', 'nickname', 'username', 'avatar', 'online'],
            where: { id: friendIds }
        })

        res.status(200).json(friends);
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server ông ơi",
            error: err.message
        })
    }
}

const getFriendRequest = async (req, res) => {
    try {
        const id = req.user.id;

        const list = await UserRela.findAll({
            attributes: ['id'],
            where: {
                status: 0,
                User2: id
            },
            include: [
                {
                    attributes: ['id', 'nickname', 'username', 'avatar', 'online'],
                    model: Users
                }
            ]
        });

        res.status(200).json({
            message: "Successfully get friend request",
            data: list
        });
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server ông ơi",
            error: err.message
        })
    }
}

module.exports = {
    addFriends,
    deleteFriend,
    getListFriend,
    getFriendRequest
}