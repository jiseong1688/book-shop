const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const order = (req,res)=>{
    const {user_id, items, delivery, totalQuantity, totalPrice} = req.body;
    // 배달 정보 넣기
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`;
    let values = [delivery.address, delivery.recevier, delivery.contact];
    // 주문서 
    sql += `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES ((SELECT title FROM books WHERE id = ?), ?, ?, ?, (SELECT MAX(id) FROM delivery));`;
    values.push(items[0].bookId, totalQuantity, totalPrice, user_id);
    items.forEach((value)=>{
        // orderItems 추가하기
        sql += `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ((SELECT MAX(id) FROM orders),?,?);`;
        values.push(value.bookId, value.quantity)
        // 장바구니 삭제
        sql += `DELETE FROM cartItems WHERE id = ?;`;
        values.push(value.cartItemId);
    })

    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })        
}

const getOrders = (req,res)=>{
    const {user_id} = req.body;
    let sql = `SELECT * FROM orders WHERE user_id = ?`;
    let values = [user_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })     

}

const getOrderDetail = (req,res)=>{
    const {user_id} = req.body;
    const order_id= req.params.id;
    let sql = `SELECT 
            o.id,
            b.title,
            b.img,
            c.category_name AS category,
            b.form, 
            b.isbn, 
            b.summary, 
            b.detail, 
            b.author, 
            b.pages, 
            b.contents, 
            b.price, 
            o.quantity, 
            b.pub_date 
        FROM orderedBook o 
        LEFT JOIN books b ON o.book_id = b.id
        LEFT JOIN category c ON c.id = b.category_id
        WHERE o.order_id=3`;
    let values = [user_id, order_id];
    db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results)
    })       
}
module.exports = {
    order,
    getOrders,
    getOrderDetail
};