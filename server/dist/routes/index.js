import express from 'express';
import admin from './admin.js';
const route = express.Router();
route.use('/admin', admin);
export default route;
//# sourceMappingURL=index.js.map