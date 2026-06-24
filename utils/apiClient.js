import axios from "axios";
import { API_ENDPOINTS } from "../constants/apiEnd";

// baseURL ছাড়াই ক্রিয়েট করা হলো
const apiClient = axios.create({
    withCredentials: true, 
});

let isRefreshing = false;
let refreshAndRetryQueue = [];
// hasah
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ৪০১ এরর হ্যান্ডলিং (AccessToken এক্সপায়ার হলে)
        if (error?.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // এখানে আপনার API_ENDPOINTS.REFRESH_TOKEN ব্যবহার করা হয়েছে
                await axios.post(
                    API_ENDPOINTS.REFRESH_TOKEN,
                    {},
                    { withCredentials: true }
                );

                // কিউতে থাকা রিকোয়েস্টগুলো আবার পাঠান
                refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                    apiClient.request(config).then(resolve).catch(reject);
                });
                refreshAndRetryQueue = [];

                return apiClient(originalRequest);
            } catch (refreshError) {
                refreshAndRetryQueue = [];
                if (typeof window !== "undefined") {
                    // সেশন শেষ হলে লগইন পেজে পাঠান
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;