import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    userInfo: null,
    isLoading: false, // 👈 added
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setAuthLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.userInfo = null;
        },
    },
});

export const {
    setUserInfo,
    setIsAuthenticated,
    logoutUser,
    setAuthLoading,
} = userSlice.actions;

export default userSlice.reducer;