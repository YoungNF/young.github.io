// HOW TO USE:

// 1. Install two libraries
// `npm install node-fetch --save-dev @figma/rest-api-spec`
// 2. Define FILE_KEY & FIGMA_API_TOKEN
// 3. Run the following in the bash:
// ```
// node fetchFigmaData.js
// ```


import { writeFileSync } from 'fs';

// If using Node.js < 18, uncomment the following line:
// import fetch from 'node-fetch';

// Replace with your Figma file key and personal access token
const FILE_KEY = 'FILE_KEY';
const FIGMA_API_TOKEN = 'FIGMA_API_TOKEN';
const FIGMA_API_URL = `https://api.figma.com/v1/files/${FILE_KEY}`;
import path from 'path';
import { fileURLToPath } from 'url';

(async () => {
  try {
    // Fetch Figma file data
    const response = await fetch(FIGMA_API_URL, {
      method: 'GET',
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN,
      },
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Parse the response JSON
    const figmaData = await response.json();
    // Ensure data is not undefined
    if (!figmaData) {
      throw new Error('No data received from Figma API.');
    }

    // Extract the target page
    const TARGET_PAGE_NAME = 'ReadyToDeliver'; // Replace with the name of your desired page
    const pages = figmaData.document.children;
    const targetPage = pages.find((page) => page.name === TARGET_PAGE_NAME);
    if (!targetPage) {
      throw new Error(`Page "${TARGET_PAGE_NAME}" not found.`);
    }

    // Find the target frame    
    const TARGET_FRAME_NAME = 'Profile - Main';
    const frames = targetPage.children.filter((child) => child.type === 'FRAME');
    const targetFrame = frames.find((frame) => frame.name === TARGET_FRAME_NAME);

    if (!targetFrame) {
      throw new Error(`Frame "${TARGET_FRAME_NAME}" not found on page "${TARGET_PAGE_NAME}".`);
    }


    // Parse the JSON response
    // Get the directory name of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Combine the current directory with "figmaData.json"
    const filenameToMake = path.join(__dirname, "figmaData", `${TARGET_PAGE_NAME}_${TARGET_FRAME_NAME}.json`);

    writeFileSync(filenameToMake, JSON.stringify(targetFrame, null, 2), 'utf8');
    console.log('Figma data exported successfully to figmaData.json');
  } catch (error) {
    console.error('Error fetching Figma data:', error.message);
  }
})();
