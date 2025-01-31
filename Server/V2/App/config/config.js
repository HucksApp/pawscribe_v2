import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file
dotenv.config();

class Config {
    static DB_URL = process.env.DB_URL
    static DB_NAME = process.env.DB_NAME
    static MONGO_URI = `${Config.DB_URL}/${Config.DB_NAME}`;
    static DB_TYPE = process.env.DB_TYPE

    static MAX_CONTAINERS_PER_USER = 3
   
    static LOG_FILE_PATH = path.resolve('logs', 'application.log'); // Set log file path
    static SECRET_KEY = process.env.SECRET_KEY;
    static PORT = 8000
    // JWT configuration
    static JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    static JWT_TOKEN_LOCATION = ['headers'];
    static JWT_COOKIE_CSRF_PROTECT = true;

    // JWT expiration settings
    static JWT_ACCESS_TOKEN_EXPIRES = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    static JWT_REFRESH_TOKEN_EXPIRES = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    // Secure cookies for HTTPS
    static JWT_COOKIE_SECURE = false;

    // Maximum request size: 1 MB
    static MAX_CONTENT_LENGTH = 1024 * 1024;

    static printDB_Url() {
        console.log(`Database URL: ${Config.MONGO_URI}`);
    }
}

Config.printDB_Url();

export default Config;
