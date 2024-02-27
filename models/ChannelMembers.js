module.exports = (sequelize, DataTypes) => {
    const ChannelMembers = sequelize.define("ChannelMembers", {
        channelId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    ChannelMembers.associate = (models) => {
        ChannelMembers.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "userId"
        });

        ChannelMembers.belongsTo(models.Channels, {
            onDelete: "cascade",
            foreignKey: "channelId"
        });
    };

    return ChannelMembers;
};