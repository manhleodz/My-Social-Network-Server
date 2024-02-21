const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");

const { Users, UserRela } = require("../models");
const { sign } = require('jsonwebtoken');
require('dotenv').config();

const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env.js');
const { Decode } = require('../helpers/Decode.js');

const signup = async (req, res) => {

    try {
        const { email, password } = req.body;

        const duplication = await Users.findOne({
            where: { email: email }
        })

        if (duplication == null) {
            let id;
            bcrypt.hash(password, 10).then(async (hash) => {
                const newAccount = await Users.create({
                    password: hash,
                    email: email,
                });

                id = newAccount.id;
            }).then((e) => {
                const accessToken = sign(
                    { email: email, id: id },
                    process.env.SECRET_KEY
                )
                res.status(200).json(accessToken);
            })
        } else {
            res.status(400).json("Email đã tồn tại");
        }

    } catch (error) {
        res.status(400).json({
            message: "error",
            error: error.message
        });
    }
}

const makeInfo = async (req, res) => {

    try {
        const data = req.body;
        data.confirm = 1;
        const username = data.username;
        const email = req.user.email.trim();

        const duplication = await Users.findAll({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        })

        if (duplication.length === 1) {
            await Users.update(data, { where: { email: email } }).then(e => {
                const accessToken = sign(
                    { username, id: duplication[0].id, confirm: 1, email },
                    process.env.SECRET_KEY
                )
                res.status(200).json({
                    message: "Successfull",
                    token: accessToken,
                    email: duplication.email,
                    confirm: duplication.confirm,
                    avatar: duplication.avatar,
                    email: duplication.email,
                    id: duplication.id,
                    nickname: duplication.nickname
                });
            })
        } else {
            res.status(400).json({
                error: "Tên đăng nhập đã tồn tại"
            });
        }

    } catch (error) {
        res.status(400).json({
            message: "Error",
            error: error.message
        });
    }
}

const verifyEmail = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        var OTP = req.body.OTP;
        OTP = Decode(OTP);

        let config = {
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        }

        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: process.env.APP_NAME,
                link: process.env.APP_LINK,
            }
        })

        let response = {
            body: {
                name: email,
                intro: "ML xin chào",
                table: {
                    data: [
                        {
                            "Thông tin": "Mã OTP",
                            OTP: OTP,
                        }
                    ]
                },
                outro: "Chúc bạn một ngày tốt lành <3"
            }
        }

        let mail = MailGenerator.generate(response)

        let message = {
            from: EMAIL,
            to: email,
            subject: "New Account",
            html: mail
        }

        var excuting = true;
        let message1 = "";

        if (password === "" || email === "") {
            res.status(400).json("Vui lòng nhập đầy đủ thông tin");
        } else {

            const duplication = await Users.findOne({
                where: {
                    email: email
                }
            })

            if (duplication != null) {
                excuting = false;
                message1 = "Email đã được sử dụng";
            }
        }

        if (excuting === false) {
            res.status(400).json(message1);
        } else {
            transporter.sendMail(message).then(() => {

                return res.status(201).json({
                    msg: "you should receive an email"
                })
            }).catch(error => {
                return res.status(400).json(error)
            })
        }

    } catch (err) {
        res.status(400).json({
            message: "error",
            error: err.message
        });
    }
}

const login = async (req, res) => {

    try {

        const { information, password } = req.body;

        const user = await Users.findOne({
            attributes: ['id', 'username', 'nickname', 'avatar', 'password', 'confirm', 'email'],
            where: {
                [Op.or]: [
                    { username: information },
                    { email: information }
                ]
            }
        });

        if (!user) res.status(400).json("Tên người dùng hoặc email không tồn tại");
        else
            bcrypt.compare((password), user.password).then((match) => {
                if (!match) {
                    res.status(400).json("Sai mật khẩu");
                } else {
                    if (user.confirm === 0) {
                        const accessToken = sign({
                            email: user.email,
                            id: user.id
                        }, process.env.SECRET_KEY)
                        res.status(200).json({
                            message: "authentication has not been completed",
                            token: accessToken,
                            email: user.email,
                            confirm: user.confirm,
                        });
                    } else if (user.confirm === 1) {
                        const accessToken = sign({
                            email: user.email,
                            id: user.id,
                        }, process.env.SECRET_KEY)
                        res.status(200).json({
                            message: "Successfull",
                            token: accessToken,
                            email: user.email,
                            confirm: user.confirm,
                            avatar: user.avatar,
                            email: user.email,
                            id: user.id,
                            nickname: user.nickname
                        });
                    }
                }
            }).catch((e) => res.status(400).json("Lỗi input"))
    } catch (err) {
        res.status(400).json({
            message: "error",
            error: err.message
        });
    }
}

const getProfile = async (req, res) => {

    try {
        const info = req.params.info;
        const userId = req.user.id;
        if (isNaN(info)) {
            const profile = await Users.findOne({
                attributes: ['id', 'username', 'nickname', 'avatar', 'gender', 'background', 'address', 'story', 'workAt', 'studyAt', 'favorites', 'birthday', 'online'],
                where: { username: info }
            })

            const checker = await UserRela.findOne({
                attributes: ['id', 'User1', 'User2', 'status'],
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { User1: userId }, { User1: profile.id }
                            ]
                        },
                        {
                            [Op.or]: [
                                { User2: profile.id }, { User2: userId }
                            ]
                        }
                    ]
                }
            });

            let isFriend = -1;
            if (checker) {
                if (checker.status === 0 && userId === checker.User1)
                    isFriend = 1;
                else if (checker.status === 0 && userId === checker.User2)
                    isFriend = 2;
                else if (checker.status === 1)
                    isFriend = 3;
            } else {
                isFriend = 0;
            }
            res.status(200).json({
                message: "Get profile successfully",
                profile: profile,
                isFriend
            });
        } else {
            const profile = await Users.findOne({
                attributes: ['id', 'username', 'nickname', 'avatar', 'gender', 'background', 'address', 'story', 'workAt', 'studyAt', 'favorites', 'birthday', 'online'],
                where: { id: info }
            });

            const checker = await UserRela.findOne({
                attributes: ['id', 'User1', 'User2'],
                where: {
                    status: 1,
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { User1: userId }, { User1: profile.id }
                            ]
                        },
                        {
                            [Op.or]: [
                                { User2: profile.id }, { User2: userId }
                            ]
                        }
                    ]
                }
            });

            let isFriend = -1;
            if (checker) {
                if (checker.status === 0 && userId === checker.User1)
                    isFriend = 1;
                else if (checker.status === 0 && userId === checker.User2)
                    isFriend = 2;
                else if (checker.status === 1)
                    isFriend = 3;
            } else {
                isFriend = 0;
            }
            res.status(200).json({
                message: "Get profile successfully",
                profile: profile,
                isFriend
            });
        }
    } catch (err) {
        res.status(400).json({
            message: "error",
            error: err.message
        });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        const newInfo = await Users.update(updateData, {
            where: { id: userId }
        });

        res.status(200).json({
            message: "Update profile successfully",
        });
    } catch (err) {
        res.status(400).json({
            message: "error",
            error: err.message
        });
    }
}

const refreshStateUser = async (req, res) => {

    try {
        const email = req.user.email;
        const info = await Users.findOne({
            attributes: ['id', 'username', 'nickname', 'avatar', 'confirm'],
            where: { email: email }
        });

        if (info) {
            res.status(200).json(info);
        } else {
            res.status(404).json("404 Not Found");
        }
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    signup,
    verifyEmail,
    login,
    makeInfo,
    getProfile,
    updateUserProfile,
    refreshStateUser
}