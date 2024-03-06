module.exports = (sequelize, DataTypes) => {
    const Channels = sequelize.define("Channels", {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('now'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('now'),
        }
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    Channels.associate = (models) => {
        Channels.hasMany(models.UserRela, {
            foreignKey: "ChannelId"
        });
        Channels.hasMany(models.Inbox, {
            foreignKey: "ChannelId"
        })
    }

    return Channels;
};