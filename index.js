const express= require("express");
const Router = require("./routes/route");
const path = require('path');

const app = express();
const port = 3000;


// Middleware to parse POST bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(Router);
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'views')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});