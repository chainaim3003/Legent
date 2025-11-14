import express from "express";
import { v4 as uuidv4 } from 'uuid';

import {
  AgentCard,
  Task,
  TaskStatusUpdateEvent,
  Message,
  MessageSendParams
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
import { A2AClient } from "@a2a-js/sdk/client";

/**
 * Buyer Agent Executor - Can fetch other agent cards and respond back
 */
class BuyerAgentExecutor implements AgentExecutor {
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

    console.log(`[BuyerAgent] Processing message ${userMessage.messageId} for task ${taskId}`);

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
          parts: [{ kind: 'text', text: 'Tommy Hilfiger Agent processing...' }],
          taskId: taskId,
          contextId: contextId,
        },
        timestamp: new Date().toISOString(),
      },
      final: false,
    };
    eventBus.publish(workingStatusUpdate);

    try {
      // Get user's message
      const userText = userMessage.parts
        .filter(p => p.kind === 'text')
        .map(p => (p as any).text)
        .join(' ')
        .toLowerCase();

      let responseText = "Hello! I'm Tommy Hilfiger Agent, a buyer agent. I can help you find and connect with seller agents.";

      // ===== NEW: CHECK IF MESSAGE IS FROM SELLER AGENT =====
      if (userText.includes('hello from seller')) {
        console.log('[BuyerAgent] 🎯 Detected hello from Seller Agent!');
        console.log('[BuyerAgent] 📤 Sending response back to Seller...');

        // Send response back to Seller
        try {
          const sellerUrl = 'http://localhost:8080';
          const sellerClient = new A2AClient(sellerUrl);

          const responseMessage: Message = {
            messageId: uuidv4(),
            kind: 'message',
            role: 'user',
            parts: [
              {
                kind: 'text',
                text: 'Hello from Buyer'
              }
            ]
          };

          const responseParams: MessageSendParams = {
            message: responseMessage
          };

          await sellerClient.sendMessage(responseParams);

          console.log('[BuyerAgent] ✅ Response "Hello from Buyer" sent to Seller successfully!');

          responseText = `✅ Received "Hello from Seller" and sent "Hello from Buyer" back to Seller at ${sellerUrl}!`;

        } catch (sellerError: any) {
          console.error('[BuyerAgent] ❌ Error sending response to Seller:', sellerError.message);
          responseText = `⚠️ Received "Hello from Seller" but failed to respond back.\nError: ${sellerError.message}`;
        }
      }
      // ===== END NEW CODE =====
      else if (userText.includes('fetch') && userText.includes('seller')) {
        console.log('[BuyerAgent] Fetching seller agent card...');

        try {
          // Create A2A Client to fetch seller agent
          const sellerAgentUrl = 'http://localhost:8080';
          const client = new A2AClient(sellerAgentUrl);

          // Fetch the seller agent card
          const sellerCard = await client.getAgentCard();

          // Extract the 4 required fields
          const name = sellerCard.name;
          const agentAID = sellerCard.metadata?.agentAID || 'N/A';
          const url = sellerCard.url;
          const oorId = sellerCard.metadata?.oorId || 'N/A';

          // Format the response
          responseText = `
🎯 SELLER AGENT FOUND!

📋 Agent Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Name:       ${name}
2. Agent AID:  ${agentAID}
3. URL:        ${url}
4. OOR ID:     ${oorId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Successfully retrieved seller agent information!
You can now interact with this seller agent at: ${url}
          `.trim();

          console.log('[BuyerAgent] Seller agent card fetched successfully!');
          console.log(`  Name: ${name}`);
          console.log(`  Agent AID: ${agentAID}`);
          console.log(`  URL: ${url}`);
          console.log(`  OOR ID: ${oorId}`);

        } catch (fetchError: any) {
          console.error('[BuyerAgent] Error fetching seller agent:', fetchError);
          responseText = `❌ Error fetching seller agent: ${fetchError.message}\n\nMake sure the seller agent is running at http://localhost:8080`;
        }

      } else if (userText.includes('hello') || userText.includes('hi')) {
        responseText = "Hello! I'm Tommy Hilfiger Agent. Ask me to 'fetch seller agent' to see available sellers!";
      } else if (userText.includes('help')) {
        responseText = `
🤖 Tommy Hilfiger Agent - Commands:

• "fetch seller agent" - Get seller agent details
• "hello" - Greet the agent
• "help" - Show this help message

I can help you discover and connect with seller agents!
        `.trim();
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

      console.log(`[BuyerAgent] Task ${taskId} completed`);

    } catch (error: any) {
      console.error(`[BuyerAgent] Error processing task ${taskId}:`, error);
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

// Tommy Hilfiger Buyer Agent Card
const tommyHilfigerAgentCard: AgentCard = {
  name: 'Tommy Hilfiger Agent',
  description: 'A buyer agent that can discover and interact with seller agents',
  url: 'http://localhost:9090/',
  provider: {
    organization: 'A2A Samples',
    url: 'https://example.com/buyer-agents'
  },
  version: '1.0.0',
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: true,
  },
  metadata: {
    agentAID: 'TOMMY_HILFIGER_AID_67890',
    oorId: 'TOMMY_OOR_67890'
  },
  securitySchemes: undefined,
  security: undefined,
  defaultInputModes: ['text'],
  defaultOutputModes: ['text', 'task-status'],
  skills: [
    {
      id: 'fetch_seller_agent',
      name: 'Fetch Seller Agent',
      description: 'Can fetch and display seller agent information including name, agent AID, URL, and OOR ID',
      tags: ['fetch', 'discover', 'seller'],
      examples: [
        'fetch seller agent',
        'show me seller agent details',
        'get seller agent information'
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
  const agentExecutor: AgentExecutor = new BuyerAgentExecutor();

  // 3. Create DefaultRequestHandler
  const requestHandler = new DefaultRequestHandler(
    tommyHilfigerAgentCard,
    taskStore,
    agentExecutor
  );

  // 4. Create and setup A2AExpressApp
  const appBuilder = new A2AExpressApp(requestHandler);
  const expressApp = appBuilder.setupRoutes(express());

  // 5. Start the server
  const PORT = process.env.PORT || 9090;
  expressApp.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║       👔 TOMMY HILFIGER AGENT (BUYER) STARTED 👔          ║
╠════════════════════════════════════════════════════════════╣
║  Name:       Tommy Hilfiger Agent                          ║
║  Agent AID:  TOMMY_HILFIGER_AID_67890                     ║
║  URL:        http://localhost:${PORT}                       ║
║  OOR ID:     TOMMY_OOR_67890                               ║
╠════════════════════════════════════════════════════════════╣
║  Agent Card: http://localhost:${PORT}/.well-known/agent-card.json
║  Status:     🟢 READY                                       ║
║  Feature:    Can respond to Seller Agent!                  ║
╚════════════════════════════════════════════════════════════╝

💡 Waiting for "Hello from Seller" message...
    `);
  });
}

main().catch(console.error);
