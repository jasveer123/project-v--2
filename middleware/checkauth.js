const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            res.status(401).json({
                errors: [
                    {
                        msg: "No token found"
                    }
                ]
            })
        }
        const decoded = await jwt.verify(token, "nfb32iur32ibfqfvi3vf932bg932g932");
        req.userData = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};