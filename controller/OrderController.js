const {StatusCodes} = require('http-status-codes');
const db = require('../mariadb');

const order = async (req,res)=>{
    try{
        const {user_id, items, delivery, totalQuantity, totalPrice} = req.body;
        let deliveryId; let sql; let values;

        if (delivery.id){
            deliveryId = delivery.id;
        } else {
            // 배달 정보 넣기
            sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?,?,?);`;
            values = [delivery.address, delivery.recevier, delivery.contact];
            const [deliveryResult] = await db.query(sql, values);
            deliveryId = deliveryResult.insertId;
        }
        
        // items를 가지고, 장바구니에서 book_id, quantity 조회
        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems] = await db.query(sql, [items]);

        // 주문서 
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES ((SELECT title FROM books WHERE id = ?), ?, ?, ?, ?);`;
        values = [orderItems[0].book_id, totalQuantity, totalPrice, user_id, deliveryId];
        let [results] = await db.query(sql, values);
        let order_id = results.insertId;
        

        // orderedBook에 데이터 넣기
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
        values = [];

        orderItems.forEach((item)=>{
            values.push([order_id, item.book_id, item.quantity]);
        })
        
        result = await db.query(sql,[values])
        await deleteCartItem(items);

        
        return res.status(StatusCodes.OK).json(result)
    }catch(err){
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
}

const deleteCartItem = async(valueList) =>{
    const sql = `DELETE FROM cartItems WHERE id IN (?);`;
    const values = valueList;

    return await db.query(sql,[values])
}

const getOrders = async (req,res)=> {
    const {user_id} = req.body;
    let sql = `SELECT 
            o.id,
            o.book_title, 
            o.total_quantity, 
            o.total_price, 
            o.created_at,
            d.address, 
            d.receiver, 
            d.contact 
            FROM orders o 
            LEFT JOIN delivery d ON o.delivery_id = d.id 
            WHERE o.user_id = ?;`;
    let values = [user_id];
    let [rows, fields] = await db.query(sql, values);
    return res.status(StatusCodes.OK).json(rows);  
}

const getOrderDetail = async (req,res)=>{
    const order_id= req.params.id;
    let sql = `SELECT
            book_id,
            title,
            img, 
            author, 
            price, 
            quantity
        FROM orderedBook
        LEFT JOIN books ON orderedBook.book_id = books.id
        WHERE order_id = ?;`;
    let values = [order_id];
    let [rows, fields] = await db.query(sql, values)
    return res.status(StatusCodes.OK).json(rows);  
}
module.exports = {
    order,
    getOrders,
    getOrderDetail
};