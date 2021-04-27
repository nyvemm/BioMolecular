const app = require('./src/config/express/custom-express')

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('\nSERVER: [Ouvindo porta 8000]')
    console.log('--------------------------------------')
})