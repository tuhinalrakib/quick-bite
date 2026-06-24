import userReducer from "./userSlice"
import cartReducer from "./cartSlice"
import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["isAuthenticated"],
}

const cartPersistConfig = {
    key: "cart",
    storage,
    whitelist: ["items"],
}

const rootReducer = {
    user: persistReducer(userPersistConfig, userReducer),
    cart: persistReducer(cartPersistConfig, cartReducer),
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
        serializableCheck: false, // 👈 disable it
    }),
})

export const persistor = persistStore(store);