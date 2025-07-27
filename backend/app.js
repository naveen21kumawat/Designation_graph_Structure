import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import dbconnect from './config/db.js';
import cors from 'cors';
dotenv.config();
const app = express();
dbconnect();
const PORT = process.env.PORT

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.get('/api', (req, res) => {
    res.send('API endpoint is working!');
});
app.get('/users', (req, res) => {
    res.json([
  { "id": "A1", "name": "Alice", "role": "CEO", "level": 1, "image": "https://example.com/img1.jpg" },
  { "id": "B1", "name": "Bob", "role": "CTO", "level": 2, "image": "https://example.com/img2.jpg" },
  { "id": "C1", "name": "Charlie", "role": "Engineer", "level": 3, "image": "https://example.com/img3.jpg" }
]
)
});
app.use("/api/user",userRoute)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});