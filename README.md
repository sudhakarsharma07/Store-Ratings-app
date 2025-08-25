# Store Ratings App - Backend

This is the **backend** for the Store Ratings App built with **Node.js, Express, and MongoDB**.

## 🚀 Features
- User authentication (signup & login with JWT)
- Store management (CRUD operations)
- Ratings system for stores
- Admin dashboard APIs
- MongoDB database connection (Mongoose)
- CORS enabled for frontend communication

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- dotenv for environment variables

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Store-Ratings-app-backend.git
cd Store-Ratings-app-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Run locally
```bash
npm start
```
or for development with hot reload:
```bash
npm run dev
```

### 5. Deployment on Render
1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com/).
3. Connect your GitHub repo.
4. Set the **Build Command**:
   ```bash
   npm install
   ```
5. Set the **Start Command**:
   ```bash
   node server.js
   ```
6. Add environment variables (same as `.env`).
7. Deploy!

Your API will be live at:
```
https://your-app-name.onrender.com
```

## 📂 Folder Structure
```
/Store-Ratings-app-backend
│── routes/         # API routes
│── models/         # Mongoose models
│── middleware/     # Authentication middlewares
│── server.js       # Main server file
│── package.json
│── .env            # Environment variables
```

## ✅ Example API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/stores`
- `POST /api/ratings/:storeId`
- `GET /api/admin/users`

---
### Author
👤 Sudhakar Sharma

