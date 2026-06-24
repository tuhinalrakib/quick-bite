import React from "react";
import CartClient from "./CartClient";

export const metadata = {
  title: "Your Cart | Quick Bite",
  description: "View and manage items in your Quick Bite shopping cart before checking out.",
};

const CartPage = () => {
  return <CartClient />;
};

export default CartPage;
