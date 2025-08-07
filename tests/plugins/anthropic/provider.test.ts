/**
 * File: provider.test.ts
 * Description: Unit tests for AnthropicProvider
 * AI Assistance: Forge AI Assistant
 * Task ID: RFI-UCF-ANTHROPIC-001
 * Human Reviewer: Pending
 * Modification Level: AI-GENERATED
 */

import { AnthropicProvider } from '../../../src/plugins/anthropic/provider';
import { AICompletionRequest } from '../../../src/types';

// Mock fetch globally
global.fetch = jest.fn();

// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - Start
describe('AnthropicProvider', () => {
  let provider: AnthropicProvider;
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new AnthropicProvider({
      apiKey: 'test-api-key',
      model: 'claude-opus-4-1-20250805',
      maxTokens: 1024
    });
  });

  describe('constructor', () => {
    it('should initialize with provided options', () => {
      const customProvider = new AnthropicProvider({
        apiKey: 'custom-key',
        model: 'custom-model',
        maxTokens: 2048,
        systemPrompts: {
          catalyst: 'Custom Catalyst',
          forge: 'Custom Forge'
        }
      });
      
      expect(customProvider.name).toBe('anthropic');
    });

    it('should use default values when not provided', () => {
      const minimalProvider = new AnthropicProvider({
        apiKey: 'test-key'
      });
      
      expect(minimalProvider.name).toBe('anthropic');
    });
  });

  describe('complete', () => {
    it('should successfully complete a request', async () => {
      const mockResponse = {
        id: 'msg_123',
        type: 'message',
        role: 'assistant',
        content: [{ type: 'text', text: 'Hello! How can I help you?' }],
        model: 'claude-opus-4-1-20250805',
        stop_reason: 'end_turn',
        usage: { input_tokens: 10, output_tokens: 20 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [
          { id: "1", role: "user", content: "Hello", timestamp: new Date() }
        ],
        persona: 'catalyst'
      };

      const result = await provider.complete(request);
      
      expect(result).toBe('Hello! How can I help you?');
      
      // Verify fetch was called correctly
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'x-api-key': 'test-api-key',
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          body: expect.stringContaining('"model":"claude-opus-4-1-20250805"')
        })
      );
    });

    it('should handle multi-turn conversations', async () => {
      const mockResponse = {
        id: 'msg_456',
        type: 'message',
        role: 'assistant',
        content: [{ type: 'text', text: 'Based on our previous discussion...' }],
        model: 'claude-opus-4-1-20250805',
        stop_reason: 'end_turn',
        usage: { input_tokens: 30, output_tokens: 40 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [
          { id: "1", role: "user", content: "Hello", timestamp: new Date() },
          { id: "2", role: "assistant", content: "Hi there!", timestamp: new Date() },
          { id: "3", role: "user", content: "How are you?", timestamp: new Date() }
        ],
        persona: 'catalyst'
      };

      const result = await provider.complete(request);
      
      expect(result).toBe('Based on our previous discussion...');
      
      // Verify the messages were formatted correctly
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.messages).toHaveLength(3);
      expect(callBody.messages[0]).toEqual({ role: 'user', content: 'Hello' });
      expect(callBody.messages[1]).toEqual({ role: 'assistant', content: 'Hi there!' });
      expect(callBody.messages[2]).toEqual({ role: 'user', content: 'How are you?' });
    });

    it('should include system prompt for catalyst persona', async () => {
      const customProvider = new AnthropicProvider({
        apiKey: 'test-key',
        systemPrompts: {
          catalyst: 'You are a strategic architect'
        }
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: 'Response' }]
        }),
        headers: new Headers()
      });

      await customProvider.complete({
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }],
        persona: 'catalyst'
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.system).toBe('You are a strategic architect');
    });

    it('should use default system prompt for forge persona', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: 'Response' }]
        }),
        headers: new Headers()
      });

      await provider.complete({
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }],
        persona: 'forge'
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.system).toBe('You are Forge, an expert implementer focused on writing secure, efficient code.');
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: []
        }),
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('Empty response from Anthropic API');
    });

    it('should handle 401 authentication error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          error: { message: 'Invalid API key' }
        }),
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('Authentication failed: Invalid API key');
    });

    it('should handle 400 bad request error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({
          error: { message: 'Invalid model specified' }
        }),
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('Bad request: Invalid model specified');
    });

    it('should handle 500 server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({
          error: { message: 'Internal server error' }
        }),
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('Server error: Internal server error');
    });

    it('should retry on rate limit error (429)', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // First call fails with rate limit
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({
          error: { message: 'Rate limit exceeded' }
        }),
        headers: new Headers({ 'retry-after': '1' })
      });

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: 'Success after retry' }]
        }),
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      // Mock sleep to speed up test
      jest.spyOn(provider as any, 'sleep').mockResolvedValue(undefined);

      const result = await provider.complete(request);
      
      expect(result).toBe('Success after retry');
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Rate limited. Retrying'));
      
      consoleSpy.mockRestore();
    });

    it('should give up after max retry attempts', async () => {
      // All calls fail with rate limit
      for (let i = 0; i < 3; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: async () => ({
            error: { message: 'Rate limit exceeded' }
          }),
          headers: new Headers()
        });
      }

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      // Mock sleep to speed up test
      jest.spyOn(provider as any, 'sleep').mockResolvedValue(undefined);

      await expect(provider.complete(request)).rejects.toThrow('API error (429): Rate limit exceeded');
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout error', async () => {
      // Create a new promise that rejects with AbortError immediately
      mockFetch.mockImplementationOnce(() => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('Request timeout: API call exceeded 60 seconds');
    });

    it('should handle network errors', async () => {
      // Create a non-AbortError to test network error handling
      const networkError = new Error('Network error');
      networkError.name = 'NetworkError';
      mockFetch.mockRejectedValueOnce(networkError);

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('AnthropicProvider error: Network error');
    });

    it('should handle malformed JSON response', async () => {
      // Mock handleApiError to throw the expected error message directly
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => { throw new Error('Invalid JSON'); },
        headers: new Headers()
      });

      const request: AICompletionRequest = {
        messages: [{ id: "test", role: "user", content: "Test", timestamp: new Date() }], persona: "forge"
      };

      await expect(provider.complete(request)).rejects.toThrow('Server error: Anthropic service unavailable');
    });
  });
});
// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - End