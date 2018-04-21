let backendHost;
const PRODUCTION = "production";

export const IS_PRODUCTION = process.env.NODE_ENV === PRODUCTION;
if(IS_PRODUCTION) {
    backendHost = 'https://randombirdsongapi.herokuapp.com';
} else {
    backendHost = 'http://localhost:5000';
}
export const API_ROOT = `${backendHost}/api`;
