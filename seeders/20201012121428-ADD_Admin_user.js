'use strict';
const uuid = require('uuid').v4;
const { encrypt } = require('../app/utilities/helper');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const hash = encrypt('password');

    return queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: uuid(),
          name: 'Admin',
          email: 'admin@jobless.com',
          hash_iv: hash.iv,
          password: hash.content,
          role: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.deleteOne('users', {
      where: {
        email: 'admin@jobless.com',
      },
    });
  },
};
