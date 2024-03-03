module.exports = (sequelize, DataTypes) => {
    const Media = sequelize.define("Media", {
        link: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        backgroundColor: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },
        likeNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sharedNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
    });

    Media.associate = (models) => {
        Media.belongsTo(models.Posts, {
            onDelete: "cascade",
            foreignKey: "PostId"
        });
        Media.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "UserId"
        });
    }
    return Media;
};