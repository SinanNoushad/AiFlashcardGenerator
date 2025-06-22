import ExecutorchModule from 'react-native-executorch';
import RNFS from 'react-native-fs';
import Jimp from 'jimp';

export class OCRService {
  static model = null;
  static CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ ';

  static async loadModel() {
    if (this.model) return this.model;
    try {
      // Use relative path for Android assets or iOS main bundle
       const modelPath = RNFS.DocumentDirectoryPath + '/ocr_model.pte';
      this.model = await ExecutorchModule.loadModel(modelPath);
      return this.model;
    } catch (error) {
      console.error('Failed to load OCR model:', error);
      throw error;
    }
  }

  static async preprocessImage(imageUrl) {
    try {
      const targetWidth = 128;
      const targetHeight = 32;
      
      // Read image file
      const imageData = await RNFS.readFile(imageUrl, 'base64');
      const buffer = Buffer.from(imageData, 'base64');
      
      // Process with Jimp
      const image = await Jimp.read(buffer);
      image
        .resize(targetWidth, targetHeight)
        .greyscale()
        .normalize();
      
      // Get pixel data
      const pixelData = new Float32Array(targetWidth * targetHeight);
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const gray = image.bitmap.data[idx];
        const normalized = (gray / 255 - 0.5) / 0.5; // Normalize to [-1, 1]
        pixelData[y * targetWidth + x] = normalized;
      });

      return {
        data: Array.from(pixelData),
        shape: [1, targetHeight, targetWidth], // CHW format
        dtype: 'float32',
      };
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw error;
    }
  }

  static async postprocessOutput(modelOutput) {
    try {
      const outputTensor = modelOutput[0];
      const [_, seqLength, numClasses] = outputTensor.shape;
      const data = outputTensor.data;
      
      let decodedText = '';
      let lastCharIdx = -1;

      for (let t = 0; t < seqLength; t++) {
        let maxProb = -Infinity;
        let charIdx = -1;
        
        const offset = t * numClasses;
        for (let c = 0; c < numClasses; c++) {
          if (data[offset + c] > maxProb) {
            maxProb = data[offset + c];
            charIdx = c;
          }
        }

        // CTC decoding rules
        if (charIdx > 0 && charIdx !== lastCharIdx) {
          decodedText += this.CHARACTERS[charIdx - 1];
          lastCharIdx = charIdx;
        } else if (charIdx === 0) {
          lastCharIdx = -1;
        }
      }

      return decodedText.trim();
    } catch (error) {
      console.error('Output processing failed:', error);
      throw error;
    }
  }

  static async extractTextFromImage(imageUrl) {
    try {
      const model = await this.loadModel();
      const inputTensor = await this.preprocessImage(imageUrl);
      const output = await ExecutorchModule.runModel(model, [inputTensor]);
      const text = await this.postprocessOutput(output);

      if (!text) throw new Error('No text recognized');
      return text;
    } catch (error) {
      console.error('OCR Processing Error:', error);
      throw new Error('Text extraction failed');
    }
  }
}