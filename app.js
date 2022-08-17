//インポート。expressのライブラリを呼び出している
const express = require("express");
//アプリとして使うため。expressの関数をappに持ち出している
const app = express();
const taskRoute = require("./routes/tasks");
const connectDB = require("./db/connect");
require("dotenv").config();

app.use(express.json());
// 静的なファイルを使う宣言
app.use(express.static("./public"));

// ローカルサーバーを立ち上げる場所を指定
const PORT = 5000;
// 共通部分を指定
app.use("/api/v1/tasks", taskRoute);

//データベースと接続
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT, console.log("サーバーが起動しました"));
    } catch (err) {
        console.log(err);
    }
}

start();

