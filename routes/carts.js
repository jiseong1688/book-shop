const express = require('express');
const router = express.Router();
const { addCartItem, getCartItem, deleteCartItem } = require('../controller/CartController');

// 장바구니 담기
router.post('/',addCartItem );
// 장바구니 조회 & 선택된 장바구니 아이템 목록 조회
router.get('/',getCartItem);
// 장바구니 도서 삭제
router.delete('/:id',deleteCartItem);
    
module.exports = router;