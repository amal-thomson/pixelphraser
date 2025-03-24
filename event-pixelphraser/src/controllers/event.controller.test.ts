// tests/controllers/event.controller.test.ts
import { Request, Response } from 'express';
import { post } from './event.controller';
import { productAnalysis } from '../services/Vision AI/productAnalysis.service';
import { generateProductDescription } from '../services/Generative AI/descriptionGeneration.service';
import { createProductCustomObject } from '../repository/Custom Object/createCustomObject.repository';
import { updateCustomObjectWithDescription } from '../repository/Custom Object/updateCustomObjectWithDescription';

jest.mock('../../src/services/Vision AI/productAnalysis.service');
jest.mock('../../src/services/Generative AI/descriptionGeneration.service');
jest.mock('../../src/repository/Custom Object/createCustomObject.repository');
jest.mock('../../src/repository/Custom Object/updateCustomObjectWithDescription');

// Mock the config utilities to return hard-coded values instead of real environment variables
jest.mock('../../src/utils/config.utils.ts', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        CTP_CLIENT_ID: "XXXXXXXXXXXXXXXXXXXXXXXX",
        CTP_CLIENT_SECRET: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        CTP_PROJECT_KEY: "test-scope",
        CTP_SCOPE: "manage_project:test-scope",
        CTP_REGION: "europe-west1.gcp"
    })
}));

jest.mock('../../src/config/ai.config.ts', () => ({
    BASE64_ENCODED_GCP_SERVICE_ACCOUNT: 'XXXXXXXXXX',
    GENERATIVE_AI_API_KEY: 'XXXXXXXXXX',
    GEMINI_MODEL: 'XXXXXXXXXX',
    visionClient: {
        annotateImage: jest.fn().mockResolvedValue([
            {
                labelAnnotations: [{ description: 'label1' }, { description: 'label2' }],
                localizedObjectAnnotations: [{ name: 'object1' }, { name: 'object2' }],
                imagePropertiesAnnotation: {
                    dominantColors: {
                        colors: [
                            { color: { red: 255, green: 255, blue: 255 } },
                            { color: { red: 0, green: 0, blue: 0 } },
                            { color: { red: 128, green: 128, blue: 128 } }
                        ]
                    }
                },
                textAnnotations: [{ description: 'detected text' }],
                webDetection: {
                    webEntities: [{ description: 'entity1' }, { description: 'entity2' }]
                }
            }
        ])
    },
    genAI: {
        getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn().mockResolvedValue({
                response: {
                    text: () => 'generated description'
                }
            })
        })
    },
    model: {
        generateContent: jest.fn().mockResolvedValue({
            response: {
                text: () => 'generated description'
            }
        })
    }
}));

describe('Event Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const responseJson = jest.fn();

  beforeEach(() => {
    mockRequest = {
      body: {
        message: {
          data: Buffer.from(JSON.stringify({
            resource: { typeId: 'product' },
            productProjection: {
              id: 'test-id',
              masterVariant: {
                images: [{ url: 'https://test-image.jpg' }],
                attributes: [{ name: 'generateDescription', value: true }]
              },
              name: { en: 'Test Product' }
            }
          })).toString('base64')
        }
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process valid product event successfully', async () => {
    const mockImageData = {
      labels: 'test label',
      objects: 'test object',
      colors: ['red', 'blue'],
      detectedText: 'test text',
      webEntities: 'test entity'
    };
    const mockDescription = 'Test description';

    (productAnalysis as jest.Mock).mockResolvedValue(mockImageData);
    (generateProductDescription as jest.Mock).mockResolvedValue(mockDescription);
    (createProductCustomObject as jest.Mock).mockResolvedValue({});
    (updateCustomObjectWithDescription as jest.Mock).mockResolvedValue({});

    await post(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({
      productId: 'test-id',
      productName: 'Test Product',
      imageUrl: 'https://test-image.jpg',
      description: mockDescription,
      productAnalysis: mockImageData
    });
  });

  it('should handle missing pub/sub data', async () => {
    mockRequest.body.message.data = undefined;

    await post(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      error: '❌ No data found in Pub/Sub message.'
    });
  });

  it('should handle disabled description generation', async () => {
    mockRequest.body.message.data = Buffer.from(JSON.stringify({
      resource: { typeId: 'product' },
      productProjection: {
        id: 'test-id',
        masterVariant: {
          images: [{ url: 'https://test-image.jpg' }],
          attributes: [{ name: 'generateDescription', value: false }]
        },
        name: { en: 'Test Product' }
      }
    })).toString('base64');

    await post(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: '❌ The option for automatic description generation is not enabled.',
      productId: 'test-id',
      imageUrl: 'https://test-image.jpg',
      productName: 'Test Product'
    });
  });
});
