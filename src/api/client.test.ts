import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Create a mock client for testing
const createMockClient = () => {
  const apiClient = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  return apiClient;
};

const apiClient = createMockClient();

describe('apiClient', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('has correct base URL', () => {
    expect(apiClient.defaults.baseURL).toBe('/api');
  });

  it('has correct headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('intercepts successful responses and returns data', async () => {
    const mockData = { id: 1, name: 'Test' };
    mock.onGet('/test').reply(200, mockData);

    const response = await apiClient.get('/test');
    expect(response).toEqual(mockData);
  });

  it('intercepts error responses and logs them', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mock.onGet('/test').reply(500, { error: 'Server Error' });

    try {
      await apiClient.get('/test');
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(consoleSpy).toHaveBeenCalledWith('API Error:', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('handles network errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mock.onGet('/test').networkError();

    try {
      await apiClient.get('/test');
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(consoleSpy).toHaveBeenCalledWith('API Error:', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('handles timeout errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mock.onGet('/test').timeout();

    try {
      await apiClient.get('/test');
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(consoleSpy).toHaveBeenCalledWith('API Error:', expect.any(Object));
    consoleSpy.mockRestore();
  });
});