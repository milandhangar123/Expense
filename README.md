# 💰 Personal Finance Tracker

A modern, full-stack personal finance tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing with bcrypt

### 💳 Transaction Management
- **CRUD Operations**: Create, Read, Update, Delete transactions
- **Categories**: Predefined categories for better organization
- **Amount Types**: Support for both income (+) and expenses (-)
- **Date Tracking**: Full date support for transaction history

### 📊 Dashboard & Analytics
- **Financial Overview**: Total income, expenses, and balance
- **Transaction Statistics**: Count of total transactions
- **Smart Filtering**: Filter by category and transaction type
- **Visual Indicators**: Color-coded amounts (green for income, red for expenses)

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Clean, professional interface with CSS variables
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side and server-side validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Expense
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `Backend` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/personal-finance-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   ```

5. **Start the Application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd Backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
Expense/
├── Backend/
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   └── transactionController.js
│   ├── middleware/           # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/              # Database models
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   └── transactionRoutes.js
│   ├── server.js            # Main server file
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── TransactionForm.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── AddTransaction.jsx
│   │   │   ├── EditTransaction.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # App entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all user transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 🎯 Key Features Implemented

### ✅ Requirements Met
- **Backend**: Node.js, Express, MongoDB ✅
- **REST API**: Full CRUD operations ✅
- **Frontend**: React with routing ✅
- **Routes**: /, /add, /:id/edit, /:id/delete ✅
- **Fields**: title, amount (+/-), date, category ✅

### 🌟 Bonus Features
- **Authentication**: JWT-based user authentication ✅
- **localStorage**: Token and user data persistence ✅
- **Filters**: Category and type filtering ✅
- **Modern UI**: Professional, responsive design ✅
- **Loading States**: Smooth user experience ✅
- **Error Handling**: Comprehensive error management ✅
- **Form Validation**: Client and server-side validation ✅

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with variables
- **Fetch API** - HTTP requests

## 🎨 Design Features

- **Color Scheme**: Professional blue and green palette
- **Typography**: Inter font family for readability
- **Spacing**: Consistent spacing using CSS variables
- **Shadows**: Subtle shadows for depth
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first responsive design

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Configure environment variables on your hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API endpoints in the frontend configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- Built with modern web technologies
- Follows best practices for security and performance
- Designed with user experience in mind
- Fully responsive and accessible

---

**Happy Financial Tracking! 💰📊**
