const { off } = require('process');
const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req,res)=>{
    let {category_id, news, limit, currentPage} = req.query;

    let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM Bookshop.books";
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
    
    if (limit && currentPage){
        let offset = limit * (currentPage-1);
        sql += " LIMIT ?,?"
        values.push(offset, parseInt(limit))
    }

    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.length)
            return res.status(StatusCodes.OK).json(results);
        else
            return res.status(StatusCodes.NOT_FOUND).end();
    });
}

const bookDetail = (req,res)=>{
    let {user_id} = req.body;
    let book_id = req.params.id;
    
    let sql = `SELECT *,
	                    (SELECT count(*) FROM likes WHERE liked_book_id=?) AS likes,
                        (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
                    FROM books 
                    LEFT JOIN category
                    ON books.category_id = category.id
                    WHERE books.id=?;`
    let values = [book_id, user_id,book_id, book_id]
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