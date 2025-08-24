const fileInput = document.getElementById('fileInput');
const chooseBtn = document.getElementById('chooseBtn');
const dropArea = document.getElementById('dropArea');
const fileList = document.getElementById('fileList');
const mergeBtn = document.getElementById('mergeBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
document.getElementById('year').textContent = new Date().getFullYear();

let files = [];

chooseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => addFiles([...e.target.files]));

// Drag & drop
['dragenter', 'dragover'].forEach(evt => {
  dropArea.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dropArea.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(evt => {
  dropArea.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dropArea.classList.remove('dragover');
  });
});
dropArea.addEventListener('drop', (e) => {
  addFiles([...e.dataTransfer.files]);
});

function addFiles(newFiles) {
  const pdfs = newFiles.filter(f => f.type === 'application/pdf');
  files = files.concat(pdfs);
  renderList();
}

function renderList() {
  fileList.innerHTML = '';
  files.forEach((f, idx) => {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.innerHTML = `
      <span>${idx+1}. ${f.name} <span class="badge">(${Math.round(f.size/1024)} KB)</span></span>
      <span class="file-actions">
        <button data-act="up" data-idx="${idx}">↑</button>
        <button data-act="down" data-idx="${idx}">↓</button>
        <button data-act="remove" data-idx="${idx}">✕</button>
      </span>
    `;
    fileList.appendChild(li);
  });
  mergeBtn.disabled = files.length < 2;
  clearBtn.disabled = files.length === 0;
}

fileList.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const act = btn.dataset.act;
  if (act === 'remove') {
    files.splice(idx, 1);
  } else if (act === 'up' && idx > 0) {
    [files[idx-1], files[idx]] = [files[idx], files[idx-1]];
  } else if (act === 'down' && idx < files.length - 1) {
    [files[idx+1], files[idx]] = [files[idx], files[idx+1]];
  }
  renderList();
});

clearBtn.addEventListener('click', () => {
  files = [];
  renderList();
  statusEl.textContent = '';
});

mergeBtn.addEventListener('click', async () => {
  try {
    statusEl.textContent = 'Merging... please wait';
    const form = new FormData();
    files.forEach(f => form.append('files', f));

    const res = await fetch('/api/merge', {
      method: 'POST',
      body: form
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Merge failed');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    statusEl.textContent = 'Done! Your merged PDF has downloaded.';
  } catch (e) {
    statusEl.textContent = 'Error: ' + e.message;
  }
});
