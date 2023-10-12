const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const connectDB = require('./Config/db')
const categoryRoutes = require('./Routes/categoryRoutes')
const productRoutes = require('./Routes/productRoutes')
const listRoutes = require('./Routes/listRoutes')

const app = express();
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true }));
dotenv.config()
connectDB();
app.use(cors())

const PORT = process.env.PORT ||5000

app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/list', listRoutes)



app.listen(PORT, () => {
    console.log('server connected');
})