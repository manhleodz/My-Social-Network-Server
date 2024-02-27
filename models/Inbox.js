module.exports = (sequelize, DataTypes) => {
    const Inbox = sequelize.define("Inbox", {
        receiver: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sender: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
        },
        room: {
            type: DataTypes.STRING,
        }
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    Inbox.associate = (models) => {
        Inbox.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "sender",
            as: "Sender"
        });
        Inbox.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "receiver",
            as: "Receiver"
        });
    };
    return Inbox;
};