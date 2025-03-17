const express = require('express');
const router = express.Router();
const book = require('../controller/BookController');


router.get('/', book.allBooks);         // 전체 도서 조회
router.get('/:id', book.bookDetail);    // 개별 도서 조회
// router.get('/', book.booksByCategory);  // 카테고리별 도서 목록 조회
    
module.exports = router;