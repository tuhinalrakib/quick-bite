import React from "react";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "My Orders | Quick Bite",
  description: "View and track your Quick Bite food orders.",
};

const OrdersPage = () => {
  return <OrdersClient />;
};

export default OrdersPage;
