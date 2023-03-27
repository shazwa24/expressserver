const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
const cookiesParser = require("cookie-parser");
var bcrypt = require("bcrypt")

const port = 5000

let corsoption = {
    credentials: true,
}

app.use(cors(corsoption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser({useCredentials: true}));

const secretKey = "secretKey";

app.post("/login", async (req, res) => {
    const user = req.body
    console.log("BODY", req.body)
    // const user = {
    //     username: "shazwa",
    //     password: "12345",
    //     email: "shazwa313@gmail.com",
    // };
    jwt.sign(user, secretKey, { expiresIn: "500s" }, (er, token) => {
        // res.cookie("jwt", token);
        res.cookie('jwt',token,{maxAge:900000, httpOnly:true, secure:true}) 
        res.json("Cookie stored");
    });
});

const verifyToken = (req, res, next) => {
    console.log("VERIFY", req.cookies)
    const JWT = req.cookies.jwt;
    // if (!authHeader) {
    //     res.status(401).send("Invalid Token");
    // }

    jwt.verify(JWT, secretKey, (err, authData) => {
        if (err) {
            res.status(401).send("Invalid Token");
        } else {
            // req.user = authData.user;
            next();
        }
    });
};

app.use(verifyToken);

app.get('/users', (req, res) => {
    const users = getUserData()
    res.send(users)
})

app.post('/users/add', (req, res) => {
    const existUsers = getUserData()
    const userData = req.body
    console.log("POST userdata", userData);
    existUsers.push(userData)
    console.log("POST", existUsers);
    saveUserData(existUsers);
    res.send({ success: true, msg: 'User data added successfully' })
})

app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log("DELETE", id)
    const existUsers = getUserData()
    const filterUser = existUsers.filter(users => {
        return users.id !== id
    });
    console.log(filterUser);
    saveUserData(filterUser)
    res.send({ success: true, msg: 'User removed successfully' })

})

app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    console.log("PUT userdata", data);
    const existUsers = getUserData()
    const user = existUsers.find(user => user.id === id);
    console.log("PUT", user);
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.phone = data.phone;
    user.gender = data.gender;
    saveUserData(existUsers)
    res.send({ success: true, msg: 'User data updated successfully' })
})

const getUserData = () => {
    const jsonData = fs.readFileSync('users.txt')
    return JSON.parse(jsonData)
}

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('users.txt', stringifyData)
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})