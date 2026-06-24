"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard, 
  MapPin, 
  Phone, 
  User as UserIcon,
  CheckCircle,
  X,
  ArrowRight
} from "lucide-react";
import Swal from "sweetalert2";
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const CartClient = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { userInfo } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart?.items || []);
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingName, setShippingName] = useState(userInfo?.name || "");
  const [shippingPhone, setShippingPhone] = useState(userInfo?.phone || "");
  const [shippingAddress, setShippingAddress] = useState(
    userInfo?.address?.street 
      ? `${userInfo.address.street}${userInfo.address.city ? `, ${userInfo.address.city}` : ""}` 
      : ""
  );
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod or card
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 15 || subtotal === 0 ? 0 : 2.0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const handleQuantityChange = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemoveItem = (id) => {
    const item = cartItems.find(i => (i._id || i.id) === id);
    Swal.fire({
      title: "Remove item?",
      text: `Are you sure you want to remove ${item?.name || "this item"} from the cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E15B1E",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(id));
        Swal.fire({
          title: "Removed!",
          text: "Item has been removed from your cart.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear entire cart?",
      text: "This will remove all items from your cart. You cannot undo this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCart());
        Swal.fire({
          title: "Cleared!",
          text: "Your cart is now empty.",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (!shippingName.trim() || !shippingPhone.trim() || !shippingAddress.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all the required delivery information.",
      });
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCVC) {
        Swal.fire({
          icon: "error",
          title: "Card Info Required",
          text: "Please enter your credit/debit card details.",
        });
        return;
      }
    }

    // Mock processing order
    Swal.fire({
      title: "Processing your order...",
      html: "Please wait a moment while we dispatch your order to the kitchen.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      timer: 2000,
    }).then(() => {
      setIsCheckoutOpen(false);
      dispatch(clearCart());
      
      Swal.fire({
        icon: "success",
        title: "Order Placed Successfully! 🎉",
        html: `
          <div class="text-left mt-3 p-4 bg-gray-50 rounded-xl space-y-1 text-sm border">
            <p><strong>Deliver to:</strong> ${shippingName}</p>
            <p><strong>Phone:</strong> ${shippingPhone}</p>
            <p><strong>Address:</strong> ${shippingAddress}</p>
            <p><strong>Payment Mode:</strong> ${paymentMethod === "cod" ? "Cash on Delivery" : "Mock Online Card"}</p>
            <p class="mt-2 text-[#E15B1E] font-bold">Estimated Delivery: 30-45 mins</p>
          </div>
        `,
        confirmButtonColor: "#E15B1E",
        confirmButtonText: "Back to Home",
      }).then(() => {
        router.push("/");
      });
    });
  };

  // If user is not logged in, prompt redirect to login page
  if (!userInfo) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 text-center">
        <div className="p-4 bg-orange-50 text-[#E15B1E] rounded-full mb-4 animate-bounce">
          <ShoppingBag className="h-10 w-10 stroke-1.5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          Please login to view your cart items and complete your order.
        </p>
        <Button 
          onClick={() => router.push("/login")}
          className="mt-6 bg-[#E15B1E] hover:bg-[#c84e17] text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/browse-food" 
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#E15B1E] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Continue Browsing
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="text-[#E15B1E] h-7 w-7" />
            Your Cart 
            {cartItems.length > 0 && (
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            )}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm max-w-xl mx-auto flex flex-col items-center">
            <div className="p-6 bg-orange-50 text-[#E15B1E] rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 stroke-1.25" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Cart is empty</h2>
            <p className="text-gray-500 text-sm max-w-md mb-8">
              Looks like you haven't added anything to your cart yet. Take a look at our amazing menu selections and order something delicious!
            </p>
            <Button
              onClick={() => router.push("/browse-food")}
              className="bg-[#E15B1E] hover:bg-[#c84e17] text-white px-8 py-3 rounded-2xl font-bold shadow-md transition-all flex items-center gap-2"
            >
              Browse Food Menu
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          /* Cart List & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <span className="font-bold text-gray-800 text-sm">Dishes List</span>
                  <button 
                    onClick={handleClearCart}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Product Thumbnail & Meta */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image || "/logo.png"} 
                          alt={item.name} 
                          className="h-16 w-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                          <p className="text-xs text-[#E15B1E] font-medium">🏪 {item.restaurantName || "Restaurant Origin"}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[250px]">{item.description}</p>
                        </div>
                      </div>

                      {/* Controls & Prices */}
                      <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-xl px-1 py-0.5 bg-gray-50">
                          <button 
                            onClick={() => handleQuantityChange(item._id || item.id, item.quantity - 1)}
                            className="p-1.5 hover:text-[#E15B1E] text-gray-500 rounded-lg hover:bg-white transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 font-bold text-gray-800 text-sm min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleQuantityChange(item._id || item.id, item.quantity + 1)}
                            className="p-1.5 hover:text-[#E15B1E] text-gray-500 rounded-lg hover:bg-white transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[80px]">
                          <p className="text-gray-900 font-extrabold text-base">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400 font-medium">
                              ${item.price.toFixed(2)} each
                            </p>
                          )}
                        </div>

                        {/* Trash */}
                        <button 
                          onClick={() => handleRemoveItem(item._id || item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                  Summary
                </h3>
                
                <div className="space-y-3.5 text-sm font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span className="text-gray-900 font-semibold">${deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Tax (5%)</span>
                    <span className="text-gray-900 font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  
                  {deliveryFee > 0 && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-[#E15B1E] font-semibold">
                      Add ${(15.0 - subtotal).toFixed(2)} more to qualify for FREE delivery!
                    </div>
                  )}

                  <hr className="border-gray-100 my-4" />
                  
                  <div className="flex justify-between text-base font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#E15B1E]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full mt-6 bg-[#E15B1E] hover:bg-[#c84e17] text-white py-3.5 rounded-2xl font-bold shadow-md shadow-orange-100 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </div>

              {/* Guarantees */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-xs font-semibold text-gray-500 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span>Fresh, hot meals prepared directly upon order</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span>Secure & flexible payments supported</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Modern Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-slideUp">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Delivery details</h3>
                <p className="text-xs text-gray-400 font-medium">Complete your order details below</p>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              
              {/* Recipient Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="text" 
                  value={shippingName} 
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="rounded-xl border-gray-200 focus-visible:ring-[#E15B1E] py-5 text-sm"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="tel" 
                  value={shippingPhone} 
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="e.g. +880 17XXXXXXXX"
                  required
                  className="rounded-xl border-gray-200 focus-visible:ring-[#E15B1E] py-5 text-sm"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={shippingAddress} 
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="e.g. Flat 3A, House 12, Road 4, Dhanmondi, Dhaka"
                  required
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E15B1E] focus-visible:border-transparent transition-all"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* COD */}
                  <div 
                    onClick={() => setPaymentMethod("cod")}
                    className={`border rounded-xl p-3 flex flex-col gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === "cod" 
                        ? "border-[#E15B1E] bg-orange-50/30 text-[#E15B1E]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      💵 Cash on Delivery
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">Pay when food arrives</span>
                  </div>

                  {/* CARD */}
                  <div 
                    onClick={() => setPaymentMethod("card")}
                    className={`border rounded-xl p-3 flex flex-col gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === "card" 
                        ? "border-[#E15B1E] bg-orange-50/30 text-[#E15B1E]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <span className="font-extrabold text-sm flex items-center gap-1.5">
                      💳 Credit/Debit Card
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">Pay online securely</span>
                  </div>
                </div>
              </div>

              {/* Card input fields if online card chosen */}
              {paymentMethod === "card" && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Card Number</label>
                    <Input 
                      type="text"
                      placeholder="1234 5678 9101 1121"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="bg-white rounded-lg h-9 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Expiry Date</label>
                      <Input 
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-white rounded-lg h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">CVC / CVV</label>
                      <Input 
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value)}
                        className="bg-white rounded-lg h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Total Display & Actions */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400">Amount to Pay</p>
                  <p className="text-lg font-extrabold text-[#E15B1E]">${total.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsCheckoutOpen(false)}
                    className="rounded-xl text-gray-500 text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#E15B1E] hover:bg-[#c84e17] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md"
                  >
                    Place Order (${total.toFixed(2)})
                  </Button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CartClient;
