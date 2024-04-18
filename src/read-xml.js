import { promises as fs } from 'fs';
import path from 'path';
import xml2js from 'xml2js';

const parser = new xml2js.Parser();

async function parseALTO(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const result = await parser.parseStringPromise(data);

    return processALTOData(result);
  } catch (err) {
    console.error("Error processing the file:", err);
    throw err;
  }
}

function processALTOData(data) {
  let allText = '';
  const printSpaces = data.alto.Layout[0].Page[0].PrintSpace;

  if (!printSpaces) {
    return null;
  }

  if (printSpaces) {
    const textBlocks = printSpaces[0].TextBlock;

    textBlocks.forEach((block) => {
      block.TextLine.forEach((line) => {
        line.String.forEach((stringItem) => {
          allText += stringItem.$.CONTENT + ' ';  // Assuming CONTENT holds the text
        });

        allText += '\n';  // New line after each text line
      });
    });
  }

  return allText.trim();  // Remove any leading/trailing whitespace
}

try {
  const extractedText = await parseALTO(path.resolve('src/ALTO/test.xml'));
  console.log(extractedText);
} catch (err) {
  console.error("Failed to extract text:", err);
}
