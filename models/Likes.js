module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define("Likes", {
    });

    Likes.associate = (models) => {
        Likes.belongsTo(models.Users, {
            onDelete: "cascade",
        });

        Likes.belongsTo(models.Posts, {
            onDelete: "cascade",
            foreignKey: "PostId"
        });

        Likes.belongsTo(models.Media, {
            onDelete: "cascade",
            foreignKey: "MediaId"
        });

        Likes.belongsTo(models.Comments, {
            onDelete: "cascade",
            foreignKey: "CommentId"
        });

        Likes.belongsTo(models.Reel, {
            onDelete: "cascade",
            foreignKey: "ReelId"
        });

        Likes.belongsTo(models.Story, {
            onDelete: "cascade",
            foreignKey: "StoryId"
        });
    }

    return Likes;
};