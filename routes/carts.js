const express = require('express');
const router = express.Router();

// 장바구니 담기
router.post('/', (req,res)=>{
    res.json('장바구니 담기')                                                         
});
// 장바구니 조회
router.get('/',(req,res)=>{
    res.json('장바구니 조회')
});
// 장바구니 도서 삭제
router.delete('//:id',(req,res)=>{
    res.json('장바구니 도서 삭제')       
});
// 장바구니에서 서택한 주문 예상 상품 목록 조히
// router.get('/',(req,res)=>{
//     res.json('장바구니에서 서택한 주문 예상 상품 목록 조히')       
// });
    
module.exports = router;