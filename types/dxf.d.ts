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

// DXF parser and writer declarations moved to global.d.ts to avoid conflicts