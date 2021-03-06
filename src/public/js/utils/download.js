function downloadString(text, fileType, fileName) {
  const blob = new Blob([text], { type: fileType });

  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => { URL.revokeObjectURL(a.href); }, 1500);
}

function downloadEvent() {
  const error = $('#error-log').val();
  downloadString(error, 'text-plain', `auditoria-${new Date().toJSON().replace('Z', '').replace('T', '-')}.txt`);
}

window.downloadString = downloadString;
window.downloadEvent = downloadEvent;
