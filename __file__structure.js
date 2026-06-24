/**
 * my-nextjs-app/
├── public/                     # স্ট্যাটিক ফাইলস (ইমেজ, ফন্টস, লোগো সরাসরি এখানে থাকবে)
│   ├── images/                 # যেমন: pizza.png, burger.jpg
│   └── icons/
├── src/
│   ├── app/                    # Next.js App Router (সব রাউট ও পেজ এখানে থাকবে)
│   │   ├── (auth)/             # Route Group: লগইন/রেজিস্ট্রেশন (ইউআরএলে এটার নাম দেখাবে না)
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login Page
│   │   │   └── register/
│   │   │       └── page.tsx    # Register Page
│   │   ├── (customer)/         # Route Group: কাস্টমার সাইড
│   │   │   ├── layout.tsx      # MainLayout (Navbar, Footer সহ কাস্টমার লেআউট)
│   │   │   ├── page.tsx        # Home Page (কাস্টমার ল্যান্ডিং পেজ)
│   │   │   ├── cart/
│   │   │   │   └── page.tsx    # Cart Page
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx    # Checkout Page
│   │   │   └── orders/
│   │   │       └── page.tsx    # Order Confirmation / History
│   │   ├── admin/              # Admin Dashboard (ইউআরএল হবে: /admin)
│   │   │   ├── layout.tsx      # AdminLayout (Sidebar ও Topbar সহ অ্যাডমিন লেআউট)
│   │   │   ├── page.tsx        # Admin Dashboard Home
│   │   │   ├── food/
│   │   │   │   └── page.tsx    # Manage Food Page
│   │   │   └── orders/
│   │   │       └── page.tsx    # Manage Orders Page
│   │   ├── globals.css         # গ্লোবাল স্টাইল (পুরানো index.css)
│   │   ├── layout.tsx          # Root Layout (সবার জন্য গ্লোবাল HTML কাঠামো এবং প্রোভাইডার)
│   │   └── not-found.tsx       # 404 Page (পুরানো NotFound.jsx)
│   │
│   ├── components/             # রিইউজেবল কম্পোনেন্ট (ছোট ছোট অংশ)
│   │   ├── common/             # Button, LoadingSpinner, Input Fields ইত্যাদি
│   │   ├── food/               # FoodCard, FoodGrid
│   │   └── order/              # OrderItem, OrderSummary
│   │
│   ├── context/                # গ্লোবাল স্টেট ম্যানেজমেন্ট 
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   │
│   ├── services/               # API কল করার ফাংশন (Axios বা Fetch)
│   │   ├── api.ts              # বেস Axios ইনস্ট্যান্স বা Fetch র্যাপার
│   │   ├── authService.ts
│   │   └── foodService.ts
│   │
│   ├── types/                  # TypeScript Interface এবং Types
│   │   ├── index.ts            # কমন টাইপস
│   │   ├── food.ts             # যেমন: FoodItem এর ইন্টারফেস
│   │   └── order.ts            # যেমন: Order এর ইন্টারফেস
│   │
│   └── middleware.ts           # রাউট প্রোটেকশন (পুরানো ProtectedRoute এর কাজ করবে)
│
├── next.config.ts              # Next.js কনফিগারেশন ফাইল
├── package.json
├── tsconfig.json               # TypeScript কনফিগারেশন ফাইল
└── tailwind.config.ts          # Tailwind CSS কনফিগারেশন ফাইল
 */

/**
 * NEXT_PUBLIC_URL=http://localhost:5000

# Google OAUTH
GOOGLE_CLIENT_ID=800110998179-5tubk1vmkgjh8m9gh7j907ino4tkjhmh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
 */