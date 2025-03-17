const db = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

const join = (req,res,next)=>{
    const {email,password} = req.body;

    // 비밀번호 암호화
    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

    let selEmailSql = 'SELECT * FROM users WHERE email = ?';
    let insertEmailSql = 'INSERT INTO users (email, password, salt) VALUES(?,?,?)';
    db.query(selEmailSql,[email],(err, results)=>{
        if(results && results.length >0){
            console.log("이미 있는 아이디 입니다.")
            res.status(StatusCodes.BAD_REQUEST).json({message: "이미 사용중인 아이디입니다."})
        } else {
            db.query(insertEmailSql,[email,hashPassword,salt], (err,result)=>{
                if (err) {
                    console.log(err)
                    return res.status(StatusCodes.NOT_FOUND).json({message:" 회원가입에 살패했습니다."})
                }
                console.log("회원가입에 성공하였습니다.")
                res.status(StatusCodes.CREATED).json({message: `${email}으로 회원가입이 완료되었습니다.`})
            })
        }
    })
}

const login = (req,res)=>{
	const {email, password} = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, email,
        (err, results)=>{
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];
            const inputPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512').toString('base64');
            if(loginUser && loginUser.password == inputPassword){
                const token = jwt.sign({
                    email: loginUser.email
                }, process.env.SECRTE_KEY, {
                    expiresIn: '5m',
                    issuer: "jiseong"
                });

                res.cookie("token", token, {
                    httpOnly: true
                });
                console.log(token);

                return res.status(StatusCodes.OK).json(results)
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
}

const passwordResetRequest = (req,res)=>{
    const {email} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, email,
        (err, results) =>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).end();
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
}

const passwordReset = (req,res)=>{
    const {email, password} = req.body;

    // 비밀번호 암호화
    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

    let sql = 'UPDATE users SET password=?, salt=? WHERE email=?';
    db.query(sql, [hashPassword, salt, email],
        (err, results) =>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows == 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )
}
module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset 
};