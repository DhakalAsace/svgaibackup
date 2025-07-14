declare module 'dxf' {
  export interface DxfEntity {
    type: string;
    handle?: string;
    layer?: string;
    color?: number;
    [key: string]: any;
  }

  export interface DxfBlock {
    name: string;
    entities: DxfEntity[];
  }

  export interface DxfHeader {
    [key: string]: any;
  }

  export interface DxfParsedResult {
    header: DxfHeader;
    entities: DxfEntity[];
    blocks?: DxfBlock[];
  }

  export function parseString(dxfString: string): DxfParsedResult;
  export function denormalise(parsed: DxfParsedResult): any;
  export function toSVG(parsed: DxfParsedResult): string;
  export function toPolylines(parsed: DxfParsedResult): any[];
}

declare module 'dxf-parser' {
  export default class DxfParser {
    parseSync(dxfString: string): any;
  }
}

declare module 'dxf-writer' {
  export default class DxfWriter {
    setUnits(units: string): void;
    addLayer(name: string, color: number, lineType?: string): void;
    addLine(x1: number, y1: number, x2: number, y2: number, layer?: string): void;
    addCircle(x: number, y: number, radius: number, layer?: string): void;
    addArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, layer?: string): void;
    addPolyline(points: Array<[number, number]>, layer?: string): void;
    addText(text: string, x: number, y: number, height: number, layer?: string): void;
    generateDxf(): string;
  }
}