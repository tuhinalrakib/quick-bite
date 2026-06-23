const BACKEND_API = process.env.NEXT_PUBLIC_URL

export const API_ENDPOINTS = {
    SIGN_UP : `${BACKEND_API}/auth/sign-up`,
    SIGN_IN : `${BACKEND_API}/auth/sign-in`,
}