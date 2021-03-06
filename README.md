# Todo-Sequelize
這是個 todo-list 練習，使用到 [Node.js](https://nodejs.org/en/)、[Express](https://expressjs.com/)、[MySQL](https://www.mysql.com/)、[Sequelize](https://sequelize.org/)

![scrrenshot](https://github.com/JessieMosbi/todo-sequelize/blob/master/image/screenshot.png?raw=true)

## Requirement
[Node.js](https://nodejs.org/en/)   
[MySQL](https://www.mysql.com/)

## Packages
此專案用到以下 JS library，可藉由 `npm install` 指令去安裝（請參考底下 Installing 步驟）   
[express](https://expressjs.com/)   
[express-handlebars](https://www.npmjs.com/package/express-handlebars)   
[body-parser](https://www.npmjs.com/package/body-parser)   
[method-override](https://www.npmjs.com/package/method-override)   
[mongoose](https://mongoosejs.com/)   
[express-session](https://www.npmjs.com/package/express-session)   
[passport](http://www.passportjs.org/)   
[passport-local](http://www.passportjs.org/packages/passport-local/)   
[passport-facebook](http://www.passportjs.org/packages/passport-facebook/)   
[bcryptjs](https://www.npmjs.com/package/bcryptjs)   
[connect-flash](https://www.npmjs.com/package/connect-flash)   
[dotenv](https://www.npmjs.com/package/dotenv)   
[mysql2](https://www.npmjs.com/package/mysql2)   
[sequelize](https://www.npmjs.com/package/sequelize)   
[sequelize-cli](https://www.npmjs.com/package/sequelize-cli)

***

## Installing
開啟終端機 (Terminal)，透過 `git clone` 指令將專案下載下來到本機端
```console
git clone https://github.com/JessieMosbi/todo-sequelize
```

進入 todo-sequelize 資料夾內，並檢查是否有 package.json 檔案
```console
cd todo-sequelize
```

執行 `npm install`，將專案所需套件下載下來
```console
npm install
```

## Setting
因此專案有結合 Facebook API，故需在 Facebook for developers 上設定一個應用程式，並把資訊填入 .env 檔才能正常啟用   
請建立一個 .env 檔案，填入以下資訊，並放在根目錄底下
```console
// .env
FACEBOOK_ID=xxxxxxxx
FACEBOOK_SECRET=xxxxxxxx
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
```

## Executing
請啟動 MySQL DB（下方圖片以 MAC OS 作為範例，綠燈表示為已啟動）
![scrrenshot](https://github.com/JessieMosbi/todo-sequelize/blob/master/image/MySQL_active.png?raw=true)

請建立一個名為 todo_sequelize 的 Database，下方為 sql 語法
```console
drop database if exists todo_sequelize;
create database todo_sequelize;
```

進到專案資料夾底下，執行 migrations 檔案，以建立專案所需資料表、欄位
```console
cd <Your download directory>/todo-sequelize
npx sequelize db:migrate
```

最後，以專案已設定的統一指令，即可執行專案
```console
npm run dev
```

預設 port 為 3000，請直接打開瀏覽器，並在 URL 輸入 http://localhost:3000/ 即可瀏覽網頁

## Other steps
MySQL DB 可透過 MySQLWorkbench 等 DBMS 工具，以 GUI 的形式進行操作，會較方便觀看資料

## Features
+ 註冊、登入（可用 Facebook 登入）
+ 首頁可一次所有代辦事項清單
+ 首頁可以狀態（所有狀態、已完成、未完成）、日期，搜尋相關待辦事項
+ 點選首頁中的 Create 建立一個代辦事項清單
+ 點選首頁中，任一代辦事項的 Edit，即可進入編輯頁面進行編輯
+ 點選首頁中，任一代辦事項的 Delete，即可刪除資料
+ 點選首頁中，任一代辦事項的 Detail，即可查看詳資料
