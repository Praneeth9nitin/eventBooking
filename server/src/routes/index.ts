import express from 'express';
import admin from './admin.js'
import user from './user.js'
const route = express.Router();

route.use('/admin', admin);
route.use('/user', user);

export default route;