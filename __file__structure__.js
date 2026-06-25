/**
 * frontend/
 * ├── app/                     # Next.js App Router (Routing and Pages)
 * │   ├── (site)/              # Customer Facing Site Pages
 * │   │   ├── browse-food/     # Browse and Search Foods page
 * │   │   ├── cart/            # Customer Shopping Cart page
 * │   │   ├── login/           # Customer/Admin Login page
 * │   │   ├── orders/          # Customer My Orders tracking page
 * │   │   ├── profile/         # Customer profile detail and edit page
 * │   │   ├── register/        # Customer Registration page
 * │   │   ├── layout.tsx       # Site Header/Navbar & Footer Layout wrapper
 * │   │   └── page.tsx         # Site Home page component
 * │   ├── admin/               # Admin panel dashboard (Only for admins)
 * │   │   └── Dashboard/       # Admin main dashboard page and components
 * │   │       ├── customers/   # Customers list and management
 * │   │       ├── food/        # Food items list, add, edit, and delete management
 * │   │       ├── order/       # Orders monitoring and status management
 * │   │       ├── DashboardClient.jsx # Admin dashboard main UI client
 * │   │       ├── layout.jsx   # Admin panel side navigation & layout
 * │   │       └── page.jsx     # Admin page route wrapper
 * │   ├── globals.css          # Global Tailwind and custom styles
 * │   ├── layout.tsx           # Global Root layout containing Providers & AuthBridge
 * │   └── not-found.jsx        # 404 Page Not Found component
 * ├── components/              # Reusable React components
 * │   ├── bridge/              # Middleware bridges
 * │   │   └── AuthBridge.jsx   # Checks and fetches user profile state on start
 * │   ├── common/              # Common Layout layout components
 * │   │   ├── Navbar.tsx       # Main header navigation bar
 * │   │   ├── Footer.jsx       # Footer component with brand logo and newsletter subscription
 * │   │   └── Sidebar.tsx      # Admin panel sidebar navigation
 * │   ├── ui/                  # UI library elements (Buttons, Inputs, Modals, etc.)
 * │   │   ├── Button.tsx       # Custom Button component
 * │   │   ├── Dropdown-Menu.tsx# Custom Dropdown component
 * │   │   ├── Input.tsx        # Custom Input field component
 * │   │   ├── Sheet.tsx        # Slide-out sidebar drawer component
 * │   │   ├── Spinner.jsx      # Loading spinner component
 * │   │   └── Tooltip.tsx      # Tooltip popup component
 * │   ├── food/                # Food-specific subcomponents
 * │   ├── home/                # Home-page specific components
 * │   └── order/               # Order-specific subcomponents
 * ├── constants/               # Global Constants
 * │   └── apiEnd.js            # Frontend REST API endpoints list
 * ├── hooks/                   # Custom React hooks
 * │   └── useFetchQuery.js     # Helper hook to fetch API endpoints easily
 * ├── lib/                     # Third-party configurations and utils
 * │   └── utils.ts             # Tailwind CSS class merging helper
 * ├── store/                   # Redux global state store
 * │   ├── index.js             # Redux Store configuration
 * │   ├── cartSlice.js         # Redux slice for customer shopping cart items
 * │   └── userSlice.js         # Redux slice for logged in user info & status
 * ├── utils/                   # General helper utilities
 * │   └── apiClient.js         # Axios instance client with JWT credentials interceptor
 * ├── wrapper/                 # Context Providers wrappers
 * │   ├── Provider.jsx         # React-Query / Theme wrapper
 * │   └── ReduxProvider.jsx    # Redux Provider wrapper
 * ├── .env                     # Local environment configurations (BACKEND API, OAuth IDs)
 * ├── package.json             # Npm scripts, compiler setups and package dependencies
 * └── tsconfig.json            # TypeScript compile configs
 */