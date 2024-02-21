
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        smallAvatar: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        confirm: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isActive: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        background: {
            type: DataTypes.TEXT,
            defaultValue: "https://firebasestorage.googleapis.com/v0/b/my-social-network-815dc.appspot.com/o/posts%2F190057688_349127073238727_3602714994290916530_n.jpg_2024-2-16%2018%3A1%3A32_50271d1e-254e-404e-982e-aee86f243293?alt=media&token=bdca74f4-4c2a-4e83-aac7-625d64dffd27"
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        story: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        workAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        studyAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        favorites: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        birthday: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });

    Users.associate = (models) => {
        Users.hasMany(models.Likes, {
            onDelete: "cascade",
        });
        Users.hasMany(models.Comments, {
            onDelete: "cascade",
        });
        Users.hasMany(models.UserRela, {
            onDelete: "cascade",
            foreignKey: "User1",
        })
        Users.hasMany(models.UserRela, {
            onDelete: "cascade",
            foreignKey: "User2",
        })
        Users.hasMany(models.Inbox, {
            onDelete: "cascade",
        });
        Users.hasMany(models.Search, {
            onDelete: "cascade",
        });
        Users.hasMany(models.Reel, {
            onDelete: "cascade",
        });
    }
    return Users
}