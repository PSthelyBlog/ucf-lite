/**
 * File: with-plugins.ts
 * Description: Example of UCF Lite with plugins
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { 
  UCFCore, 
  MockAIProvider, 
  LoggerPlugin, 
  MetricsPlugin,
  UCFPlugin 
} from '../index';

// Custom plugin example
class PromptEnhancerPlugin extends UCFPlugin {
  name = 'prompt-enhancer';
  version = '1.0.0';

  install(ucf: UCFCore): void {
    console.log(`[${this.name}] Installing prompt enhancer plugin`);
    
    // Enhance routing for specific keywords
    const router = ucf.getPersonaRouter();
    
    // Add custom patterns
    router.addPattern('catalyst', /database\s+schema/i);
    router.addPattern('catalyst', /api\s+versioning/i);
    router.addPattern('forge', /unit\s+test/i);
    router.addPattern('forge', /mock\s+data/i);
    
    console.log(`[${this.name}] Added custom routing patterns`);
  }
}

// Command plugin example
class CommandPlugin extends UCFPlugin {
  name = 'commands';
  version = '1.0.0';

  install(ucf: UCFCore): void {
    console.log(`[${this.name}] Installing command plugin`);
    
    // Add custom commands
    ucf.addCommand('stats', () => {
      const history = ucf.getHistory();
      const catalystMessages = history.filter((m: any) => m.persona === 'catalyst').length;
      const forgeMessages = history.filter((m: any) => m.persona === 'forge').length;
      
      console.log('\n📊 Conversation Statistics:');
      console.log(`Total messages: ${history.length}`);
      console.log(`Catalyst messages: ${catalystMessages}`);
      console.log(`Forge messages: ${forgeMessages}`);
      console.log('');
    });
    
    ucf.addCommand('plugins', () => {
      const plugins = ucf.getPlugins();
      console.log('\n🔌 Installed Plugins:');
      plugins.forEach((p: any) => {
        console.log(`  - ${p.name} v${p.version}`);
      });
      console.log('');
    });
  }
}

async function pluginExample() {
  console.log('=== UCF Lite Plugin Example ===\n');

  // Create UCF with multiple plugins
  const ucf = new UCFCore({
    aiProvider: new MockAIProvider(),
    enableICERC: true,
    plugins: [
      new LoggerPlugin(),
      new MetricsPlugin(),
      new PromptEnhancerPlugin(),
      new CommandPlugin()
    ]
  });

  // Chat to generate some data
  console.log('Having a conversation...\n');
  
  await ucf.chat("What's the best database schema for a blog?");
  await ucf.chat("Implement a function to fetch posts");
  await ucf.chat("How should I handle API versioning?");
  await ucf.chat("Create unit tests for the post service");

  // Execute custom commands
  console.log('\nExecuting custom commands:');
  ucf.executeCommand('stats');
  ucf.executeCommand('plugins');

  // Get metrics from metrics plugin
  const metricsPlugin = ucf.getPlugins().find((p: any) => p.name === 'metrics') as MetricsPlugin;
  if (metricsPlugin) {
    const metrics = metricsPlugin.getMetrics();
    console.log('\n📈 Metrics Plugin Data:');
    console.log(JSON.stringify(metrics, null, 2));
  }

  ucf.cleanup();
}

// Dynamic plugin loading example
async function dynamicPluginExample() {
  console.log('\n=== Dynamic Plugin Loading Example ===\n');

  const ucf = new UCFCore({
    aiProvider: new MockAIProvider()
  });

  console.log('Initial plugins:', ucf.getPlugins().length);

  // Install plugin after creation
  const logger = new LoggerPlugin({ logFile: 'conversation.log' });
  ucf.installPlugin(logger);

  console.log('After installing logger:', ucf.getPlugins().length);

  // Use the system
  await ucf.chat("How do I structure a microservice?");

  ucf.cleanup();
}

// Run examples
async function main() {
  try {
    await pluginExample();
    await dynamicPluginExample();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Only run if executed directly
if (require.main === module) {
  main();
}

export { pluginExample, dynamicPluginExample };

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End