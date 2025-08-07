#!/usr/bin/env node

/**
 * File: cli/index.ts
 * Description: CLI entry point for UCF Lite
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { UCFCore, LoggerPlugin, MetricsPlugin, AnthropicPlugin } from '../index';
import { SimpleCLI } from './simple-cli';

/**
 * Main CLI entry point
 */
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const enableLogging = args.includes('--log');
    const enableMetrics = args.includes('--metrics');
    const useAnthropic = args.includes('--anthropic') || !!process.env.ANTHROPIC_API_KEY;
    
    const plugins = [];
    
    // Add Anthropic plugin if API key is available
    if (useAnthropic) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.warn('⚠️  Warning: --anthropic flag used but ANTHROPIC_API_KEY not set');
        console.log('   Using mock AI provider instead.');
        console.log('   Set ANTHROPIC_API_KEY in .env or environment to use Claude.\n');
      } else {
        plugins.push(new AnthropicPlugin({ 
          apiKey,
          model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-1-20250805',
          maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '1024', 10)
        }));
        console.log('✨ Using Anthropic Claude AI');
        console.log(`   Model: ${process.env.ANTHROPIC_MODEL || 'claude-opus-4-1-20250805'}\n`);
      }
    } else {
      console.log('🤖 Using Mock AI Provider');
      console.log('   Set ANTHROPIC_API_KEY environment variable to use Claude AI\n');
    }
    
    // Add other plugins
    if (enableLogging) {
      plugins.push(new LoggerPlugin());
      console.log('📝 Logging enabled');
    }
    if (enableMetrics) {
      plugins.push(new MetricsPlugin());
      console.log('📊 Metrics enabled');
    }
    
    // Create UCF instance
    const ucf = new UCFCore({
      enableICERC: true,
      plugins
    });
    
    // Display startup information
    console.log('🚀 UCF Lite started successfully!');
    console.log('   Type "help" for available commands');
    console.log('   Type "exit" to quit\n');
    
    // Create and start CLI
    const cli = new SimpleCLI();
    await cli.start(ucf);
    
  } catch (error) {
    console.error('❌ Failed to start UCF:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
main();

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End