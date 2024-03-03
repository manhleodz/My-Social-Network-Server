module.exports = (sequelize, DataTypes) => {
    const Shared = sequelize.define("Shared", {

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

    Shared.associate = (models) => {
        Shared.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "UserId"
        });
        Shared.belongsTo(models.Posts, {
            onDelete: "cascade",
            foreignKey: "PostId"
        });
        Shared.belongsTo(models.Media, {
            onDelete: "cascade",
            foreignKey: "MediaId"
        });
    }

    return Shared;
};