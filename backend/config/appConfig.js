require("dotenv").config();

const config = {
    port: process.env.PORT || 5000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    authEmail: process.env.AUTH_EMAIL,
    authPass: process.env.AUTH_PASS,
    baseUploadDir: process.env.BASE_UPLOAD_DIR,
};

if (
    !config.mongodbUri ||
    !config.jwtSecret ||
    !config.authEmail ||
    !config.authPass ||
    !config.baseUploadDir
) {
    throw new Error(
        "One or more required environment variables are missing. Check your .env file."
    );
}

module.exports = config;
