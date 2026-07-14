import { RoomState, FRAME_BG_PRESETS } from './types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image failed to load'));
    image.src = src;
  });
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to export image'));
    }, type, quality);
  });
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export async function downloadJpeg(dataUrl: string, fileName: string) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
  saveBlob(blob, fileName);
}

export async function downloadPoster(dataUrl: string, fileName: string, width: number, height: number, frameBg?: RoomState['frameBg']) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (frameBg) {
    const preset = FRAME_BG_PRESETS.find(p => p.val === frameBg.val && p.type === frameBg.type);
    if (preset) {
      if (preset.type === 'solid') {
        ctx.fillStyle = preset.val;
      } else if (preset.type === 'gradient') {
        const colors = preset.val.split(',');
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
      } else if (preset.type === 'pattern') {
        // Fallback for pattern in poster export
        ctx.fillStyle = '#ffffff'; 
      }
    } else {
      ctx.fillStyle = '#ffffff';
    }
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#101116');
    gradient.addColorStop(1, '#2b2d35');
    ctx.fillStyle = gradient;
  }
  ctx.fillRect(0, 0, width, height);

  const padding = Math.round(Math.min(width, height) * 0.08);
  const maxW = width - padding * 2;
  const maxH = height - padding * 2;
  const imageW = image.naturalWidth || image.width;
  const imageH = image.naturalHeight || image.height;
  const scale = Math.min(maxW / imageW, maxH / imageH);
  const drawW = imageW * scale;
  const drawH = imageH * scale;
  const x = (width - drawW) / 2;
  const y = (height - drawH) / 2;

  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 18;
  ctx.drawImage(image, x, y, drawW, drawH);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const blob = await canvasToBlob(canvas, 'image/png');
  saveBlob(blob, fileName);
}

export function printImage(dataUrl: string, title: string) {
  const blob = dataUrlToBlob(dataUrl);
  const blobUrl = URL.createObjectURL(blob);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    saveBlob(blob, `${title}.png`);
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fff; }
          img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          @media print {
            body { min-height: auto; }
            img { width: 100%; height: auto; page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
      </body>
    </html>
  `);
  printWindow.document.close();
  
  const img = printWindow.document.createElement('img');
  img.src = blobUrl;
  img.alt = title;
  
  const doPrint = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500); // give the browser extra time to decode the image
  };
  
  img.onload = doPrint;
  printWindow.document.body.appendChild(img);
  
  printWindow.onafterprint = () => {
    printWindow.close();
    URL.revokeObjectURL(blobUrl);
  };
  
  // Fallback for iOS/mobile if onafterprint doesn't fire
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 60000);
}
