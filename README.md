# QuickBite (Frontend) - Online Food Ordering Platform

QuickBite is a premium, modern, and highly responsive online food ordering application built using the Next.js App Router, Tailwind CSS, and Redux Toolkit. It allows users to browse food menus, search for items, manage a shopping cart, place orders, track order history, and update their personal accounts.

## 🔗 Live URLs
- **Frontend App:** [https://quick-bite-delta-six.vercel.app](https://quick-bite-delta-six.vercel.app)
- **Backend API Server:** [https://quick-bite-server-xdlf.onrender.com](https://quick-bite-server-xdlf.onrender.com)

---

## ✨ Features

- **Food Browsing & Live Search:** Instantly query, filter, and view food categories and items.
- **Advanced Cart System:** Add, remove, and update food item quantities dynamically with Redux state synchronization.
- **Secure Authentication:** Built-in email/password credentials authentication alongside Google OAuth integration.
- **User Profile Dashboard:** View personal details, manage multi-field delivery addresses, change passwords, and track account details.
- **Newsletter Subscription:** Interactive footer form equipped with SweetAlert2 interactive loading states and success toasts.
- **Order Tracking:** Track past and current order statuses (Pending, Processing, Delivered, Cancelled) and payment statuses.
- **Admin Dashboard:** Specialized console for administrators to view revenue stats, manage food menus, review customer lists, and update order statuses.
- **Premium UI/UX:** Mobile-first layout featuring beautiful HSL gradients, glassmorphism, micro-animations, and clean icons.

---

## 🛠️ Frontend Tech Stack

- **Framework:** Next.js (App Router, React 19)
- **State Management:** Redux Toolkit (Cart and User slices)
- **Styling:** Tailwind CSS & Lucide Icons
- **HTTP Client:** Axios (pre-configured with JWT interceptors for automatic refresh tokens)
- **Popups & Notifications:** SweetAlert2 (`Swal`)
- **Third-Party Auth:** React Google Login

---

## 📁 Directory & File Layout

For a comprehensive file-by-file diagram, view [__file__structure__.js](./__file__structure__.js). Key elements include:
- `app/(site)/` - Public and customer pages (login, register, browse-food, cart, orders, profile).
- `app/admin/` - Admin layout and dashboard metrics.
- `components/` - Common headers/footers, dialog sheets, spinners, custom inputs, and button wrappers.
- `store/` - Redux store configuration and state slices.
- `utils/apiClient.js` - Axios instance configured with `withCredentials: true` and automated JWT refresh-on-401 logic.

---

## 🚀 Running Locally

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_URL=http://localhost:5000
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the live hot-reloaded interface.
