// express 모듈
const express =require('express');
const app = express();

// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

app.listen(process.env.PORT);

const userRouter = require('./routes/users.js');
const bookRouter = require('./routes/books.js');
const likeRouter = require('./routes/likes.js');
const cartRouter = require('./routes/carts.js');
const orderRouter = require('./routes/orders.js');
const categoryRouter = require('./routes/category.js');

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/category", categoryRouter);

app.get('/',(req,res)=>{
    res.send('Hello World!');
})