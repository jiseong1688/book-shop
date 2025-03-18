const express = require('express');
const router = express.Router();
const {allCategory} = require('../controller/CategoryController');


router.get('/', allCategory);         // 카테고리 전체 도서 조회
    
module.exports = router;