/**
 * File: anthropic-example.ts
 * Description: Example demonstrating AnthropicPlugin usage with real API calls
 * AI Assistance: Forge AI Assistant
 * Task ID: RFI-UCF-ANTHROPIC-001
 * Human Reviewer: Pending
 * Modification Level: AI-GENERATED
 */

import { UCFCore } from '../index';
import { AnthropicPlugin } from '../plugins/anthropic/index';

// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - Start
async function demonstrateAnthropicPlugin() {
  console.log('🚀 UCF Lite - Anthropic Plugin Demo\n');

  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
    console.log('\n💡 To run this example:');
    console.log('   export ANTHROPIC_API_KEY="your-api-key-here"');
    console.log('   npm run dev -- examples/anthropic-example.ts');
    process.exit(1);
  }

  try {
    // Initialize UCF Core
    const ucf = new UCFCore();
    
    // Create and install Anthropic plugin with custom options
    const anthropicPlugin = new AnthropicPlugin({
      apiKey,
      model: 'claude-opus-4-1-20250805',
      maxTokens: 1024,
      systemPrompts: {
        catalyst: `You are Catalyst, a strategic AI architect focused on high-level design and planning.
                   Provide thoughtful, strategic guidance with clear reasoning.`,
        forge: `You are Forge, an expert implementer focused on writing secure, efficient code.
                Be precise, practical, and security-conscious in your responses.`
      }
    });

    console.log('📦 Installing Anthropic plugin...');
    ucf.installPlugin(anthropicPlugin);
    console.log('✅ Plugin installed successfully!\n');

    // Test basic conversation
    console.log('💬 Testing basic conversation...');
    const basicResponse = await ucf.chat(
      'Hello! Can you briefly introduce yourself?'
    );
    console.log(`Bot: ${basicResponse.content}\n`);

    // Test Catalyst persona (triggered by strategic keywords)
    console.log('🏗️  Testing Catalyst persona...');
    const catalystResponse = await ucf.chat(
      'How should I design a scalable microservices architecture?'
    );
    console.log(`Catalyst: ${catalystResponse.content}\n`);

    // Test Forge persona with multi-turn conversation  
    console.log('⚒️  Testing Forge persona...');
    
    const forgeQuestion1 = 'Create a secure password hashing function for me.';
    const forgeResponse1 = await ucf.chat(forgeQuestion1);
    console.log(`Forge: ${forgeResponse1.content}\n`);
    
    const forgeQuestion2 = 'Show me a code example using bcrypt.';
    const forgeResponse2 = await ucf.chat(forgeQuestion2);
    console.log(`Forge: ${forgeResponse2.content}\n`);

    // Display conversation history
    console.log('📚 Conversation History:');
    const history = ucf.getHistory();
    history.forEach((msg, index) => {
      const timestamp = msg.timestamp.toLocaleTimeString();
      const persona = msg.persona ? ` [${msg.persona}]` : '';
      console.log(`${index + 1}. [${timestamp}]${persona} ${msg.role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`);
    });

    console.log('\n🎉 Demo completed successfully!');
    
    // Note: UCF Core doesn't have uninstallPlugin method in current API
    console.log('\n✨ AnthropicPlugin demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during demo:', error instanceof Error ? error.message : String(error));
    
    // Check if it's an API key issue
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      console.log('\n💡 This appears to be an authentication error.');
      console.log('   Please check your ANTHROPIC_API_KEY is valid.');
    } else if (error instanceof Error && error.message.includes('Rate limit')) {
      console.log('\n💡 Rate limit reached. Please wait a moment and try again.');
    } else if (error instanceof Error && error.message.includes('timeout')) {
      console.log('\n💡 Request timeout. Please check your internet connection.');
    }
    
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
// Note: Using require.main check instead of import.meta for Node compatibility
if (require.main === module) {
  demonstrateAnthropicPlugin().catch(console.error);
}

export { demonstrateAnthropicPlugin };
// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - End