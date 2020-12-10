$(document).ready(() => {

    $('.text-status').each((index, value) => {
        if ($(value).text() == 'Não avaliado')
            $(value).addClass('text-danger')
        else if ($(value).text() == 'Parcialmente avaliado')
            $(value).addClass('text-warning')
        else
            $(value).addClass('text-success')
    })


    $('#menu-link-amostras').addClass('active')
    document.getElementById('submeter').onclick = (e) => {
        e.preventDefault()
        postData()
    }

    document.getElementById('excluir').onclick = (e) => {
        e.preventDefault()
        deleteData()
    }
})