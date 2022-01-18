const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use('/api/v1', require('./routes/user.route'));

app.listen(5000);
