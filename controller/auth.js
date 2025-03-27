const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config();

const ensureAuthorization = (req,res) => {
    try{
        let recivedJWT = req.headers["authorization"];
        let decodedJWT = jwt.verify(recivedJWT, process.env.SECRTE_KEY)
        return decodedJWT
    } catch(err){
        console.log(err.name);
        console.log(err.message);
        return err
    }
}


module.exports = ensureAuthorization