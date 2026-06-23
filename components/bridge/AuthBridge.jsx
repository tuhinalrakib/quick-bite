"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthLoading, setIsAuthenticated, setUserInfo } from "../../store/userSlice";
import apiClient from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../constants/apiEnd';

const AuthBridge = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch()

    const checkAuth = async () => {
        try {
            if (!isAuthenticated) {
                dispatch(setUserInfo(null));
                dispatch(setAuthLoading(false))
                return;
            }
            dispatch(setAuthLoading(true))

            const res = await apiClient.get(API_ENDPOINTS.PROFILE);

            dispatch(setUserInfo(res.data.user));
            dispatch(setIsAuthenticated(true));
        } catch (error) {
            dispatch(setUserInfo(null));
            dispatch(setIsAuthenticated(false));
        } finally {
            dispatch(setAuthLoading(false));
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return children
};

export default AuthBridge;