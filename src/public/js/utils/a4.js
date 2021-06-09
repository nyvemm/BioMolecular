function addSpacePage(content, brSpace, maxHeight = 1000) {
  const children = content.children();
  const pushNext = [];
  let currentHeight = 0;

  Array.from(children).forEach((element, index) => {
    if (element.tagName === 'BR') {
      currentHeight += brSpace;
    } else {
      currentHeight += element.clientHeight;
    }

    if (currentHeight > maxHeight) {
      pushNext.push(element);
      $(element).remove();
    }
  });

  // Se tiver elementos para adicionar na outra página
  if (pushNext.length) {
    const newSection = $('<section class="sheet padding-10mm"></section>');
    newSection.append('<div class="content">');
    const newContent = $(newSection.children()[0]);

    newContent.append('<br><br><br><br><br><br><br>');
    pushNext.forEach((element) => {
      newContent.append(element);
    });

    $('.A4').append(newSection);
    addSpacePage(newContent, brSpace);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const papel = urlParams.get('papel');

/* Background-image */
if (papel !== 'on') {
  const sheet = $('sheet');
  sheet.css('background-image', 'none');
}

/* Observações */
$('input[type=hidden]').each((index, elem) => {
  const HTMLElement = elem;
  const body = HTMLElement.parentNode.parentNode;

  if (!body.innerHTML.includes('Observações:')) {
    $(body).append(`<tr>
                    <td><b><br>Observações:</b></td>
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

  $(body)
    .append(`<tr style="display: block;"><td><p> <sub style="vertical-align: super;font-size: xx-small;
    ">${index + 1}</sub> ${HTMLElement.value} </p></td><tr>`);
});

$(document).ready(() => {
  const content = $('.content');
  const brSpace = 14.6;

  // //Apaga a coluna de referência da análise molecular.
  // const tabelaMolecular = $('.Análise.Molecular table')[0];
  // const tabelaMolecularTr = tabelaMolecular.children[0].children[0];
  // //Remove a coluna
  // $(tabelaMolecularTr.children[3]).remove();
  // $(tabelaMolecularTr).css('grid-template-columns', '45% 25% 30%');

  // //Percorre os elementos
  // const rows = tabelaMolecular.children[1];
  // Array.from(rows.children).forEach((row, index) => {
  //   $(row.children[3]).remove();
  //   $(row).css('grid-template-columns', '45% 25% 30%');
  //   index !== rows.children.length - 1
  //     ? $(row).css('border-bottom', '1px solid black')
  //     : '';
  // });

  addSpacePage(content, brSpace, 1000);
});
