require('express-async-errors');
const winston = require('winston');

module.exports = function () {
  winston.handleExceptions(

    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'logfile.log' })
  );
  process.on('unhandledRejection', (error) => {
    throw error;
  });
  winston.add(winston.transports.File, { filename: 'logfile.log' });
}

