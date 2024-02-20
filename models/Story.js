module.exports = (sequelize, DataTypes) => {
    const Story = sequelize.define("Story", {
        backgroundColor: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        link: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        expires: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        public: {
            type: DataTypes.BOOLEAN,
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
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    });

    Story.associate = (models) => {
        Story.belongsTo(models.Users, {
            onDelete: "cascade",
        });
    };
    return Story;
};