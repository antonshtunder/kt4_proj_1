let express = require('express');
let app=express();
let PORT = process.env.PORT || 3000;
let apiController=require('./controllers/apiController');
let cors = require('cors');

app.use(cors());

apiController(app);

app.listen(PORT);