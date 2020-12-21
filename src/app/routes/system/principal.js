const database = require("../../../config/database/connection")
const dateUtils = require("../../../utils/date")
const { loggedIn } = require("../../helpers/login")

async function getData() {
    let nPacientes = await database('paciente').select().count({ count: '*' })
    let nExames = await database('exame').select().count({ count: '*' })
    let nSolicitantes = await database('solicitante').select().count({ count: '*' })
    let nAmostras = await database('amostra').select().count({ count: '*' })
    let nAmostrasP = await database('amostra').select().where('status_pedido', 'Parcialmente avaliado').count({ count: '*' })
    let nAmostrasNA = await database('amostra').select().where('status_pedido', 'Não avaliado').count({ count: '*' })

    return {
        pacientes: nPacientes[0].count,
        exames: nExames[0].count,
        solicitantes: nSolicitantes[0].count,
        amostras: nAmostras[0].count,
        amostrasP: nAmostrasP[0].count,
        amostrasNA: nAmostrasNA[0].count
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

async function getProximasAmostras() {
    let amostras = await database('amostra').whereIn('status_pedido', ['Não avaliado', 'Parcialmente avaliado'])
    .innerJoin('solicitante', 'solicitante.idsolicitante', 'amostra.idsolicitante')
    .orderBy('amostra.cadastrado_em', 'desc').limit(5).select()

    amostras.map(x=>x.em_analise = x.status_pedido == 'Parcialmente avaliado' ? true : false)
    amostras.map(x=>x.f_cadastrado_em = dateUtils.viewDateFormat(x.cadastrado_em))
    return amostras
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
                getProximasAmostras().then(amostras => {
                    res.render('main/', {
                        contador: dataContador,
                        registros: dataRegs,
                        amostras: amostras
                    })
                })
            })
        })
    })
}