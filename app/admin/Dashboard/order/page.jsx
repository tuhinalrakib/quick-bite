import React from 'react';
import OrderManagementClient from './OrderManagementClient';

export const metadata = {
  title: "Order Management",
  description: "Buy Burgers, Coffe, Pizza...etc at best price in BD.",
};

const OrderManagement = () => {
    return <OrderManagementClient />
};

export default OrderManagement;