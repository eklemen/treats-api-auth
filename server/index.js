require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import router from './services/router';
import passport from 'passport';

const app = express();
// process.env.MONGODB_URI heroku

mongoose.connect(process.env.MONGODB_LOCAL, () => {
    console.log('mongo connected, you good fam...');
});

app.use(morgan('combined'));
app.use(bodyParser.json());
require('./services/passport');
app.use(passport.initialize());
app.use('/v1', router);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

console.log('Listening on ', HOST, PORT);
app.listen(PORT, HOST);
