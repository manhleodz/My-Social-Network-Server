
module.exports = (sequelize, DataTypes) => {
    const Search = sequelize.define("Search", {

        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        times: {
            type: DataTypes.INTEGER,
            defaultValue: 1
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

    Search.associate = (models) => {
        Search.belongsTo(models.Users, {
            onDelete: "cascade",
        });
    };

    return Search;
};