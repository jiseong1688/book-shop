const express = require('express');
const router = express.Router();

// 좋아요 추가
router.post('/:id', (req,res)=>{
    res.json('좋아요 추가')                                                         
});
// 좋아요 삭제
router.delete('/:id',(req,res)=>{
    res.json('좋아요 삭제')
});
    
module.exports = router; 