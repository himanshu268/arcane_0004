const jwt = require('jsonwebtoken');
const jwttoken = "notgonnadisclose";

const checklogin = (req, res, next) => {
    const token = req.header('auth-token');
    console.log(token);
    if (!req.header('auth-token') || !token) {
        // const to = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUxZmQ0MTVmM2E3ZTU4ZGUzZDY4ZmNlIn0sImlhdCI6MTY5NjU4NDcyNX0.p0BsQ73hYqC6pHXbc9N_qy2lj-JVJXZyUyuh_FO2bM4";
        // const data = jwt.verify(to, jwttoken);
        data="";
        req.user = data;
        // console.log(req.user);
        next();

    }
    // if (!token) {
    //     res.status(401).send("Access Denied no token");
    // }
    else{
        try {
            
            const data = jwt.verify(token, jwttoken);
            req.user = data.user;
            // console.log(data.user);
            next();
            
        } catch (error) {
            res.status(401).send("Accessss Denied");
            
            
        }
    }

}

module.exports = checklogin;