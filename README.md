# UCF Lite - Minimal AI Assistant Framework

A clean, minimal, and extensible framework for safe AI-assisted development with persona-based routing and mandatory command approval.

## 🎯 Core Concept

UCF Lite provides the **essential building blocks** for AI-assisted development:
- **Dual Personas**: Strategic guidance (Catalyst) and implementation (Forge)
- **ICERC Protocol**: Mandatory approval for system commands
- **Plugin Architecture**: Extend functionality without modifying core
- **Zero Dependencies**: Pure Node.js implementation (TypeScript for development only)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/PSthelyBlog/ucf-lite
cd ucf-lite

# Install development dependencies
npm install

# Build the project
npm run build

# Start the CLI
npm start
```

## 💬 Basic Usage

```typescript
import { UCFCore, MockAIProvider } from 'ucf-lite';

// Create UCF instance
const ucf = new UCFCore({
  aiProvider: new MockAIProvider(),
  enableICERC: true
});

// Strategic question → Catalyst
const response1 = await ucf.chat("How should I structure my API?");
console.log(response1.persona); // 'catalyst'

// Implementation task → Forge
const response2 = await ucf.chat("Create a REST endpoint for users");
console.log(response2.persona); // 'forge'

// System commands require approval
const response3 = await ucf.chat("Install express");
// ICERC approval prompt appears
```

## 🤖 Personas

### Catalyst - Strategic AI Architect
- Architecture and design guidance
- Best practices and patterns
- Strategic planning
- High-level problem solving

**Triggered by**: "should I", "how to", "architecture", "design", "strategy"

### Forge - Implementation Expert
- Code implementation
- Bug fixing and debugging
- System commands (with ICERC)
- Practical solutions

**Triggered by**: "implement", "create", "fix", "install", "build"

## 🔒 ICERC Protocol

All system commands require explicit approval:

```
====================================================
🔒 SECURITY APPROVAL REQUIRED - ICERC PROTOCOL
====================================================
📋 Intent: Install required package
💻 Command: npm install express
✅ Expected Outcome: Package added to project
⚠️  Risk Level: HIGH ⚠️⚠️
====================================================
Approve command execution? [y/N]:
```

## 🔌 Plugin System

Extend UCF with custom functionality:

```typescript
import { UCFPlugin } from 'ucf-lite';

class MyPlugin extends UCFPlugin {
  name = 'my-plugin';
  version = '1.0.0';
  
  install(ucf: UCFCore): void {
    // Add event listeners
    ucf.on('message', (msg) => {
      console.log('New message:', msg.content);
    });
    
    // Add custom commands
    ucf.addCommand('status', () => {
      console.log('System status: OK');
    });
  }
}

// Use the plugin
const ucf = new UCFCore({
  plugins: [new MyPlugin()]
});
```

## 📦 Built-in Plugins

### LoggerPlugin
Logs all conversations and ICERC requests:
```typescript
new LoggerPlugin({ logFile: 'conversation.log' })
```

### MetricsPlugin
Tracks usage statistics:
```typescript
const metrics = new MetricsPlugin();
// Later: metrics.getMetrics()
```

## 🏗️ Architecture

```
UCFCore
  ├── Conversation      (Message handling)
  ├── PersonaRouter     (Catalyst/Forge routing)
  ├── ICERCProtocol     (Command approval)
  ├── PluginManager     (Extension system)
  └── AIProvider        (Swappable AI backend)
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test -- --coverage
```

## 🛠️ CLI Commands

- `help` - Show available commands
- `exit` - Exit the application  
- `clear` - Clear the screen
- `history` - Show conversation history
- `personas` - Show persona information
- `/metrics` - Show metrics (requires MetricsPlugin)

## 🔧 Configuration

```typescript
interface UCFConfig {
  aiProvider?: AIProvider;    // AI backend (default: MockAI)
  enableICERC?: boolean;      // Command approval (default: true)
  plugins?: Plugin[];         // Extension plugins
}
```

## 📝 Creating an AI Provider

```typescript
import { BaseAIProvider } from 'ucf-lite';

class OpenAIProvider extends BaseAIProvider {
  name = 'openai';
  
  async complete(request: AICompletionRequest): Promise<string> {
    // Implement OpenAI API call
    const messages = this.formatMessages(request);
    // ... API implementation
    return response;
  }
}
```

## 🎯 Design Principles

1. **Minimal**: Only essential features in core
2. **Clean**: No unnecessary dependencies
3. **Extensible**: Everything via plugins
4. **Testable**: 100% test coverage achievable
5. **Typed**: Full TypeScript support

## 🚦 Future Enhancements (via Plugins)

- Real AI providers (OpenAI, Anthropic)
- Web interface
- Persistent storage
- Workflow engine
- Rich CLI with colors
- Multi-user support
- Remote execution
- Audit logging

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

**UCF Lite** - Safe, structured AI assistance made simple.