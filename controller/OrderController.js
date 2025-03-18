const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addCart = (req,res)=>{
    const {book_id, quantity, user_id} = req.body;

    let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);";
    let values= [book_id, quantity, user_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })          
};

const getCart = (req,res)=>{
    const {user_id} = req.body;

    let sql = "SELECT c.id AS cart_id, b.id AS book_id, b.title, b.summary, c.quantity, b.price FROM books b LEFT JOIN cartItems c ON c.book_id = b.id WHERE c.user_id = ?";
    let values= [user_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })          
};

const deleteCart =(req,res)=>{
    const book_id = req.params.id;
    const {user_id} = req.body;

    let sql = "DELETE FROM cartItems WHERE user_id = ? AND book_id = ?;";
    let values= [user_id, book_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })     
};

module.exports = {
    addCart,
    getCart,
    deleteCart,
};