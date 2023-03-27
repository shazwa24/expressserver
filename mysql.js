const express = require('express')
const app = express()
const cors = require('cors')
var mysql = require("mysql");

const port = 5080

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "my_db",
});

app.get('/users', (req, res) => {
    const sql = "SELECT * from users";

    connection.query(sql, (err, result) => {
        res.send(result);
    });
})

app.post('/users/add', (req, res) => {
    const post = req.body;
    const sql = "INSERT INTO users SET ?";

    connection.query(sql, post, (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(result);
    });
})

app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log("DELETE", id)
    const sql = `DELETE FROM users WHERE id = ${id}`;

    connection.query(sql, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send("user deleted successfully");
        }
    });

})

app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    console.log("PUT userdata", data);
    const sql = `UPDATE users SET ? WHERE id = ${id}`;
    connection.query(sql, data, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

connection.connect((err) => {
    if (err) throw err;
  
    console.log("Mysql Connected");
  });

// const getUserData = () => {
//     const jsonData = fs.readFileSync('users.txt')
//     return JSON.parse(jsonData)
// }

// const saveUserData = (data) => {
//     const stringifyData = JSON.stringify(data)
//     fs.writeFileSync('users.txt', stringifyData)
// }

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

})