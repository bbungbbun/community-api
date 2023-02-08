const express = require('express');
const app = express();
const port = 3010;
const mysql = require('mysql');

const dotenv = require("dotenv");
dotenv.config();

const multer = require('multer'); // multer모듈 적용 (for 파일업로드)
const storage = multer.diskStorage({
  limits: { fileSize: 100 * 1024 * 1024 }, // 사진 용량 제한
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  },
})
const upload = multer({ storage: storage })

const fs = require("fs");
const cors = require('cors');
app.use(cors ({
  credentials: true
}));

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @description 저장한 파일 조회 - static 파일 제공
 * */

app.use('/upload', express.static('uploads'));

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
 * @description 사진 업로드 테스트 페이지 불러오기
 * */

app.get('/upload', function(req, res){
  res.send(`
  <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<form action="http://localhost:3010/upload" method="post" enctype="multipart/form-data">
<input type="file" name="upload" id="">
<button type="submit">업로드</button>
<input type="submit" value="완료">
</form>
<img src="http://localhost:3010/upload/cat.jpg" alt="" srcset="">
</body>
</html>
  `);
});

/**
 * @description 사진 업로드
 * */

app.post('/upload', upload.array('upload'), function(req, res){
  const files = req.files;
  console.log('files ', files);
  for (let i = 0; i < files.length; i++) {
    console.log('files > ', files[i]);
  }
  res.send({ sendFiles : files});
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