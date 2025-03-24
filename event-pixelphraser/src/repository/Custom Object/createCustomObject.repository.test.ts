// tests/repository/Custom Object/createCustomObject.repository.test.ts
import { createProductCustomObject } from '../Custom Object/createCustomObject.repository';

// Mock the entire client module
jest.mock('../../client/create.client', () => ({
  createApiRoot: jest.fn()
}));

// Mock the logger
jest.mock('../../utils/logger.utils', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Mock the config utils
jest.mock('../../utils/config.utils', () => ({
  readConfiguration: jest.fn().mockReturnValue({
    projectKey: 'test-project',
    clientId: 'test-client',
    clientSecret: 'test-secret',
    scope: 'test-scope',
    apiUrl: 'https://test-api.com'
  })
}));

describe('Create Custom Object Repository', () => {
  const mockProductId = 'test-id';
  const mockImageUrl = 'https://test-image.jpg';
  const mockProductName = 'Test Product';
  const mockExecute = jest.fn();
  const mockPost = jest.fn(() => ({ execute: mockExecute }));
  const mockCustomObjects = jest.fn(() => ({ post: mockPost }));

  beforeEach(() => {
    const { createApiRoot } = require('../../client/create.client');
    (createApiRoot as jest.Mock).mockReturnValue({
      customObjects: mockCustomObjects
    });
    mockExecute.mockClear();
    mockPost.mockClear();
    mockCustomObjects.mockClear();
  });

  it('should create custom object successfully', async () => {
    const mockCustomObject = {
      id: 'custom-object-id',
      version: 1
    };

    mockExecute.mockResolvedValueOnce(mockCustomObject);

    const result = await createProductCustomObject(mockProductId, mockImageUrl, mockProductName);

    expect(result).toEqual(mockCustomObject);
    expect(mockCustomObjects).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledWith({
      body: {
        container: "temporaryDescription",
        key: mockProductId,
        value: {
          temporaryDescription: null,
          imageUrl: mockImageUrl,
          productName: mockProductName
        }
      }
    });
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    mockExecute.mockRejectedValueOnce(error);

    await expect(createProductCustomObject(mockProductId, mockImageUrl, mockProductName))
      .rejects.toThrow('API Error');
  });
});
