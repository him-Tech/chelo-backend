import express  from "express";
import cors from "cors";
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';



const app = express();

app.use(express.json())
app.use(cors());

// Routes
app.use('/api/v1/customer',customerRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/category',categoryRoutes);


// Rest Api  
app.get('/',(req,res)=>{
  res.send("<h1> Welcome to Chelo Shop </h1>")
})

export default app;