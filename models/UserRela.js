
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
    });

    UserRela.associate = (models) => {
        UserRela.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "User1",
            as: "Sender"
        });

        UserRela.belongsTo(models.Users, {
            onDelete: "cascade",
            foreignKey: "User2",
            as: "Reciever"
        });
    }

    return UserRela;
};