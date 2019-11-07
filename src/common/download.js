export const download = (res, fileName) => {
  const content = res;
  // const blob = new global.Blob([content.data], {
  //   type: 'application/vnd.ms-excel',
  // });
  const blob = content.data;
  if ('download' in global.document.createElement('a')) {
    const elink = global.document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.target = '_blank';
    elink.href = global.URL.createObjectURL(blob);
    global.document.body.appendChild(elink);
    elink.click();
    global.URL.revokeObjectURL(elink.href);
    global.document.body.removeChild(elink);
  }
};