const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const ensureAuthorization = require('../controller/auth');
const jwt = require('jsonwebtoken')

const addCartItem = (req,res)=>{
    const {book_id, quantity} = req.body;

    let authorization = ensureAuthorization(req, res)
    if ( authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인해주세요"
        })
    } else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "없는 토큰입니다."
        })
    } else {
        let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);";
        let values= [book_id, quantity, authorization.id];
        db.query(sql, values, (err, results)=>{
            if (err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results)
        })
    }
};

const getCartItem = (req,res)=>{
    const {selected} = req.body;

    let authorization = ensureAuthorization(req, res)
    if ( authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인해주세요"
        })
    } else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "없는 토큰입니다."
        })
    } else {
        let sql = "SELECT c.id AS cart_id, b.id AS book_id, b.title, b.summary, c.quantity, b.price FROM books b LEFT JOIN cartItems c ON c.book_id = b.id WHERE c.user_id = ?";
        let values= [authorization.id];

        if (selected) {
            sql += " AND c.id IN (?)";
            values.push(selected);
        }

        db.query(sql, values, (err, results)=>{
            if (err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results)
        })
    }
};

const deleteCartItem =(req,res)=>{
    const book_id = req.params.id;
    let authorization = ensureAuthorization(req, res)
    if ( authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인해주세요"
        })
    } else if (authorization instanceof jwt.JsonWebTokenError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "없는 토큰입니다."
        })
    } else {

        let sql = "DELETE FROM cartItems WHERE user_id = ? AND book_id = ?;";
        let values= [authorization.id, book_id];
        db.query(sql, values, (err, results)=>{
            if (err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results)
        })
    }
};

module.exports = {
    addCartItem,
    getCartItem,
    deleteCartItem
};