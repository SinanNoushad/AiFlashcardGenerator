export class OCRService {
  static async extractTextFromImage(imageUri) {
    try {
      // Convert image to base64
      const base64Image = await this.convertImageToBase64(imageUri);
      
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 1,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      
      if (data.responses && data.responses[0].textAnnotations) {
        return data.responses[0].textAnnotations[0].description;
      }
      
      throw new Error('No text found in image');
    } catch (error) {
      console.error('Google Vision API Error:', error);
      throw error;
    }
  }

  static async convertImageToBase64(imageUri) {
    // Implementation depends on your base64 conversion method
    // You might use react-native-fs or similar library
    return base64String;
  }
}