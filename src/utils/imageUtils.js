import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

export const applyThreshold = (ctx, w, h) => {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const brightness = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    const color = brightness > 127 ? 255 : 0;
    data[i] = data[i+1] = data[i+2] = color;
    data[i+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
};

export const canvasToXBMP = (canvas) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
  const bytes = new Uint8Array(1024);

  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      const idx = (y * CANVAS_WIDTH + x) * 4;
      const isDrawn = imgData[idx] > 127 || imgData[idx + 1] > 127 || imgData[idx + 2] > 127;

      if (isDrawn) {
        const byteIdx = Math.floor((y * CANVAS_WIDTH + x) / 8);
        const bitIdx = x % 8;
        bytes[byteIdx] |= (1 << bitIdx);
      }
    }
  }
  return bytes;
};

export const bytesToHexArray = (bytes) => {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += `0x${bytes[i].toString(16).padStart(2, '0')}, `;
    if ((i + 1) % 16 === 0) result += '\n  ';
  }
  return result.trim();
};

export const processFramesToHex = async (frames) => {
  const hiddenCanvas = document.createElement('canvas');
  hiddenCanvas.width = CANVAS_WIDTH;
  hiddenCanvas.height = CANVAS_HEIGHT;
  const hCtx = hiddenCanvas.getContext('2d');

  let framesData = [];
  for (let i = 0; i < frames.length; i++) {
    hCtx.fillStyle = 'black';
    hCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (frames[i]) {
      const img = new Image();
      img.src = frames[i];
      await new Promise(r => img.onload = r);
      hCtx.drawImage(img, 0, 0);
    }
    const bytes = canvasToXBMP(hiddenCanvas);
    framesData.push(bytesToHexArray(bytes));
  }
  return framesData;
};
