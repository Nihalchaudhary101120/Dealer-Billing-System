import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import requireAuth from './middleware/requireAuth.js';
import bikeRoutes from './routes/bikeRoutes.js';
import financeCompanyRoutes from  "./routes/financecomapanyRoutes.js";
import dealerRoutes from './routes/dealerRoutes.js';

connectDB();
const app = express();
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: "billing-system",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use('/auth', authRoutes);
app.use(requireAuth);
app.use("/bike", bikeRoutes);
app.use("/finance_company", financeCompanyRoutes);
app.use("/dealer",dealerRoutes);


const port = 3000;
app.listen(port, () => (`server running at port ${port}`));