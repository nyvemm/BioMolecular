const database = require("../../../config/database/connection")
const { loggedIn } = require("../../helpers/login")

async function getData() {
    let nPacientes = await database('paciente').select().count({ count: '*' })
    let nExames = await database('exame').select().count({ count: '*' })
    let nSolicitantes = await database('solicitante').select().count({ count: '*' })

    return {
        pacientes: nPacientes[0].count,
        exames: nExames[0].count,
        solicitantes: nSolicitantes[0].count,
    }
}

async function getReg() {
    let regs = await database('registro').select().orderBy('alterado_em', 'desc').limit(6)

    regs.forEach((reg) => {
        //Formatação de data
        let data = new Date(reg.alterado_em)
        let fdata = data.getDate().toString().padStart(2, '0') + '/' + (data.getMonth() + 1).toString().padStart(2, '0') + '/' + data.getFullYear() + ' ' + data.getHours().toString().padStart(2, '0') + ':' + data.getMinutes().toString().padStart(2, '0') + ':' + data.getSeconds().toString().padStart(2, '0')

        if (reg.op == 'INSERT')
            reg.op = 'Inserção'
        else if (reg.op == 'UPDATE')
            reg.op = 'Alteração'
        else
            reg.op = 'Remoção'

        reg.alterado_em = fdata
    })

    return regs
}

module.exports = (app) => {
    app.get('/', (req, res) => {
        if (req.user) res.redirect('/dashboard')
        else res.redirect('/login')
    })

    //Tela principal
    app.get('/dashboard', loggedIn, (req, res) => {
        getData().then((dataContador) => {
            getReg().then((dataRegs) => {
                res.render('main/', {
                    contador: dataContador,
                    registros: dataRegs
                })
            })
        })
    })
}