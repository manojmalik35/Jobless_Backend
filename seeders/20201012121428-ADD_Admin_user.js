'use strict';
const uuid = require('uuid').v4;
const { encrypt } = require('../app/utilities/helper');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    const hash = encrypt('password');

    return queryInterface.bulkInsert(
      'Users',
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
    
    return queryInterface.deleteOne('Users', {
      where: {
        email: 'admin@jobless.com',
      },
    });
  },
};
