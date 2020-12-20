function deleteData(id) {
    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/exame?id=${id}`, true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.response)
            if ('success' ==  response.status) {
                window.location.href = '/exames'
            } else {
                $('#warnings').html(`
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Há amostras associadas a esse exame.
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

$(document).ready(() => {
    $('#menu-link-exames').addClass('active')
})

