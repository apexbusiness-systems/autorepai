import { describe, it, expect, mock } from 'bun:test';
import { parsePBS, parseVAuto } from '../../../src/lib/parsers/pbs-vauto';

describe('PBS Parser', () => {
  it('successfully parses data and logs activity', () => {
    const consoleSpy = mock(() => {});
    const originalLog = console.log;
    console.log = consoleSpy;

    try {
      const testData = { key: 'value', dealerId: '123' };
      const result = parsePBS(testData);

      expect(result).toEqual({
        success: true,
        data: testData,
      });
      expect(consoleSpy).toHaveBeenCalledWith('Parsing PBS data');
    } finally {
      console.log = originalLog;
    }
  });

  it('handles empty input data', () => {
    const result = parsePBS(null);
    expect(result).toEqual({
      success: true,
      data: null,
    });
  });
});

describe('vAuto Parser', () => {
  it('successfully parses data and logs activity', () => {
    const consoleSpy = mock(() => {});
    const originalLog = console.log;
    console.log = consoleSpy;

    try {
      const testData = { inventory: [] };
      const result = parseVAuto(testData);

      expect(result).toEqual({
        success: true,
        data: testData,
      });
      expect(consoleSpy).toHaveBeenCalledWith('Parsing vAuto data');
    } finally {
      console.log = originalLog;
    }
  });
});
