const { off } = require('process');
const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req,res)=>{
    let {category_id, news, limit, currentPage} = req.query;
    
    let offset = limit * (currentPage-1);

    let sql = "SELECT * FROM books";
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

    sql += " LIMIT ?,?"
    values.push(offset, parseInt(limit))
    console.log(sql,values)

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
    let {id} = req.params;
    
    const sql = `SELECT * FROM books LEFT JOIN category
                ON books.category_id = category.id  WHERE books.id=?`
    db.query(sql, id, (err, results)=>{
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

// const booksByCategory = (req,res)=>{
//     let {category_id} = req.query;
    
//     const sql = "SELECT * FROM books WHERE cetagory_id = ?"
//     db.query(sql, category_id, (err, results)=>{
//         if (err){
//             console.log(err);
//             return res.status(StatusCodes.BAD_REQUEST).end();
//         }

//         if(results.length)
//             return res.status(StatusCodes.OK).json(results);
//         else
//             return res.status(StatusCodes.NOT_FOUND).end();
//     });
// };

module.exports = {
    allBooks,
    bookDetail,
    // booksByCategory,
};