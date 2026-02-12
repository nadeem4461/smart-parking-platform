# Smart Parking Platform

A comprehensive Smart Parking solution designed to streamline parking management, booking, and traffic flow monitoring. This specific repository contains both the backend API and the frontend user interface.

## 🚀 Features

*   **User Authentication**: Secure login and registration system.
*   **Parking Management**: View and manage parking spots.
*   **Booking System**: Reserve parking spots in advance.
*   **Traffic Monitoring**: Real-time traffic updates and analytics.
*   **Owner Dashboard**: Special routes and features for parking spot owners.
*   **Interactive Maps**: Integrated maps for locating parking spots (powered by Leaflet).
*   **Data Visualization**: Charts and analytics for usage statistics.

## 🛠️ Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL (`pg`)
*   **Authentication**: JWT & Bcrypt
*   **File Uploads**: Cloudinary & Multer
*   **Other**: Cors, Dotenv

### Frontend
*   **Framework**: React (via Vite)
*   **Styling**: Tailwind CSS
*   **Maps**: React Leaflet
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **HTTP Client**: Axios

## 📂 Project Structure

```bash
smart-parking-platform/
├── backend/            # Express.js API server
│   ├── controllers/    # Request handlers
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware
│   ├── server.js       # Entry point
│   └── ...
└── frontend/           # React application
    ├── src/            # Source code
    ├── public/         # Static assets
    └── ...
```

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+ recommended)
*   PostgreSQL installed and running

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` directory with the following variables (adjust as needed):
```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
node server.js
# Or if you have nodemon:
# npx nodemon server.js
```

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173` (or the port shown in your terminal).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
