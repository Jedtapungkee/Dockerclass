const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8000;

//สำหรับเก็บ users
let users = [];
let counter = 1;

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8700
  })
}


/*
1.	GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
2.	POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
3.	GET /users/:id สำหรับการดึง users รายคนออกมา
4.	PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
5.	DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/


//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req,res) =>{
  const results = await conn.query('SELECT * FROM users')
  res.json(results[0]);
})




// path = POST /user POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  try{
    let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?', user)
    res.json({
      message: 'Create user successfully',
      data: results[0]
    })
  } catch (error) {
    console.log("errorMessage",error.message)
    res.status(500).json({
      message: 'something went wrong',
    })
  }
})


// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', async (req,res) =>{
  try{
      let id = req.params.id;
    const results = await conn.query('SELECT * FROM users WHERE id = ?', id)

      if(results[0].length == 0){
        throw {statusCode:404, message:'user not found'}
      } res.json(results[0][0]);
      }
  catch(error){
    console.log("errorMessage",error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})


//PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)

app.put('/users/:id', async (req, res) => { 

    try{
      let id = req.params.id;
      let updateUser = req.body;
      let user = req.body;
      const results = await conn.query(
        'UPDATE users SET ? WHERE id = ?', 
        [updateUser, id])
      res.json({
        message: 'Update user successfully',
        data: results[0]
      })
    } catch (error) {
      console.log("errorMessage",error.message)
      res.status(500).json({
        message: 'something went wrong',
      })
    }
})


//patch DELETE /user/:id DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)

app.delete('/users/:id', async (req, res) => {
  try{
    let id = req.params.id;
    const results = await conn.query('DELETE FROM users WHERE id = ?', id)
    res.json({
      message: 'Delete user successfully',
      data: results[0]
    })
  } catch (error) {
    console.log("errorMessage",error.message)
    res.status(500).json({
      message: 'something went wrong',
    })
  }
})


app.listen(port, async (req, res) => {
  await initMySQL()
    console.log('Server is running on ', + port);
})