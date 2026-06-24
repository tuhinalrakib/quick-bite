import React from 'react';
import LoginClient from "./LoginClient"

export const metadata = {
  title: "Login",
  description: "Buy Burgers, Coffe, Pizza...etc at best price in BD.",
};

const LoginPage = () => {
    return (
        <div>
            <LoginClient></LoginClient>
        </div>
    )
};

export default LoginPage;