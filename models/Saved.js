module.exports = (sequelize, DataTypes) => {
    const Saved = sequelize.define("Saved");

    Saved.associate = (models) => {
        Saved.belongsTo(models.Users, {
            onDelete: "cascade",
        });
        Saved.belongsTo(models.Posts, {
            onDelete: "cascade",
        });
        Saved.belongsTo(models.Media, {
            onDelete: "cascade",
            foreignKey: "MediaId"
        });
    }

    return Saved;
};