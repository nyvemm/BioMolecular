function postData() {
    let warnings = document.getElementById('warnings')
    const formData = new FormData(document.getElementById('formulario'))

    const xhr = new XMLHttpRequest()
    xhr.open('PUT', '/exame', true)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            let innerHTML = ''

            if (response.status == 'error') {
                if ('message' in response) {
                    for (let i = 0; i < response.message.length; i++) {
                        innerHTML += warningMessage(response.message[i].msg, 'danger')
                    }
                } else {
                    innerHTML += warningMessage('Erro interno.', 'danger')
                }

            } else if (response.status == 'success') {
                innerHTML += warningMessage('O exame foi editado com sucesso.', 'success')
            }

            warnings.innerHTML = innerHTML

        } else {
            warnings.innerHTML = warningMessage('Falha ao editar usuário.', 'danger')
        }
    }
    xhr.send(new URLSearchParams(formData))
}

function deleteData() {
    let id = $('#idexame').val()

    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `/exame?id=${id}`, true)

    xhr.onload = (e) => {
        if (xhr.status == 200) {
            window.location.href = '/exames'
        }
    }

    xhr.send()
}

$(document).ready(() => {
    $('#menu-link-exames').addClass('active')
    document.getElementById('submeter').onclick = (e) => {
        e.preventDefault()
        postData()
    }

    document.getElementById('excluir').onclick = (e) => {
        e.preventDefault()
        deleteData()
    }
})