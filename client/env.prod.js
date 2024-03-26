const env = require('dotenv').config({ path: `./.env.${process.env.ENVIRONMENT.toLowerCase()}` }).parsed;
module.exports = {
    authServerURL: env.AUTH_SERVER_URL,
    steamAPIProxyURL: env.STEAMAPI_PROXY_URL,
    CORSOriginURL: env.CORS_ORIGIN,
    quasarAppCertificatePath: env.CERT_PATH,
    quasarAppCertificateKeyPath: env.CERTKEY_PATH,
    quasarAppEnvironment: env.NODE_ENV,
}
