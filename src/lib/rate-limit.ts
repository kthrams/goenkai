// Simple in-memory rate limiter for cost protection
// Resets when the dev server restarts

const HOURLY_LIMIT = parseInt(process.env.HOURLY_REQUEST_LIMIT || "50");
const DAILY_LIMIT = parseInt(process.env.DAILY_REQUEST_LIMIT || "200");

interface RequestLog {
  hourly: number[];
  daily: number[];
}

const log: RequestLog = {
  hourly: [],
  daily: [],
};

export function checkRateLimit(): {
  allowed: boolean;
  reason?: string;
  hourlyRemaining: number;
  dailyRemaining: number;
} {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  // Clean old entries
  log.hourly = log.hourly.filter((t) => t > oneHourAgo);
  log.daily = log.daily.filter((t) => t > oneDayAgo);

  const hourlyRemaining = HOURLY_LIMIT - log.hourly.length;
  const dailyRemaining = DAILY_LIMIT - log.daily.length;

  if (log.hourly.length >= HOURLY_LIMIT) {
    return {
      allowed: false,
      reason: `Hourly limit reached (${HOURLY_LIMIT}/hour). Try again later.`,
      hourlyRemaining: 0,
      dailyRemaining,
    };
  }

  if (log.daily.length >= DAILY_LIMIT) {
    return {
      allowed: false,
      reason: `Daily limit reached (${DAILY_LIMIT}/day). Try again tomorrow.`,
      hourlyRemaining,
      dailyRemaining: 0,
    };
  }

  // Record this request
  log.hourly.push(now);
  log.daily.push(now);

  return {
    allowed: true,
    hourlyRemaining: hourlyRemaining - 1,
    dailyRemaining: dailyRemaining - 1,
  };
}
