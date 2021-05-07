const urlParams = new URLSearchParams(window.location.search);
const papel = urlParams.get('papel');

/* Background-image */
if (papel !== 'on') {
  const page = $('page');
  page.css('background-image', 'none');
}

/* Observações */
$('input[type=hidden]').each((index, elem) => {
  const HTMLElement = elem;
  const body = HTMLElement.parentNode.parentNode;
  if (index === 0) {
    $(body).append(`<tr>
                    <td><b><br>Observação</b></td>
                </tr>`);
  }

  /* Observação do Exame ou do resultado */
  if ($(HTMLElement).data('valor') === 'resultado') {
    HTMLElement.parentNode.children[1].innerHTML += `<sup style="vertical-align: super;font-size: xx-small;
        ">${index + 1}</sup>`;
  } else {
    HTMLElement.parentNode.firstElementChild.innerHTML += `<sup style="vertical-align: super;font-size: xx-small;
    ">${index + 1}</sup>`;
  }

  $(body).append(`<tr style="display: block;"><td><p> <sub style="vertical-align: super;font-size: xx-small;
    ">${index + 1}</sub> ${HTMLElement.value} </p></td><tr>`);
});
