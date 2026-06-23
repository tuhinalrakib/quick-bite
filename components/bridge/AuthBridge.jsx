import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AuthBridge = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch()

    const checkAuth = async () => {
        try {
            if (!isAuthenticated) {
                dispatch(setUserInfo(null));
                dispatch(setIsAuthenticated(false));
                dispatch(setAuthLoading(false))
                return;
            }

            const res = await apiClient.get(API_ENDPOINTS.PROFILE);

            dispatch(setUserInfo(res.data));
            dispatch(setIsAuthenticated(true));
        } catch (error) {
            dispatch(setUserInfo(null));
            dispatch(setIsAuthenticated(false));
        } finally {
            setLoading(false);
        }
    };

    return children
};

export default AuthBridge;