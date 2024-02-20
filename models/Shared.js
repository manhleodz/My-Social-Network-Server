module.exports = (sequelize, DataTypes) => {
    const Shared = sequelize.define("Shared");

    Shared.associate = (models) => {
        Shared.belongsTo(models.Users, {
            onDelete: "cascade",
        });
        Shared.belongsTo(models.Posts, {
            onDelete: "cascade",
        });
        Shared.belongsTo(models.Media, {
            onDelete: "cascade",
            foreignKey: "MediaId"
        });
    }

    return Shared;
};