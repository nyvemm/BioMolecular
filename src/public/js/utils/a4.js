const urlParams = new URLSearchParams(window.location.search);
const papel = urlParams.get('papel');

/* Background-image */
if (papel != 'on') {
    let page = $('page')
    page.css('background-image', 'none')
}

/* Observações */
$('input[type=hidden]').each((index, elem) => {
    let body = elem.parentNode.parentNode
    if (index == 0) {
        $(body).append(`<tr>
                    <td><b><br>Observação</b></td>
                </tr>`)
    }

    /* Observação do Exame ou do resultado */
    if ($(elem).data('valor') == 'resultado') {
        elem.parentNode.children[1].innerHTML += `<sup style="vertical-align: super;font-size: xx-small;
        ">${index + 1}</sup>`
    } else {
        elem.parentNode.firstElementChild.innerHTML += `<sup style="vertical-align: super;font-size: xx-small;
    ">${index + 1}</sup>`
    }


    $(body).append(`<tr style="display: block;"><td><p> <sub style="vertical-align: super;font-size: xx-small;
    ">${index + 1}</sub> ${elem.value} </p></td><tr>`)

})