const config = require('config');
const cluster = require('cluster');
const winston = require('winston');
const logger = winston.loggers.add('main', {
	level: config.get('logger.level'),
	format: winston.format.json(),
	transports: [
		new winston.transports.File(
			{filename: `${config.get('logger.dir')}error.log`, level: 'error'}
		),
		new winston.transports.File(
			{filename: `${config.get('logger.dir')}combined.log`}
		),
	],
});


if (cluster.isMaster) {
	const numCPUs = config.get('max_workers') > 0 ?
		config.get('max_workers') : require('os').cpus().length;
	logger.info(`Master ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		logger.info(`worker ${worker.process.pid} died`);
	});
} else {
	const app = require('./app');
	const port = config.get('app.port');
	app.listen(port, () =>
		logger.info(`Worker ${process.pid} started to listening on ${port}`));
}
