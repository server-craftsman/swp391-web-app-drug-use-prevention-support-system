// Use relative path for production (Vercel proxy) and full URL for development
export const DOMAIN_API = import.meta.env.DEV
    ? "http://103.90.225.74:5000/api"
    : "/api";