export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CERT_PATH: process.env.CERT_PATH,
  CERTKEY_PATH: process.env.CERTKEY_PATH,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
});
