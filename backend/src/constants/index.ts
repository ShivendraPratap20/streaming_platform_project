const BASE_URL = process.env.NODE_ENVIRONMENT == "DEVELOPMENT"? 
'http://localhost:8000' 
: '';

const FRONTEND_URL = process.env.NODE_ENVIRONMENT == "DEVELOPMENT" ?
'http://localhost:5173' 
: '';

const uploadDir:string = '/home/cvendra/Videos';
const hlsDir:string = '/home/cvendra/hls-output';

const ACCESS_TOKEN_EXPIRY: Date = new Date(Date.now() + 30 * 60 * 1000);
const REFRESH_TOKEN_EXPIRY: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const SECURE: boolean = process.env.NODE_ENVIRONMENT == 'PRODUCTION' ? true : false;
const SAME_SITE: 'none' | 'lax' = process.env.NODE_ENVIRONMENT == 'PRODUCTION' ? "none" : "lax";




const GOOGLE_REDIRECT_URL = `${BASE_URL}/api/v1/user/auth/google/callback`;
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';


export {
    FRONTEND_URL,
    BASE_URL,
    uploadDir,
    hlsDir,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    SECURE,
    SAME_SITE,
    GOOGLE_REDIRECT_URL,
    GOOGLE_AUTH_URL,
    GOOGLE_TOKEN_URL
};