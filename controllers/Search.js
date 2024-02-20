const { Search, Users } = require('../models');
const Sequelize = require('sequelize');
require('dotenv').config();
const util = require('util');
const op = Sequelize.Op;

const Redis = require('redis');

const redisClient = Redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const DEFAULT_EXPIRATION = 300;

redisClient.connect().catch(console.error);

if (!redisClient.isOpen) {
    redisClient.connect().catch(console.error);
};

const newSearch = async (req, res) => {

    try {
        const search = req.body.search;
        const UserId = req.user.id;

        if (search === undefined || search.trim().length === 0) {
            res.status(400).json({
                message: "What are you doing, mtf?"
            });
        } else {
            const checker = await Search.findOne({
                attributes: ['id', 'times'],
                where: {
                    body: search,
                    UserId: UserId
                }
            });

            if (checker) {
                await Search.update({ times: (Number)(checker.times + 1) }, { where: { id: checker.id } });
            } else {
                await Search.create({
                    body: search,
                    UserId: UserId
                })
            }

            res.status(200).json({
                message: "Updated successfully"
            });
        }

    } catch (err) {
        res.status(400).json({
            message: "Lỗi server",
            error: err.message
        });
    }
};

function removeAccents(str) {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substring(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
};

const topResult = async (req, res) => {

    try {
        const search = req.query.search;

        if (search === undefined || search.length === 0 || search.trim().length === 0) {
            res.status(400).json({
                message: "What are you doing, mtf?"
            });
        } else {
            let listUser = await redisClient.get(`top/search=${search}`);

            if (listUser && listUser.length > 0) {
                const data = JSON.parse(listUser);

                res.status(200).json({
                    search,
                    data
                });

            } else {
                const newList = await Users.sequelize.query(
                    `
                    SELECT username, avatar, nickname FROM "Users" WHERE lower(unaccent(nickname)) ILIKE lower(unaccent('%${search}%')) ORDER BY "Users"."id" DESC LIMIT 6;
                    `
                )

                const data = newList[0];

                if (data.length > 0) {
                    await redisClient.SETEX(`top/search=${search}`, DEFAULT_EXPIRATION, JSON.stringify(data));
                    res.status(200).json({
                        search,
                        data
                    });
                } else {
                    res.status(204).json("There are no search results");
                }
            }
        }
    } catch (err) {
        res.status(400).json({
            message: "Lỗi",
            error: err.message
        });
    }
};

const result = async (req, res) => {

    try {
        const search = req.query.search;
        const page = req.query.page;

        if (search === undefined || page === undefined || search.length === 0 || page.length === 0 || search.trim().length === 0) {
            res.status(400).json({
                message: "What are you doing, mtf?"
            });
        } else {
            let listUser = await redisClient.get(`search=${search}&page=${page}`);

            if (listUser && listUser.length > 0) {
                const data = JSON.parse(listUser);

                if (listUser.length > 6) {
                    res.status(200).json({
                        search,
                        page: (Number)(page) + 1,
                        hasMore: true,
                        data
                    });
                } else {
                    res.status(200).json({
                        search,
                        page: (Number)(page) + 1,
                        hasMore: false,
                        data
                    });
                }

            } else {

                const newList = await Users.sequelize.query(
                    `
                    SELECT 
                        "Posts".*, 
                         "User"."id" AS "User.id", "User"."username" AS "User.username", "User"."nickname" AS "User.nickname", "User"."avatar" AS "User.avatar",
                        "Images"."link" AS "Images.link", "Images"."id" AS "Images.id",
                        "Videos"."link" AS "Videos.link", "Videos"."id" AS "Videos.id"
                    FROM (
                        SELECT 
                            "Posts"."id", "Posts"."postText", "Posts"."public", "Posts"."likeNumber", "Posts"."commentNumber", "Posts"."sharedNumber", "Posts"."createdAt", "Posts"."updatedAt", "Posts"."UserId" 
                        FROM "Posts" AS "Posts" WHERE lower(unaccent("Posts"."postText")) = lower(unaccent('%${search}%')) ORDER BY "Posts"."id" DESC LIMIT 4 OFFSET ${page * 4 + 4}) AS "Posts"
                        LEFT OUTER JOIN "Users" AS "User" ON "Posts"."UserId" = "User"."id"
                        LEFT OUTER JOIN "Images" AS "Images" ON "Posts"."id" = "Images"."PostId" 
                        LEFT OUTER JOIN "Videos" AS "Videos" ON "Posts"."id" = "Videos"."PostId"
                        ORDER BY "Posts"."id" DESC;
                    `
                )
                const data = newList[0];
                if (data.length > 0) {
                    await redisClient.SETEX(`search=${search}&page=${page}`, DEFAULT_EXPIRATION, JSON.stringify(data));

                    if (data.length > 6) {
                        res.status(200).json({
                            search,
                            page: (Number)(page) + 1,
                            hasMore: true,
                            data
                        });
                    } else {
                        res.status(200).json({
                            search,
                            page: (Number)(page) + 1,
                            hasMore: false,
                            data
                        });
                    }
                } else {
                    res.status(204).json("There are no search results");
                }
            }
        }
    } catch (err) {
        res.status(400).json({
            message: "Lỗi",
            error: err.message
        });
    }
};

const deleteSearch = async (req, res) => {

    try {

        const id = req.params.id;
        await Search.destroy({ where: { id: id } });
        res.status(200).json({
            message: "Deleted successfully"
        });
    } catch (err) {
        res.status(400).json({
            message: "Lỗi server",
            error: err.message
        });
    }
};

module.exports = {
    newSearch,
    deleteSearch,
    topResult,
    result
}