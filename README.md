# 🛍️ LuxeCart - Premium E-Commerce Platform

A modern, fully-featured e-commerce website built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Designed with a focus on user experience, beautiful aesthetics, and smooth animations.

![LuxeCart](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Full-Stack Setup (Node.js API + MySQL)

LuxeCart is now a **dynamic full-stack app**: a Next.js frontend backed by a standalone **Node.js + Express + Prisma + MySQL** API in [`backend/`](backend/). Products, categories, cart, wishlist, orders, reviews, auth, and an admin API are all served from the database.

### 1. Start the backend API

```bash
cd backend
cp .env.example .env          # set DATABASE_URL (MySQL), JWT secrets
npm install
npm run extract               # data/products.ts -> prisma/data/*.json
npm run prisma:migrate        # create DB + tables (auto-runs the seed)
npm run dev                   # API on http://localhost:4000/api
```

Seeds **48 products / 7 categories** plus an admin user: `admin@luxecart.com` / `admin123`.

### 2. Start the frontend

```bash
# in the project root
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                        # http://localhost:3000
```

> Or run MySQL + API together with Docker: `docker compose up` (then start the frontend with `npm run dev`).

### Architecture

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind, SWR, Zustand |
| API | Node.js, Express, Zod, JWT auth (access + refresh) |
| ORM / DB | Prisma + MySQL |
| Payments | Stripe (auto "mock mode" when no keys are configured) |

**Auth:** JWT access token (in `localStorage`) + httpOnly refresh cookie with rotation. A guest cart/wishlist (localStorage) merges into the server account on login.

**Deployment:** API → any Node host + managed MySQL (Railway/Render/Fly/PlanetScale) using the included [`backend/Dockerfile`](backend/Dockerfile). Frontend → Vercel or Firebase App Hosting (note: it is no longer a static export, so plain static Firebase Hosting won't serve the SSR routes).

See [`backend/README.md`](backend/README.md) for the full endpoint list.

## ✨ Features

### 📱 **NEW: Mobile-First Excellence** 
- **Quick Filters Bar** - One-tap product filtering (Sale, Trending, New, Popular)
- **Floating Bottom Navigation** - Instagram/TikTok-inspired mobile nav with badges
- **Full-Screen Mobile Search** - Swipeable search modal with suggestions
- **Sticky Mobile Product Bar** - Auto-showing add-to-cart bar with share & wishlist
- **Product Comparison Sheet** - Side-by-side product comparison (up to 4 products)
- **Loading Skeletons** - Beautiful shimmer animations during loading
- **Touch-Optimized** - 44px+ buttons, smooth gestures, safe area support
- **Native Features** - Web Share API, local storage, iOS notch compatibility

> 📖 **See Full Details**: [Mobile Enhancements Guide](MOBILE_ENHANCEMENTS.md) | [Visual Guide](VISUAL_GUIDE.md) | [Summary](ENHANCEMENT_SUMMARY.md)

### 🎨 **Modern Design**
- Beautiful gradient effects and glassmorphism
- Smooth micro-animations and transitions  
- Dark mode support
- Fully responsive design for all devices
- Premium UI/UX with attention to detail

### 🛒 **E-Commerce Functionality**
- **Product Catalog** - Browse products with advanced filtering and sorting
- **Product Details** - Detailed product pages with image galleries and reviews
- **Shopping Cart** - Real-time cart management with quantity controls
- **Wishlist** - Save favorite products for later
- **Checkout** - Seamless checkout process with payment integration
- **Order Tracking** - View order history and status
- **User Account** - Manage profile, orders, and preferences

### 🔍 **Product Features**
- Category-based browsing
- Advanced product filtering (category, price range, stock status)
- Product sorting (price, name, rating, featured)
- Search functionality
- Discount badges and price calculations
- Stock status indicators
- Product ratings and reviews
- Related products suggestions

### 💳 **Shopping Experience**
- Persistent cart and wishlist (using localStorage)
- Real-time price calculations
- Free shipping threshold
- Tax calculations
- Multiple payment method display
- Order confirmation and success page
- Toast notifications for user feedback

### 🎯 **User Interface**
- Sticky navigation with scroll effects
- Mobile-friendly responsive menu
- Product quick view actions
- Smooth page transitions
- Loading states and animations
- Empty state designs
- Interactive hover effects

## 📁 Project Structure

```
E_commerce/
├── app/                          # Next.js App Router
│   ├── about/                   # About page
│   ├── account/                 # User account dashboard
│   ├── cart/                    # Shopping cart
│   ├── categories/              # Categories listing
│   ├── checkout/                # Checkout process
│   ├── order-success/           # Order confirmation
│   ├── products/                # Products listing and details
│   │   └── [id]/               # Dynamic product pages
│   ├── wishlist/               # User wishlist
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Navigation component
│   │   └── Footer.tsx          # Footer component
│   └── product/
│       └── ProductCard.tsx     # Reusable product card
├── data/
│   └── products.ts             # Mock product data
├── store/
│   └── useStore.ts             # Zustand state management
├── public/                      # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E_commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Technologies Used

### Core
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- Custom CSS variables and animations

### State Management
- **Zustand** - Lightweight state management
- Persistent storage with localStorage

### UI Components & Icons
- **Lucide React** - Beautiful, consistent icons
- **React Hot Toast** - Toast notifications

### Image Optimization
- **Next.js Image** - Automatic image optimization
- Unsplash for demo images

## 📦 Key Dependencies

```json
{
  "next": "^15.1.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.7.3",
  "tailwindcss": "^3.4.17",
  "framer-motion": "^11.15.0",
  "zustand": "^5.0.3",
  "lucide-react": "^0.468.0",
  "react-hot-toast": "^2.4.1"
}
```

## 🎨 Design Features

### Color Palette
- **Primary**: Purple gradient (#d946ef → #c026d3)
- **Secondary**: Teal gradient (#14b8a6 → #0d9488)
- **Accents**: Custom gradients and vibrant colors
- **Dark Mode**: Optimized dark color scheme

### Animations
- Page transitions with Framer Motion
- Hover effects on interactive elements
- Floating animations for hero elements
- Smooth loading states
- Scale and fade animations

### Typography
- **Font**: Inter (Google Fonts)
- Responsive font sizes
- Proper heading hierarchy

## 🔐 Features to Implement (Future)

While this is a demo/MVP, here are suggested features for production:

- [ ] Real backend API integration
- [ ] User authentication (Auth0, NextAuth)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Product reviews and ratings system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Product comparison
- [ ] Size/color variants
- [ ] Inventory management
- [ ] Analytics and tracking
- [ ] Multi-language support
- [ ] Social login
- [ ] Customer support chat

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
```

### Tailwind Configuration
Custom theme colors, animations, and utilities are defined in `tailwind.config.ts`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ by the LuminousLabs team

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Inspiration from modern e-commerce platforms

---

**Happy Shopping! 🛍️**

For questions or support, please open an issue or contact us at support@luxecart.com
