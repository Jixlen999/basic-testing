import path from 'node:path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'node:fs';
import fsPromises from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: false });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(cb, 100);

    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, 100);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();

    doStuffByTimeout(cb, 100);

    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(cb, 100);

    expect(setIntervalSpy).toHaveBeenCalledWith(cb, 100);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();

    doStuffByInterval(cb, 100);

    jest.advanceTimersByTime(1000);

    expect(cb).toHaveBeenCalledTimes(10);
  });
});

describe('readFileAsynchronously', () => {
  const filename = 'test.txt';

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');

    await readFileAsynchronously(filename);
    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), filename);
  });

  test('should return null if file does not exist', async () => {
    const existsSync = jest.spyOn(fs, 'existsSync');

    existsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(filename);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const existsSync = jest.spyOn(fs, 'existsSync');
    const readFileSpy = jest.spyOn(fsPromises, 'readFile');
    const testText = 'Test';

    existsSync.mockReturnValue(true);
    readFileSpy.mockResolvedValue(testText);

    const result = await readFileAsynchronously(filename);

    expect(result).toBe(testText);
  });
});
