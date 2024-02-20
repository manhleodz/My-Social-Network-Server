
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
    });

    Search.associate = (models) => {
        Search.belongsTo(models.Users, {
            onDelete: "cascade",
        });
    };

    return Search;
};