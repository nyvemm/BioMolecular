// eslint-disable-next-line import/extensions
import app from './src/config/express/custom-express.js';

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  // console.log('\nSERVER: [Ouvindo porta 8000]');
  // console.log('--------------------------------------');
});
