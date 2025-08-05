#!/usr/bin/env node

/**
 * File: cli/index.ts
 * Description: CLI entry point for UCF Lite
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { UCFCore, LoggerPlugin, MetricsPlugin } from '../index';
import { SimpleCLI } from './simple-cli';

/**
 * Main CLI entry point
 */
async function main() {
  try {
    // Parse command line arguments (future enhancement)
    const args = process.argv.slice(2);
    const enableLogging = args.includes('--log');
    const enableMetrics = args.includes('--metrics');
    
    // Create plugins array
    const plugins = [];
    if (enableLogging) {
      plugins.push(new LoggerPlugin());
    }
    if (enableMetrics) {
      plugins.push(new MetricsPlugin());
    }
    
    // Create UCF instance
    const ucf = new UCFCore({
      enableICERC: true,
      plugins
    });
    
    // Create and start CLI
    const cli = new SimpleCLI();
    await cli.start(ucf);
    
  } catch (error) {
    console.error('Failed to start UCF:', error);
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