module.exports = (sequelize, DataTypes) => {
    const Inbox = sequelize.define("Inbox", {
        receiver: {
            type: DataTypes.STRING,
        },
        author: {
            type: DataTypes.STRING,
        },
        message: {
            type: DataTypes.TEXT,
        },
        room: {
            type: DataTypes.STRING,
        },
        time: {
            type: DataTypes.STRING,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });

    return Inbox;
};