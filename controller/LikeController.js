const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config();

const addLike = (req,res)=>{
    const book_id = req.params.id;
    // const {user_id} = req.body;

    let authorization = ensureAuthorization(req);

    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3)";
    let values= [authorization.id, book_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })                                              
}

const removeLike = (req,res)=>{
    const book_id = req.params.id;
    // const {user_id} = req.body;

    let authorization = ensureAuthorization(req);

    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
    let values= [authorization.id, book_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })         
}

function ensureAuthorization(req) {
    let recivedJWT = req.headers["authorization"];
    let decodedJWT = jwt.verify(recivedJWT, process.env.SECRTE_KEY)

    return decodedJWT
}

module.exports = {
    addLike,
    removeLike
};