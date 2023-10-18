const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];

        const decodeToken = jwt.decode(token, "RANDOM-TOKEN");

        const user = await decodeToken;

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            error: "Invalid token",
        });
    }
};
