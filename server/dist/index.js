import express from 'express';
import cors from 'cors';
import route from './routes/index.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
console.log(process.env.DATABASE_URL);
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', route);
app.listen(3000);
//# sourceMappingURL=index.js.map