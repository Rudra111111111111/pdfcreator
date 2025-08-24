document.getElementById('compressForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const fileInput = document.getElementById('pdfFile');
  if (!fileInput.files.length) return alert('Please select a PDF file.');

  const formData = new FormData();
  formData.append('pdf', fileInput.files[0]);

  const response = await fetch('/compress', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) return alert('Compression failed.');

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const downloadDiv = document.getElementById('downloadLink');
  downloadDiv.innerHTML = `<a href="${url}" download="compressed.pdf">Download Compressed PDF</a>`;
});