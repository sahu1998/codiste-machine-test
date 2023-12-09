const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
    const bearertoken = req.headers.authorization;
    try {
        if(!bearertoken){
            return res.status(401).send("Authentication failed!")
        }
        const token = bearertoken.split(" ").pop();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.loggedInUserId = decoded._id;
        next();
    } catch (error) {
        return res.status(401).send({error: error.message});
    }
}
module.exports = {verifyUser}