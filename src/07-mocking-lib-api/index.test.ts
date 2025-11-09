import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const testRoute = '/test';
  let client: { get: jest.Mock };

  beforeEach(() => {
    jest.useFakeTimers();

    client = {
      get: jest.fn().mockResolvedValue({ data: { value: 'some-value' } }),
    };
    mockedAxios.create.mockReturnValue(client as unknown as AxiosInstance);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(testRoute);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    jest.advanceTimersByTime(THROTTLE_TIME);

    await throttledGetDataFromApi(testRoute);

    expect(client.get).toHaveBeenCalledWith(testRoute);
  });

  test('should return response data', async () => {
    jest.advanceTimersByTime(THROTTLE_TIME);

    const result = await throttledGetDataFromApi(testRoute);

    expect(result).toEqual({ value: 'some-value' });
  });
});
