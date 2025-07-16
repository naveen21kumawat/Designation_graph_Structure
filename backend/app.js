import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import dbconnect from './config/db.js';
dotenv.config();
const app = express();
dbconnect();
const PORT = process.env.PORT

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.get('/api', (req, res) => {
    res.send('API endpoint is working!');
});
app.get('/users', (req, res) => {
    res.json([

         { id: "1", name: "Alice", role: "CEO", parentId: null },
  { id: "2", name: "Bob", role: "Manager", parentId: "1" },
  { id: "3", name: "Charlie", role: "Manager", parentId: "1" },
  { id: "4", name: "David", role: "Developer", parentId: "2" },
  { id: "5", name: "Sara", role: "QA Engineer", parentId: "2" },
  { id: "6", name: "Eva", role: "Developer", parentId: "3" },
  { id: "7", name: "John", role: "Developer", parentId: "2" },
    ]
    )
});
app.use("/api/user",userRoute)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});