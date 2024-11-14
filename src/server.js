
const PORT = process.env.PORT || 3000;

const ExpressApplication = require('./app');

const app = new ExpressApplication(PORT);
const server = app.start();

process.on('SIGTERM', () => {
    // logger.warn('SIGTERM RECIEVED!');
    server.close(() => {
    //    logger.warn('Process Terminated!');
    });
 });