'use client'

import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

const Provider = ({ children }) => {
    const handleScriptLoad = () => {
        console.log("✅ Google SDK loaded successfully");
    };

    const handleScriptError = () => {
        console.error("❌ Google SDK failed to load - Check browser console and CORS");
    };

    return (
        <HelmetProvider>
            <GoogleOAuthProvider
                clientId='800110998179-5tubk1vmkgjh8m9gh7j907ino4tkjhmh.apps.googleusercontent.com'
                onScriptLoad={handleScriptLoad}
                onScriptLoadError={handleScriptError}
                script_props={{
                    async: true,
                    defer: true,
                    crossOrigin: "anonymous"
                }}
            >
                {children}
            </GoogleOAuthProvider>
        </HelmetProvider>
    );
};

export default Provider;