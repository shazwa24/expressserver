const express = require('express')
const fs = require('fs')
const app = express()
const port = 5000

app.use(express.json())

app.get('/users', (req, res) => {
    const users = getUserData()
    res.send(users)
})

app.post('/users/add', (req, res) => {
    //get the existing user data
    const existUsers = getUserData()
    
    //get the new user data from post request
    const userData = req.body
   
    //append the user data
    existUsers.push(userData)
    //save the new user data
    saveUserData(existUsers);
    res.send({success: true, msg: 'User data added successfully'})
})

app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log("id", id)
    const existUsers = getUserData()
    const filterUser = existUsers.filter(users => {
        return users.id !== id
      });
    console.log(filterUser);
    saveUserData(filterUser)
    res.send({success: true, msg: 'User removed successfully'})
    
})

app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    const existUsers = getUserData()
    const user = existUsers.find(user => user.id === id);
    console.log(user);
    // const updateUser = existUsers.filter(users => {
    //     return users.id !== id
    //   });
    // updateUser.push(userData)
    // saveUserData(updateUser)
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.phone = data.phone;
    user.gender = data.gender;

    saveUserData(existUsers)
    res.send({success: true, msg: 'User data updated successfully'})
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