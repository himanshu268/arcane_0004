const jwt = require('jsonwebtoken');
const jwttoken = "notgonnadisclose";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    console.log(token);
    if (!req.header('auth-token') || !token) {
        const to = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUxZmQ0MTVmM2E3ZTU4ZGUzZDY4ZmNlIn0sImlhdCI6MTY5NjU4NDcyNX0.p0BsQ73hYqC6pHXbc9N_qy2lj-JVJXZyUyuh_FO2bM4";
        const data = jwt.verify(to, jwttoken);
        req.user = data.user;
        console.log(data.user);
        next();

    }
    // if (!token) {
    //     res.status(401).send("Access Denied no token");
    // }
    else {
        try {
            const data = jwt.verify(token, jwttoken);

            const currentTimestamp = Math.floor(Date.now() / 1000);
            // console.log(data.exp);

            if (data.exp <= currentTimestamp) {
                return res.status(401).json({ message: 'Token has expired' });
            }
            else{

                // If the token is valid, you can access `decoded.user` to identify the user
                req.user = data.data.user;
                console.log('working')
                console.log(req.user);
                console.log('notworking')
                next();
            }
        } catch (error) {
            console.log(error.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}
    module.exports = fetchuser;