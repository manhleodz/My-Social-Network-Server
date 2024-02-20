
module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        postText: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        likeNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        commentNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sharedNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.Likes, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.Media, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.Saved, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.Shared, {
            onDelete: "cascade",
        })

        Posts.belongsTo(models.Users, {
            onDelete: "cascade",
        })
    };

    return Posts;
};