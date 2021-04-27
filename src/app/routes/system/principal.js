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


async function getProximasAmostras() {
    let amostras = await database('amostra').whereIn('status_pedido', ['Não avaliado', 'Parcialmente avaliado'])
        .innerJoin('solicitante', 'solicitante.idSolicitante', 'amostra.idSolicitante')
        .orderBy('amostra.cadastrado_em', 'desc').limit(5).select()

    amostras.map(x => x.em_analise = x.status_pedido == 'Parcialmente avaliado' ? true : false)
    amostras.map(x => x.f_cadastrado_em = dateUtils.viewDateFormat(x.cadastrado_em))
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
            getProximasAmostras().then(amostras => {
                res.render('main/', {
                    contador: dataContador,
                    amostras: amostras
                })
            })
        })
    })
}