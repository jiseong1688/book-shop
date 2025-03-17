const express = require('express');
const router = express.Router();
const db = require('../mariadb');
const {body, validationResult} = require('express-validator')
const{
    join,
    login,
    passwordResetRequest,
    passwordReset }= require('../controller/UserController');

const validate = (res,req,next)=>{
    const err = validationResult(req);

    if (!err.isEmpty()){
        return res.status(400).json(err.array())
    } else {
        return next();
    }
};

// 회원가입
router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 필요!'),
        body('password').notEmpty().isStrongPassword().withMessage('비밀번호 필요!'),
        validate
    ], join);
// 로그인
router.post('/login',login);
// 비밀번호 초기화 요청
router.post('/reset',passwordResetRequest);
// 비밀번호 초기화
router.put('/reset',passwordReset);
    
module.exports = router;