$(document).ready(() => {
    $('.text-status').each((index, value) => {
        if ($(value).text() == 'Não avaliado')
            $(value).addClass('text-danger')
        else if ($(value).text() == 'Parcialmente avaliado')
            $(value).addClass('text-warning')
        else
            $(value).addClass('text-success')
    })

})

function deleteData(id) {
    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/amostra?id=${id}`, true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.response)
            console.log(response)
            if ('success' == response.status) {
                window.location.href = '/amostras'
            } else {
                $('#warnings').html(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Há amostras associadas a esse amostra.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>   
                `)
            }
        }
    }

    xhr.send()
}
