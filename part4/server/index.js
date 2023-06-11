require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./controllers/blogs');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
