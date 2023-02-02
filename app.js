const express = require('express');
const app = express();
const port = 3010;
const mysql = require('mysql');
const dotenv = require("dotenv");
dotenv.config();

const cors = require('cors');

app.use(cors ({
  credentials: true
}));

const router = express.Router();

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});

/**
 * @description 전체 조회
 * */
app.get('/getAll', (req, res) => {
  const query = "select * from board;";
  db.query(query, (err, data) => {
    if (err) throw new Error(err);
    res.send(data);
  });
});


/**
 * @description 아이디에 맞는 글 조회
 * */

app.get('/getBoard', (req,res)=>{
  const info = req.query;
  const query = "SELECT id, title, content, created_at FROM board WHERE id = ?";
  db.query(query, [info.id], (err, data) => {
    if (err) throw new Error(err);
    res.send(data);
  });
})

/**
 * @description 글쓰기
 * */
app.post('/write', (req, res) => {
  const info = req.body;

  const query = "INSERT INTO board(title, content) VALUES(?, ?);";
  db.query(query, [info.title, info.content], (err) => {
    if (err) throw new Error(err);
    res.send({ message: 'success' });
  });
});


/**
 * @description 글수정
 * */
app.patch('/modify', (req, res) => {
  const info = req.body;

  const query = `UPDATE board SET content = ?, title = ?, updated_at = now() WHERE id = ?`;
  db.query(query,[info.content, info.title, info.id], (err) => {
    if (err) throw new Error(err);
    res.send({ message: 'success' });
  });
});

/**
 * @description 글삭제
 * */
app.delete('/delete', (req, res) => {
  const info = req.query;

  const query = "DELETE FROM board WHERE id = ?";
  db.query(query, [info.id], (err) => {
    if (err) throw new Error(err);
    res.send(req.query);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`http://localhost:${port}/getAll`)
});