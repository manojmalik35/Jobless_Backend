const User = require("./userModel");
const Job = require("./jobModel");
const candidateJob = require("./candidateJobModel");
const { DataTypes } = require("sequelize");

User.hasMany(Job, {
    foreignKey: {
        name: 'postedById',
    },
    as : 'postedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Job.belongsTo(User, {
    foreignKey : 'postedById',
    as : "postedBy"
});

User.belongsToMany(Job, { through: candidateJob });
Job.belongsToMany(User, { through: candidateJob });



