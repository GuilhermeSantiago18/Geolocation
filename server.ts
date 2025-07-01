const express = require('express')
const {connectDB} = require('./src/config/database')

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on ${PORT}`);
});
