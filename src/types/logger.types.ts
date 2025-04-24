export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    VERBOSE = 'verbose',
}

export type LogMessage = string | Error | Record<string, unknown>;

export interface Logger {
    error(message: LogMessage, context?: string): void;
    warn(message: LogMessage, context?: string): void;
    info(message: LogMessage, context?: string): void;
    debug(message: LogMessage, context?: string): void;
    verbose(message: LogMessage, context?: string): void;
    setLogLevel(level: LogLevel): void;
}