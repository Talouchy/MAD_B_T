const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const madFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

const logger = createLogger({
    format: combine(
        format.colorize(),
        label({ label: 'right meow!' }),
        timestamp(),
        madFormat,
    ),
    transports: [new transports.Console()]
});

module.exports = logger;