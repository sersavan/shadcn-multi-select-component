import { NextRequest } from "next/server";
import { POST } from "./route";
import { readFile } from "fs/promises";
import { join } from "path";

// Mock the external dependencies
jest.mock("fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn(),
}));

global.fetch = jest.fn();

describe("Chat API Route", () => {
  const mockJoin = join as jest.MockedFunction<typeof join>;
  const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock path.join to return predictable paths
    mockJoin.mockImplementation((...args) => args.join("/"));

    // Mock file reading to return sample content
    mockReadFile.mockResolvedValue("Sample knowledge base content");
  });

  beforeAll(() => {
    // Mock console.error to suppress error logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after tests
    jest.restoreAllMocks();
  });

  it("should return 400 if messages is not provided", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: "Invalid messages format",
    });
  });

  it("should return 400 if messages is not an array", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        messages: "not-an-array",
        systemPrompt: "test prompt",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({
      error: "Invalid messages format",
    });
  });

  it("should return 500 if Gemini API key is not set", async () => {
    // Temporarily unset the API key
    const originalApiKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          messages: [{ role: "user", content: "Hello" }],
          systemPrompt: "test prompt",
        }),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const result = await response.json();

      expect(response.status).toBe(500);
      expect(result).toEqual({
        error: "Failed to process chat request",
        details: "Gemini API key not found",
      });
    } finally {
      // Restore the original API key
      process.env.GEMINI_API_KEY = originalApiKey;
    }
  });

  it("should return 500 if Gemini API returns an error", async () => {
    // Set a mock API key
    process.env.GEMINI_API_KEY = "test-api-key";

    // Mock the fetch to return an error response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue("API Error"),
    } as unknown as Response);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: "user", content: "Hello" }],
        systemPrompt: "test prompt",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      error: "Failed to process chat request",
      details: "Gemini API error: 500",
    });
  });

  it("should return 500 if Gemini API returns no candidates", async () => {
    // Set a mock API key
    process.env.GEMINI_API_KEY = "test-api-key";

    // Mock the fetch to return a response with no candidates
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as Response);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: "user", content: "Hello" }],
        systemPrompt: "test prompt",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      error: "Failed to process chat request",
      details: "No response from Gemini API",
    });
  });

  it("should successfully process a valid chat request", async () => {
    // Set a mock API key
    process.env.GEMINI_API_KEY = "test-api-key";

    // Mock the fetch to return a successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [{ text: "This is a test response" }],
            },
          },
        ],
      }),
    } as unknown as Response);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: "user", content: "Hello" }],
        systemPrompt: "test prompt",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      content: "This is a test response",
    });

    // Verify that fetch was called with the right parameters
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[0]).toContain("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent");
    expect(fetchCall[0]).toContain("test-api-key");
    
    const requestBody = JSON.parse(fetchCall[1]?.body as string);
    expect(requestBody.contents).toBeDefined();
    expect(Array.isArray(requestBody.contents)).toBe(true);
  });

  it("should handle knowledge base loading correctly", async () => {
    // Set a mock API key
    process.env.GEMINI_API_KEY = "test-api-key";

    // Mock different knowledge base content
    mockReadFile.mockResolvedValueOnce("Knowledge base content");
    mockReadFile.mockResolvedValueOnce("README content");

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [{ text: "Response with knowledge base" }],
            },
          },
        ],
      }),
    } as unknown as Response);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: "user", content: "Question about MultiSelect" }],
        systemPrompt: "test prompt",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      content: "Response with knowledge base",
    });

    // Verify that both files were read
    expect(mockReadFile).toHaveBeenCalledTimes(2);
  });

  it("should handle errors when reading knowledge base files", async () => {
    // Set a mock API key
    process.env.GEMINI_API_KEY = "test-api-key";

    // Mock file reading to throw errors
    mockReadFile.mockRejectedValueOnce(new Error("File not found"));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [{ text: "Response without knowledge" }],
            },
          },
        ],
      }),
    } as unknown as Response);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        messages: [{ role: "user", content: "Hello" }],
        systemPrompt: "test prompt",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      content: "Response without knowledge",
    });
  });
});