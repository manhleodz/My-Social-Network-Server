module.exports = (sequelize, DataTypes) => {
    const Saved = sequelize.define("Saved", {

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

    Saved.associate = (models) => {
        Saved.belongsTo(models.Users, {
            onDelete: "cascade",
        });
        Saved.belongsTo(models.Posts, {
            onDelete: "cascade",
            foreignKey: "PostId",
        });
        Saved.belongsTo(models.Reel, {
            onDelete: "cascade",
            foreignKey: "ReelId",
        });
        Saved.belongsTo(models.Media, {
            onDelete: "cascade",
            foreignKey: "MediaId",
        });
    }

    return Saved;
};