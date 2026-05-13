export interface ParserResult {
  success: boolean;
  data: unknown;
}

export const parsePBS = (data: unknown): ParserResult => {
  // Mock PBS parser
  console.log('Parsing PBS data');
  return { success: true, data };
};

export const parseVAuto = (data: unknown): ParserResult => {
  // Mock vAuto parser
  console.log('Parsing vAuto data');
  return { success: true, data };
};
