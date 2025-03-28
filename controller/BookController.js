const { off } = require('process');
const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const ensureAuthorization = require('../controller/auth');
const jwt = require('jsonwebtoken')

const allBooks = (req,res)=>{
    let {category_id, news, limit, currentPage} = req.query;

    let sql = "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM Bookshop.books";
    let values = [];

    if (category_id && news) {
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 24 Month) AND NOW();";
        values = [parseInt(category_id)];
    } else if(category_id) {
        sql += " WHERE category_id = ?";
        values = [parseInt(category_id)];
    } else if (news) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 24 Month) AND NOW();";
    }

    let offset = limit * (currentPage-1);
    sql += " LIMIT ?,?"
    values.push(offset, parseInt(limit))

    let output = {
        books: [],
        pagenation:{
            currentPage: parseInt(currentPage),
            totlaCount:0
        }
    }
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if(results.length){
            results.map(function(result) {
                result.pubDate = result.pub_date;
                delete results.pub_date;
            })
            return output.books = results
        } else 
            return res.status(StatusCodes.BAD_REQUEST).end();
    });

    sql = "SELECT found_rows();"
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        output.pagenation.totalCount = results[0]["found_rows()"];

        return res.status(StatusCodes.OK).json(output);
    });
}

const bookDetail = (req,res)=>{
    let book_id = req.params.id;
    let authorization = ensureAuthorization(req);
    let temp = `,(SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked`;
    let values = [book_id, authorization.id,book_id, book_id];
    if ( authorization instanceof jwt.TokenExpiredError){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인해주세요"
        })
    } else if (authorization instanceof jwt.JsonWebTokenError){
        temp = ``;
        values = [book_id, book_id];
    }
    let sql = `SELECT *,
        (SELECT count(*) FROM likes WHERE liked_book_id=?) AS likes${temp}
        FROM books 
        LEFT JOIN category
        ON books.category_id = category.id
        WHERE books.id=?;`
    console.log(sql,values)
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results[0])
            return res.status(StatusCodes.OK).json(results);
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    });
}

module.exports = {
    allBooks,
    bookDetail,
};