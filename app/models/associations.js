const User = require("./userModel");
const Job = require("./jobModel");
const candidateJob = require("./candidateJobModel");
const { DataTypes } = require("sequelize");

// One to many association for recruiter vs posted jobs
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


// Many to many association for candidate vs applied jobs
User.belongsToMany(Job, { through: candidateJob });
Job.belongsToMany(User, { through: candidateJob });



