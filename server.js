const express = require('express')
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const contactsModel = require("./contactsModel");
const cors = require('cors')
const jwt = require("jsonwebtoken")
const cookiesParser = require("cookie-parser");

const port = 5000

let corsoption = {
    credentials: true,
}

app.use(cors(corsoption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser({useCredentials: true}));

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on('connected', () => console.log("DB Connected Successfully"))
db.on('error', (err) => console.log("DB not Connected", err))

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

app.get("/users", async (request, response) => {
    const users = await contactsModel.find();
  
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})

