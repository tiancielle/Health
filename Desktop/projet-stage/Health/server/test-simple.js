const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Test ultra simple' });
});

app.listen(3000, () => {
  console.log('Test simple sur port 3000');
});