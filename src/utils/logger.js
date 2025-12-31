// src/utils/logger.js

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const isProd = process.env.NODE_ENV === 'production';

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  formatMessage(level, message, data = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    };
  }

  log(level, message, data = {}) {
    const logEntry = this.formatMessage(level, message, data);

    if (!isProd || level === LOG_LEVELS.ERROR) {
      console[level.toLowerCase()] || console.log(
        `[${logEntry.timestamp}] ${level}:`,
        message,
        data
      );
    }

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (level === LOG_LEVELS.ERROR && isProd) {
      this.sendToServer(logEntry);
    }
  }

  async sendToServer(logEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      });
    } catch (err) {
      console.error('Failed to send log to server:', err);
    }
  }

  error(message, data = {}) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data = {}) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = {}) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data = {}) {
    if (!isProd) {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

export const logPaymentEvent = (event, data) => {
  logger.info(`Payment Event: ${event}`, {
    event,
    ...data,
    timestamp: Date.now(),
  });
};

export const logFormSubmission = (formType, success, data = {}) => {
  logger.info(`Form Submission: ${formType}`, {
    formType,
    success,
    ...data,
  });
};

export const logError = (context, error, additionalData = {}) => {
  logger.error(`Error in ${context}`, {
    context,
    error: error.message,
    stack: error.stack,
    ...additionalData,
  });
};