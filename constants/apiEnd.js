const BACKEND_API = process.env.NEXT_PUBLIC_URL

export const API_ENDPOINTS = {
    // Authentications
    SIGN_UP : `${BACKEND_API}/auth/sign-up`,
    SIGN_IN : `${BACKEND_API}/auth/sign-in`,
    PROFILE : `${BACKEND_API}/auth/profile`,
    REFRESH_TOKEN : `${BACKEND_API}/auth/refresh`,
    LOGOUT : `${BACKEND_API}/auth/logout`,
}