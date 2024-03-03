module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        commentBody: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        likeNumber: {
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
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    Comments.associate = (models) => {
        Comments.belongsTo(models.Users, {
            onDelete: "cascade",
        });
        Comments.belongsTo(models.Posts, {
            onDelete: "cascade",
        });
        Comments.hasMany(models.Likes, {
            onDelete: "cascade",
        });
    };
    return Comments;
};