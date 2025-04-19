import { Logger, LogLevel, LogMessage } from './types/logger';

/**
 * A console-based logger implementation that provides leveled logging with formatting.
 * 
 * @implements {Logger} - Implements the Logger interface
 * 
 * @example
 * logger.info('Server started', 'Application');
 * logger.error(new Error('Connection failed'), 'Database');
 * 
 * @description
 * This logger provides:
 * - Multiple log levels (ERROR, WARN, INFO, DEBUG, VERBOSE)
 * - Contextual logging with optional context tags
 * - Automatic formatting of messages (including Errors and objects)
 * - Environment-based log level configuration
 * - Singleton pattern for easy access throughout the application
 */
class ConsoleLogger implements Logger {
    private logLevel: LogLevel;

    /**
     * Creates a new ConsoleLogger instance
     * @param {LogLevel} initialLevel - The initial log level (default: INFO)
     */
    constructor(initialLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = initialLevel;
    }

    /**
     * Determines if a message of the given level should be logged
     * @private
     * @param {LogLevel} level - The log level to check
     * @returns {boolean} - True if the level should be logged
     */
    private shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel);
        return levels.indexOf(level) <= levels.indexOf(this.logLevel);
    }

    /**
     * Formats a log message with timestamp and optional context
     * @private
     * @param {LogMessage} message - The message to format
     * @param {string} [context] - Optional context information
     * @returns {string} - The formatted message string
     */
    private formatMessage(message: LogMessage, context?: string): string {
        const timestamp = new Date().toISOString();
        const contextPart = context ? ` [${context}]` : '';

        if (message instanceof Error) {
            return `${timestamp}${contextPart} ${message.stack || message.message}`;
        }

        if (typeof message === 'object') {
            return `${timestamp}${contextPart} ${JSON.stringify(message, null, 2)}`;
        }

        return `${timestamp}${contextPart} ${message}`;
    }

    /**
     * Logs an error message
     * @param {LogMessage} message - The error message or Error object
     * @param {string} [context] - Optional context information
     */
    error(message: LogMessage, context?: string): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(message, context));
        }
    }

    /**
     * Logs a warning message
     * @param {LogMessage} message - The warning message
     * @param {string} [context] - Optional context information
     */
    warn(message: LogMessage, context?: string): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(message, context));
        }
    }

    /**
     * Logs an informational message
     * @param {LogMessage} message - The info message
     * @param {string} [context] - Optional context information
     */
    info(message: LogMessage, context?: string): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage(message, context));
        }
    }

    /**
     * Logs a debug message
     * @param {LogMessage} message - The debug message
     * @param {string} [context] - Optional context information
     */
    debug(message: LogMessage, context?: string): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(message, context));
        }
    }

    /**
     * Logs a verbose message (most detailed level)
     * @param {LogMessage} message - The verbose message
     * @param {string} [context] - Optional context information
     */
    verbose(message: LogMessage, context?: string): void {
        if (this.shouldLog(LogLevel.VERBOSE)) {
            console.log(this.formatMessage(message, context));
        }
    }

    /**
     * Changes the current log level
     * @param {LogLevel} level - The new log level
     */
    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }
}

/**
 * Singleton logger instance configured from environment variable.
 * Defaults to INFO level if not specified in environment.
 */
const logger = new ConsoleLogger(
    (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO
);

export default logger;