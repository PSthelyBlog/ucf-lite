/**
 * File: basic-usage.ts
 * Description: Basic usage example of UCF Lite
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { UCFCore, MockAIProvider } from '../index';

async function basicExample() {
  console.log('=== UCF Lite Basic Usage Example ===\n');

  // Create UCF instance with mock AI provider
  const ucf = new UCFCore({
    aiProvider: new MockAIProvider(),
    enableICERC: true
  });

  // Example 1: Strategic question (routed to Catalyst)
  console.log('1. Strategic Question:');
  const response1 = await ucf.chat("How should I structure my REST API?");
  console.log(`Persona: ${response1.persona}`);
  console.log(`Response: ${response1.content}\n`);

  // Example 2: Implementation task (routed to Forge)
  console.log('2. Implementation Task:');
  const response2 = await ucf.chat("Create a function to validate email addresses");
  console.log(`Persona: ${response2.persona}`);
  console.log(`Response: ${response2.content}\n`);

  // Example 3: Analyze routing
  console.log('3. Routing Analysis:');
  const analysis = ucf.analyzeRouting("Should I implement caching in my API?");
  console.log(`Analysis: ${JSON.stringify(analysis, null, 2)}\n`);

  // Example 4: Conversation history
  console.log('4. Conversation History:');
  const history = ucf.getHistory();
  console.log(`Total messages: ${history.length}`);
  history.forEach((msg: any, i: number) => {
    console.log(`  ${i + 1}. [${msg.role}${msg.persona ? `/${msg.persona}` : ''}]: ${msg.content.substring(0, 50)}...`);
  });

  // Clean up
  ucf.cleanup();
}

async function commandExample() {
  console.log('\n=== UCF Lite Command Example ===\n');

  const ucf = new UCFCore({
    aiProvider: new MockAIProvider(),
    enableICERC: true
  });

  // Set up ICERC event listeners
  ucf.on('icerc-request', (request: any) => {
    console.log('ICERC Request Detected:');
    console.log(`  Command: ${request.command}`);
    console.log(`  Risk: ${request.risk}`);
  });

  ucf.on('icerc-decision', (decision: any) => {
    console.log('ICERC Decision:');
    console.log(`  Approved: ${decision.approved}`);
    console.log(`  Reason: ${decision.reason}`);
  });

  // This will trigger ICERC protocol (in real usage)
  const response = await ucf.chat("Install express framework");
  console.log(`\nForge Response: ${response.content}`);

  ucf.cleanup();
}

// Run examples
async function main() {
  try {
    await basicExample();
    await commandExample();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Only run if executed directly
if (require.main === module) {
  main();
}

export { basicExample, commandExample };

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End