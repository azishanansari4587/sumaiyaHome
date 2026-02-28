# Sumaiya Home - E-commerce Platform 🏡✨

> **Sumaiya Home** is a premium carpet, rug, and home decor manufacturing e-commerce platform. This project provides a fully localized shopping experience with advanced filtering, cart management, wishlist interactions, and a custom Admin CMS dashboard to manage products, categories, catalogs, and users.

![Sumaiya Home](https://www.sumaiyahome.com/placeholder.jpg) <!-- Update with actual preview image later -->

## 🌟 Key Features

### 🛒 Customer Frontend (B2C & B2B)
- **Extensive Catalog:** Browse Rugs, Remnants, Decor, and Outdoor collections.
- **Smart Search & Filters:** Dynamic product filtering (by color, size, tags) to easily find items.
- **Rich Product Pages:** Interactive image zooms, dynamic variants (Colors & Sizes), related product suggestions based on behavioral tags.
- **Cart & Wishlist:** Persistent state management with **Zustand**. Add favorite items, manage cart quantities, and initiate inquiries.
- **Partner Access:** Special B2B portal for bulk buyers to open a trade account.
- **SEO Optimized:** Next.js Server Components, dynamically generated Open Graph metadata, dynamic sitemaps (`sitemap.js`), and `robots.js` indexing ensure top Google rankings.

### 🛡️ Admin Dashboard (CMS)
- **Product Management:** Full CRUD operations for products (Upload multi-angled images, manage inventory variants).
- **Inquiry Management:** Centralized dashboard to track and reply to user inquiries.
- **User Roles & Auth:** Secure JWT-based authentication with Role-Based Access Control (Admin vs Customer).
- **Catalogue & Banner CMS:** Upload PDFs and promotional homepage banners dynamically.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database:** MySQL relational backend using `mysql2`
- **State Management:** Zustand (for Cart/Wishlist)
- **Authentication:** JWT (JSON Web Tokens) with custom bcrypt hashing
- **File Storage:** Cloudinary integration for global CDN image delivery
- **Deployment Ready:** Vercel (or custom VPS node server)

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/azishanansari4587/sumaiyaHome.git
cd sumaiyaHome
```

### 2. Install Dependencies
```bash
npm install
# or yarn install / pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and configure the following variables:
```env
# Database Config
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=sumaiya_db

# JWT Config
JWT_SECRET=yoursupersecuresecret

# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SEO configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📈 SEO & Performance Highlights
- Developed using **Next.js Server Components** minimizing client-side javascript payloads.
- Integrated **dynamic `sitemap.xml`** tracking the latest database product inserts. 
- Integrated **Shadcn UI** for highly accessible and lightweight design systems.
- Employs **Cloudinary** for heavily optimized Next-Gen image formats avoiding LCP layout shifts.

## 👥 Authors
Designed & Developed by [azishanansari4587](https://github.com/azishanansari4587).
