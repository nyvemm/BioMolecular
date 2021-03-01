const app = require('./src/config/express/custom-express')

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('\nSERVER: [Ouvindo porta 3000]')
    console.log('--------------------------------------')
})