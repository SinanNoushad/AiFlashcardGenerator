// ImageUtils.ts
import getPixels from 'react-native-get-pixels';

export const imageToGrayscaleTensor = async (
  uri: string,
  width: number,
  height: number,
  options: { mean: number; std: number; normalize: boolean }
) => {
  const pixels = await new Promise<any>((resolve, reject) => {
    getPixels(uri, (err, pixelData) => {
      err ? reject(err) : resolve(pixelData);
    });
  });

  // Create target buffer
  const tensorData = new Float32Array(width * height);
  const ratioX = pixels.width / width;
  const ratioY = pixels.height / height;

  // Resize and convert to grayscale
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = Math.floor(x * ratioX);
      const srcY = Math.floor(y * ratioY);
      const idx = (srcY * pixels.width + srcX) * 4;
      
      const r = pixels.data[idx];
      const g = pixels.data[idx + 1];
      const b = pixels.data[idx + 2];
      
      // Luminosity method for grayscale
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      
      // Normalization
      tensorData[y * width + x] = options.normalize
        ? (gray / 255 - options.mean) / options.std
        : gray;
    }
  }

  return {
    data: Array.from(tensorData),
    shape: [1, height, width],
    dtype: 'float32',
  };
};