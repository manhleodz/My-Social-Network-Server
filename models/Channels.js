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
        background: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lastMessage: {                                                      // dạng `${UserId}@@split@@${message}`
            type: DataTypes.TEXT,
            allowNull: true
        },
        seen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        Channels.hasMany(models.Inbox, {
            foreignKey: "ChannelId"
        })

        Channels.hasMany(models.ChannelMembers, {
            foreignKey: "ChannelId"
        })
    }

    return Channels;
};