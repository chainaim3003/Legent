import express from "express";
import { v4 as uuidv4 } from 'uuid';

import {
  AgentCard,
  Task,
  TaskStatusUpdateEvent,
  Message
} from "@a2a-js/sdk";
import {
  InMemoryTaskStore,
  TaskStore,
  AgentExecutor,
  RequestContext,
  ExecutionEventBus,
  DefaultRequestHandler,
} from "@a2a-js/sdk/server";
import { A2AExpressApp } from "@a2a-js/sdk/server/express";

/**
 * Simple Seller Agent Executor
 */
class SellerAgentExecutor implements AgentExecutor {
  private cancelledTasks = new Set<string>();

  public cancelTask = async (
    taskId: string,
    eventBus: ExecutionEventBus,
  ): Promise<void> => {
    this.cancelledTasks.add(taskId);
  };

  async execute(
    requestContext: RequestContext,
    eventBus: ExecutionEventBus
  ): Promise<void> {
    const userMessage = requestContext.userMessage;
    const existingTask = requestContext.task;

    const taskId = existingTask?.id || uuidv4();
    const contextId = userMessage.contextId || existingTask?.contextId || uuidv4();

    console.log(`[SellerAgent] Processing message ${userMessage.messageId} for task ${taskId}`);

    // 1. Publish initial Task event if it's a new task
    if (!existingTask) {
      const initialTask: Task = {
        kind: 'task',
        id: taskId,
        contextId: contextId,
        status: {
          state: "submitted",
          timestamp: new Date().toISOString(),
        },
        history: [userMessage],
        metadata: userMessage.metadata,
      };
      eventBus.publish(initialTask);
    }

    // 2. Publish "working" status
    const workingStatusUpdate: TaskStatusUpdateEvent = {
      kind: 'status-update',
      taskId: taskId,
      contextId: contextId,
      status: {
        state: "working",
        message: {
          kind: 'message',
          role: 'agent',
          messageId: uuidv4(),
          parts: [{ kind: 'text', text: 'Jupiter Agent processing your request...' }],
          taskId: taskId,
          contextId: contextId,
        },
        timestamp: new Date().toISOString(),
      },
      final: false,
    };
    eventBus.publish(workingStatusUpdate);

    try {
      // Simple response based on the user's message
      const userText = userMessage.parts
        .filter(p => p.kind === 'text')
        .map(p => (p as any).text)
        .join(' ')
        .toLowerCase();

      let responseText = "Hello! I'm Jupiter Agent, a seller agent. I can help you with product information.";

      if (userText.includes('product') || userText.includes('sell')) {
        responseText = "I have various products available. Our catalog includes electronics, clothing, and accessories. What are you interested in?";
      } else if (userText.includes('price') || userText.includes('cost')) {
        responseText = "Our prices are competitive! Please specify which product you're interested in for exact pricing.";
      } else if (userText.includes('hello') || userText.includes('hi')) {
        responseText = "Hello! I'm Jupiter Agent. How can I assist you with your purchase today?";
      }

      // Check if cancelled
      if (this.cancelledTasks.has(taskId)) {
        const cancelledUpdate: TaskStatusUpdateEvent = {
          kind: 'status-update',
          taskId: taskId,
          contextId: contextId,
          status: {
            state: "canceled",
            timestamp: new Date().toISOString(),
          },
          final: true,
        };
        eventBus.publish(cancelledUpdate);
        return;
      }

      // 3. Publish final completed status
      const agentMessage: Message = {
        kind: 'message',
        role: 'agent',
        messageId: uuidv4(),
        parts: [{ kind: 'text', text: responseText }],
        taskId: taskId,
        contextId: contextId,
      };

      const finalUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "completed",
          message: agentMessage,
          timestamp: new Date().toISOString(),
        },
        final: true,
      };
      eventBus.publish(finalUpdate);

      console.log(`[SellerAgent] Task ${taskId} completed`);

    } catch (error: any) {
      console.error(`[SellerAgent] Error processing task ${taskId}:`, error);
      const errorUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "failed",
          message: {
            kind: 'message',
            role: 'agent',
            messageId: uuidv4(),
            parts: [{ kind: 'text', text: `Error: ${error.message}` }],
            taskId: taskId,
            contextId: contextId,
          },
          timestamp: new Date().toISOString(),
        },
        final: true,
      };
      eventBus.publish(errorUpdate);
    }
  }
}

// --- Server Setup ---

// Jupiter Agent Card with custom metadata
const jupiterAgentCard: AgentCard = {
  name: 'Jupiter Agent',
  description: 'A seller agent that handles product inquiries and sales',
  url: 'http://localhost:8080/',
  provider: {
    organization: 'A2A Samples',
    url: 'https://example.com/seller-agents'
  },
  version: '1.0.0',
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: true,
  },
  // CUSTOM METADATA - Your 4 required fields
  metadata: {
    agentAID: 'EKqKjwh_MYV3bHGZQw9fRFMXDtfiFZtooEdSmKXdp5kj',
    oorId: 'JUPITER_OOR_12345'
  },
  securitySchemes: undefined,
  security: undefined,
  defaultInputModes: ['text'],
  defaultOutputModes: ['text', 'task-status'],
  skills: [
    {
      id: 'product_inquiry',
      name: 'Product Inquiry',
      description: 'Answer questions about products and provide product information',
      tags: ['products', 'selling', 'inquiry'],
      examples: [
        'What products do you have?',
        'Tell me about your prices',
        'I want to buy something'
      ],
      inputModes: ['text'],
      outputModes: ['text', 'task-status']
    },
  ],
  supportsAuthenticatedExtendedCard: false,
};

async function main() {
  // 1. Create TaskStore
  const taskStore: TaskStore = new InMemoryTaskStore();

  // 2. Create AgentExecutor
  const agentExecutor: AgentExecutor = new SellerAgentExecutor();

  // 3. Create DefaultRequestHandler
  const requestHandler = new DefaultRequestHandler(
    jupiterAgentCard,
    taskStore,
    agentExecutor
  );

  // 4. Create and setup A2AExpressApp
  const appBuilder = new A2AExpressApp(requestHandler);
  const expressApp = appBuilder.setupRoutes(express());

  // 5. Start the server
  const PORT = process.env.PORT || 8080;
  expressApp.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║          🪐 JUPITER AGENT (SELLER) STARTED 🪐             ║
╠════════════════════════════════════════════════════════════╣
║  Name:       Jupiter Agent                                 ║
║  Agent AID:  EKqKjwh_MYV3bHGZQw9fRFMXDtfiFZtooEdSmKXdp5kj ║
║  URL:        http://localhost:${PORT}                       ║
║  OOR ID:     JUPITER_OOR_12345                             ║
╠════════════════════════════════════════════════════════════╣
║  Agent Card: http://localhost:${PORT}/.well-known/agent-card.json
║  Status:     🟢 READY                                       ║
╚════════════════════════════════════════════════════════════╝
    `);
  });
}

main().catch(console.error);
