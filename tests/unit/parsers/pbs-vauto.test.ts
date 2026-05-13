import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parsePBS, parseVAuto } from '../../../src/lib/parsers/pbs-vauto';

describe('PBS Parser', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully parses data and logs activity', () => {
    const testData = { key: 'value', dealerId: '123' };
    const result = parsePBS(testData);

    expect(result).toEqual({
      success: true,
      data: testData,
    });
    expect(console.log).toHaveBeenCalledWith('Parsing PBS data');
  });

  it('handles empty input data', () => {
    const result = parsePBS(null);
    expect(result).toEqual({
      success: true,
      data: null,
    });
    expect(console.log).toHaveBeenCalledWith('Parsing PBS data');
  });
});

describe('vAuto Parser', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully parses data and logs activity', () => {
    const testData = { inventory: [] };
    const result = parseVAuto(testData);

    expect(result).toEqual({
      success: true,
      data: testData,
    });
    expect(console.log).toHaveBeenCalledWith('Parsing vAuto data');
  });
});
