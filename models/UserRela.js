
module.exports = (sequelize, DataTypes) => {
    const UserRela = sequelize.define("UserRela", {
        User1: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        User2: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    UserRela.associate = (models) => {
        UserRela.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "User1"
        });

        UserRela.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "User2",
        });
    }

    return UserRela;
};