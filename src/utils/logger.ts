import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.simple(),
  ),
  defaultMeta: { service: "Servidor OZMAP" },
  transports: [new transports.Console()],
});

export default logger;
