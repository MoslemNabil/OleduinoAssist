import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { applyThreshold } from '../utils/imageUtils';

export const extractFramesFromFile = async (file) => {
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        const ctx = canvas.getContext('2d');
        const newFrames = [];

        const maxDuration = Math.min(video.duration, 3);
        const extractionFps = 10;
        const totalFrames = Math.floor(maxDuration * extractionFps);

        for (let i = 0; i <= totalFrames; i++) {
          video.currentTime = i / extractionFps;
          await new Promise(r => {
            const onSeeked = () => { video.removeEventListener('seeked', onSeeked); r(); };
            video.addEventListener('seeked', onSeeked);
          });

          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

          const scale = Math.min(CANVAS_WIDTH / video.videoWidth, CANVAS_HEIGHT / video.videoHeight);
          const x = (CANVAS_WIDTH / 2) - (video.videoWidth / 2) * scale;
          const y = (CANVAS_HEIGHT / 2) - (video.videoHeight / 2) * scale;

          ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
          applyThreshold(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

          newFrames.push(canvas.toDataURL('image/png'));
        }
        resolve(newFrames);
      };
      video.onerror = () => reject(new Error("Video load failed"));
      video.load();
    });
  } else {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const scale = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
        const x = (CANVAS_WIDTH / 2) - (img.width / 2) * scale;
        const y = (CANVAS_HEIGHT / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        applyThreshold(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

        resolve([canvas.toDataURL('image/png')]);
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = URL.createObjectURL(file);
    });
  }
};
