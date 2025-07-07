const requestTracker = new Map();
const RATE_LIMIT = 5;
const TIME_WINDOW = 15 * 60 * 1000;

export function rateLimitMiddleware(request: Request): { allowed: boolean; message?: string } {
    const ip = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const now = Date.now();
    const userRequests = requestTracker.get(ip) || [];

    const recentRequests = userRequests.filter((time: number) => now - time < TIME_WINDOW);

    if (recentRequests.length >= RATE_LIMIT) {
        return {
            allowed: false,
            message: 'RATE_LIMIT_EXCEEDED: Demasiadas peticiones. Por favor espera antes de intentar de nuevo.'
        };
    }

    recentRequests.push(now);
    requestTracker.set(ip, recentRequests);

    if (Math.random() < 0.1) {
        for (const [key, requests] of requestTracker.entries()) {
            const validRequests = requests.filter((time: number) => now - time < TIME_WINDOW);
            if (validRequests.length === 0) {
                requestTracker.delete(key);
            } else {
                requestTracker.set(key, validRequests);
            }
        }
    }

    return { allowed: true };
}
