const app = require('./src/config/express/custom-express')

app.listen(3000, () => {
    console.log('\nSERVER: [Ouvindo porta 3000]')
    console.log('--------------------------------------')
})