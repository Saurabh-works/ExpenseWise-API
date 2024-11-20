// server/server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expense');
const incomeRoutes = require('./routes/income');
const reportRoutes = require('./routes/reports');
const recentExpensesRoutes = require('./routes/recentexpenseRoute');
const getMonthlySpendsRoutes = require('./routes/getMonthlySpendsRoutes');
const getCurrentMonthRoutes = require('./routes/currentmonthroutes');
const getDailySpendsRoutes = require('./routes/dailyspendsroutes');
const getuserRoute = require('./routes/userRoutes');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ["https://expense-wise.vercel.app"], // Allow requests from this origin
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
  }));
app.use(express.json());

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/recent-expenses', recentExpensesRoutes);
app.use('/api/monthly-spends', getMonthlySpendsRoutes);
app.use('/api/current-month', getCurrentMonthRoutes);
app.use('/api/daily-spends', getDailySpendsRoutes);
app.use('/api/users', getuserRoute);

app.get("/", (req, res)=>{
    res.json("You can deploy now...")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
