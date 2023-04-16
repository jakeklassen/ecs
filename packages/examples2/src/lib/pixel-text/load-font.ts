import { XMLParser } from 'fast-xml-parser';
import { loadImage } from '../asset-loader.js';

interface IXmlData {
  '?xml': {
    version: string;
    encoding: string;
  };
  Font: {
    family: string;
    height: string;
    size: string;
    style: string;
    Char: Array<{
      width: string;
      offset: string;
      rect: string;
      code: string;
    }>;
  };
}

export async function loadFont(imgUrl: string, xmlUrl: string) {
  const parser = new XMLParser({
    // Get rid of that default @_ prefix
    attributeNamePrefix: '',
    ignoreAttributes: false,
    trimValues: false,
  });

  const image = await loadImage(imgUrl);
  const xmlString = await fetch(xmlUrl).then((response) => response.text());

  const xmlObject: IXmlData = parser.parse(xmlString);

  //  Error handling at some point

  const characters = xmlObject.Font.Char.reduce((obj, item) => {
    const code = item.code;

    const width = parseInt(item.width, 10);
    const rect = item.rect.split(' ').map((i) => parseInt(i, 10));

    const offset = item.offset.split(' ').map((i) => parseInt(i, 10));

    return {
      ...obj,
      [code]: {
        code,
        // x,
        // y,
        width,
        // height,
        offset,
        // offsetX,
        // offsetY,
        rect,
      },
    };
  }, {} as Record<string, { code: string; offset: number[]; rect: number[]; width: number }>);

  // console.log(xmlObject);

  const fontData = {
    characters,
    family: xmlObject.Font.family,
    height: parseInt(xmlObject.Font.height, 10),
    image,
    size: parseInt(xmlObject.Font.size, 10),
    style: xmlObject.Font.style,
  };

  // console.log(fontData);

  return fontData;
}
