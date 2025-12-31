// src/utils/rateLimiter.js

class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }

  canAttempt(key, maxAttempts = 3, windowMs = 60000) {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (now - record.firstAttempt > windowMs) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (record.count >= maxAttempts) {
      const timeLeft = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter: timeLeft,
      };
    }

    record.count++;
    this.attempts.set(key, record);
    return { allowed: true, remaining: maxAttempts - record.count };
  }

  reset(key) {
    this.attempts.delete(key);
  }

  clear() {
    this.attempts.clear();
  }
}

export const formRateLimiter = new RateLimiter();
export const paymentRateLimiter = new RateLimiter();

export const checkRateLimit = (limiter, identifier, maxAttempts = 3) => {
  const result = limiter.canAttempt(identifier, maxAttempts);
  
  if (!result.allowed) {
    throw new Error(
      `Too many attempts. Please wait ${result.retryAfter} seconds before trying again.`
    );
  }
  
  return result;
};