# URL Shortener App

A modern, responsive URL shortener built with Node.js, Express, and MongoDB.

## Features

- 🔗 **URL Shortening** - Convert long URLs to short, shareable links
- 📊 **Analytics** - Track clicks, visits, and link performance
- 🎨 **Modern UI** - Beautiful, responsive design with glass morphism
- 📋 **Copy to Clipboard** - One-click copying of short URLs
- 🔒 **URL Validation** - Secure URL validation and error handling
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Live Demo Access
**Try the app live here:** [url_shortener_app](https://url-shortener-app-fawn.vercel.app/)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
url-shortener-backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env               # Environment variables
├── .env.example       # Environment template
└── public/
    └── index.html     # Frontend interface
```

## API Endpoints

- `POST /api/shorten` - Create a short URL
- `GET /:shortcode` - Redirect to original URL
- `GET /api/analytics/:shortcode` - Get URL analytics
- `GET /api/health` - Health check
- `GET /api/urls` - List all URLs (admin)

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Glass morphism, gradient backgrounds
- **Icons:** Font Awesome

## Environment Variables

```
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:3000
PORT=3000
```
