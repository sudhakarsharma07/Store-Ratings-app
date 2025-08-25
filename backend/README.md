# Backend - Store Ratings

Install:
  cd backend
  npm install

Create .env (use .env.example)

Run:
  npm run dev   # requires nodemon
  or
  npm start

Endpoints (summary):
  POST /api/auth/signup  {name,email,address,password}
  POST /api/auth/login   {email,password}
  POST /api/auth/change-password (auth)
  POST /api/stores (admin) {name,email,address,ownerId}
  GET  /api/stores (auth) ?q=search
  POST /api/ratings/:storeId (auth) {score}
  GET  /api/ratings/store/:storeId (auth)
  Admin routes under /api/admin (auth+admin)
