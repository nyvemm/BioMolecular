const app = require('./src/config/express/custom-express.js');

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.clear();
  console.log('SERVER: [Ouvindo porta 8000]');
  console.log('HOST: http://localhost:8000/');
  console.log('--------------------------------------');
});
