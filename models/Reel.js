module.exports = (sequelize, DataTypes) => {
    const Reel = sequelize.define("Reel", {
        introduction: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        link: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        public: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        likeNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        sharedNumber: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        seen: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    Reel.associate = (models) => {
        Reel.belongsTo(models.Users, {
            onDelete: "cascade",
        });
    };
    return Reel;
};