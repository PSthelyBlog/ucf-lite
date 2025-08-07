/**
 * File: plugin.test.ts
 * Description: Unit tests for AnthropicPlugin
 * AI Assistance: Forge AI Assistant
 * Task ID: RFI-UCF-ANTHROPIC-001
 * Human Reviewer: Pending
 * Modification Level: AI-GENERATED
 */

import { AnthropicPlugin } from '../../../src/plugins/anthropic/plugin';
import { UCFCore } from '../../../src/index';
import { AnthropicProvider } from '../../../src/plugins/anthropic/provider';

// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - Start
describe('AnthropicPlugin', () => {
  let ucf: UCFCore;
  let originalEnv: string | undefined;

  beforeEach(() => {
    ucf = new UCFCore();
    originalEnv = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.ANTHROPIC_API_KEY = originalEnv;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      const plugin = new AnthropicPlugin();
      
      expect(plugin.name).toBe('anthropic');
      expect(plugin.version).toBe('1.0.0');
    });

    it('should accept options', () => {
      const options = {
        apiKey: 'test-api-key',
        model: 'claude-3-opus-20240229',
        maxTokens: 2048,
        systemPrompts: {
          catalyst: 'Custom Catalyst prompt',
          forge: 'Custom Forge prompt'
        }
      };
      
      const plugin = new AnthropicPlugin(options);
      expect(plugin.name).toBe('anthropic');
      expect(plugin.version).toBe('1.0.0');
    });

    it('should use environment variable for API key if not provided', () => {
      process.env.ANTHROPIC_API_KEY = 'env-api-key';
      const plugin = new AnthropicPlugin();
      
      // Install should not throw
      expect(() => plugin.install(ucf)).not.toThrow();
    });
  });

  describe('install', () => {
    it('should throw error if no API key is provided', () => {
      const plugin = new AnthropicPlugin();
      
      expect(() => plugin.install(ucf)).toThrow(
        'AnthropicPlugin: API key required. Set ANTHROPIC_API_KEY environment variable or provide apiKey in options.'
      );
    });

    it('should successfully install with valid API key', () => {
      const plugin = new AnthropicPlugin({ apiKey: 'test-key' });
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      plugin.install(ucf);
      
      // Check provider was set on conversation
      expect((ucf as any).conversation.aiProvider).toBeInstanceOf(AnthropicProvider);
      expect((ucf as any).conversation.aiProvider.name).toBe('anthropic');
      
      expect(consoleSpy).toHaveBeenCalledWith('AnthropicPlugin v1.0.0 installed successfully');
      
      consoleSpy.mockRestore();
    });

    it('should pass custom options to provider', () => {
      const options = {
        apiKey: 'test-key',
        model: 'custom-model',
        maxTokens: 2048,
        systemPrompts: {
          catalyst: 'Custom prompt'
        }
      };
      
      const plugin = new AnthropicPlugin(options);
      plugin.install(ucf);
      
      const provider = (ucf as any).conversation.aiProvider;
      expect(provider).toBeInstanceOf(AnthropicProvider);
    });
  });

  describe('uninstall', () => {
    it('should reset to MockAI provider when uninstalling', () => {
      const plugin = new AnthropicPlugin({ apiKey: 'test-key' });
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Install first
      plugin.install(ucf);
      expect((ucf as any).conversation.aiProvider).toBeInstanceOf(AnthropicProvider);
      
      // Then uninstall
      plugin.uninstall(ucf);
      
      // Provider should be back to MockAI
      expect((ucf as any).conversation.aiProvider.name).toBe('mock-ai');
      
      expect(consoleSpy).toHaveBeenCalledWith('AnthropicPlugin v1.0.0 uninstalled');
      
      consoleSpy.mockRestore();
    });
  });
});
// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - End