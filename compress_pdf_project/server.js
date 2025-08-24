const express = require('express');
const fileUpload = require('express-fileupload');
const { PDFDocument } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(fileUpload());

app.post('/compress', async (req, res) => {
  if (!req.files || !req.files.pdf) return res.status(400).send('No file uploaded.');

  const pdfBuffer = req.files.pdf.data;

  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const compressedPdf = await PDFDocument.create();

    const pages = await compressedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => compressedPdf.addPage(page));

    const compressedBytes = await compressedPdf.save({ useObjectStreams: false });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.send(Buffer.from(compressedBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error compressing PDF');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));