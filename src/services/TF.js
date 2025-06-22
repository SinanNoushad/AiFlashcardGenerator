import * as tf from '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'react-native-fs';
import { Buffer } from 'buffer';
import * as jpeg from 'jpeg-js';

export class OCRService {
  static model: tf.LayersModel | null = null;
  static CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ ';

  static async loadModel() {
    if (this.model) return this.model;
    await tf.ready();
    
    // Load model from app bundle
    const modelJson = require('./assets/model/model.json');
    const modelWeights = require('./assets/model/weights.bin');
    this.model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    return this.model;
  }

  static async preprocessImage(uri: string) {
    try {
      // Read image as base64
      const base64 = await FileSystem.readFile(uri, 'base64');
      const raw = Buffer.from(base64, 'base64');
      const image = jpeg.decode(raw, true);
      
      return tf.tidy(() => {
        // Convert to tensor
        const tensor = tf.browser.fromPixels({
          data: image.data,
          width: image.width,
          height: image.height
        }, 1);
        
        // Resize and normalize
        const resized = tf.image.resizeBilinear(tensor, [32, 128]);
        return resized.div(255).sub(0.5).div(0.5).expandDims(0);
      });
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
    }
  }

  static async extractTextFromImage(uri: string) {
    try {
      const model = await this.loadModel();
      const input = await this.preprocessImage(uri);
      const output = model.predict(input) as tf.Tensor;
      
      // Decode output
      const data = output.dataSync();
      const [seqLength, numClasses] = output.shape.slice(1);
      
      let text = '';
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
        
        if (charIdx > 0 && charIdx !== lastCharIdx) {
          text += this.CHARACTERS[charIdx - 1];
          lastCharIdx = charIdx;
        }
      }
      
      return text.trim();
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Text extraction failed');
    }
  }
}