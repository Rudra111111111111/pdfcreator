/**
 * PDF Merge Tool - Express server
 * - Serves static frontend from /public
 * - POST /api/merge accepts multiple PDFs and responds with a merged PDF
 */
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Memory storage for small/medium files; tune limits as needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB per file
    files: 20                   // up to 20 PDFs
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/merge', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files.' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      if (!file.mimetype || !file.mimetype.includes('pdf')) {
        return res.status(400).json({ error: 'All files must be PDFs.' });
      }
      const srcPdf = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
      copiedPages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();

    // Set download headers
    const filename = `merged_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(mergedBytes));
  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).json({ error: 'Failed to merge PDFs. Try smaller files or fewer at a time.' });
  }
});

// Fallback to index.html for root
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF Merge running on http://localhost:${PORT}`);
});
