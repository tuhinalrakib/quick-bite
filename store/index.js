import userReducer from "./userSlice"
import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["isAuthenticated"],
}

const rootReducer = {
    user: persistReducer(userPersistConfig, userReducer),
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
        serializableCheck: false, // 👈 disable it
    }),
})

export const persistor = persistStore(store);