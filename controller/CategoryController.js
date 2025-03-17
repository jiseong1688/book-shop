const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allCategory = (req,res)=>{
    const sql = "SELECT * FROM categories"
        db.query(sql, (err, results)=>{
            if (err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results)
        })
};

module.exports = {
    allCategory
};