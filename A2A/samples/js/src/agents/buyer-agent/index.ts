// src/agents/buyer-agent/index.ts
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

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
import { A2AClient } from "@a2a-js/sdk/client";

// NOTE: NodeNext requires .js extension for local imports in TS sources
import type { InvoiceMessage } from "../../types/invoice.js";

/**
 * Buyer Agent Executor - Can fetch other agent cards and receive invoices
 */
class BuyerAgentExecutor implements AgentExecutor {
  private cancelledTasks = new Set<string>();
  // 🔧 VERIFICATION ENDPOINT VARIABLE - flip this to true/false to simulate result
  private verificationEndpointResult: boolean = true; // <-- Change for testing

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
        kind: "task",
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
      kind: "status-update",
      taskId: taskId,
      contextId: contextId,
      status: {
        state: "working",
        message: {
          kind: "message",
          role: "agent",
          messageId: uuidv4(),
          parts: [{ kind: "text", text: "Tommy Hilfiger Agent processing..." }],
          taskId: taskId,
          contextId: contextId,
        },
        timestamp: new Date().toISOString(),
      },
      final: false,
    };
    eventBus.publish(workingStatusUpdate);

    try {
      // Get user's message (text parts)
      const userText = userMessage.parts
        .filter((p) => p.kind === "text")
        .map((p) => (p as any).text)
        .join(" ")
        .toLowerCase();

      let responseText = "Hello! I'm Tommy Hilfiger Agent, a buyer agent. I can help you find and connect with seller agents.";

      // ---- NEW: CHECK FOR INVOICE DATA PARTS FIRST ----
      const dataParts = userMessage.parts.filter((p) => p.kind === "data");

      if (dataParts.length > 0) {
        console.log("[BuyerAgent] 📄 Received invoice from seller...");

        try {
          // parse invoice
          const invoiceData = (dataParts[0] as any).data as InvoiceMessage;
          console.log(`[BuyerAgent] Invoice ID: ${invoiceData.invoiceId}`);
          console.log(`[BuyerAgent] Amount: ${invoiceData.invoice.currency} ${invoiceData.invoice.amount}`);

          // Simulate verification (replace with real HTTP call if needed)
          console.log("[BuyerAgent] Calling verification endpoint... (simulated)");
          console.log(`[BuyerAgent] Verification result: ${this.verificationEndpointResult}`);

          if (this.verificationEndpointResult === true) {
            // Positive response
            responseText = `
✅ PAYMENT SUCCESSFUL

Invoice Verification:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Invoice ID: ${invoiceData.invoiceId}
- Amount: ${invoiceData.invoice.currency} ${invoiceData.invoice.amount}
- Due Date: ${invoiceData.invoice.dueDate}
- Chain: ${invoiceData.invoice.destinationAccount.chainId}
- Wallet: ${invoiceData.invoice.destinationAccount.walletAddress}
- Verification Status: ✓ APPROVED
- Timestamp: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment has been authorized and processed.
            `.trim();

            console.log("[BuyerAgent] ✅ Sending POSITIVE response to seller");
          } else {
            // Negative response
            responseText = `
❌ PAYMENT REJECTED

Invoice Verification:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Invoice ID: ${invoiceData.invoiceId}
- Amount: ${invoiceData.invoice.currency} ${invoiceData.invoice.amount}
- Verification Status: ✗ REJECTED
- Reason: Verification endpoint returned false
- Timestamp: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment has been declined.
            `.trim();

            console.log("[BuyerAgent] ❌ Sending NEGATIVE response to seller");
          }
        } catch (error: any) {
          console.error("[BuyerAgent] Error processing invoice:", error);
          responseText = `❌ Error processing invoice: ${error?.message ?? String(error)}`;
        }
      } else if (userText.includes("fetch") && userText.includes("seller")) {
        // Fetch seller agent card
        console.log("[BuyerAgent] Fetching seller agent card...");

        try {
          const sellerAgentUrl = "http://localhost:8080";
          const client = new A2AClient(sellerAgentUrl);

          // Fetch the seller agent card
          const sellerCard = await client.getAgentCard();

          const name = sellerCard.name;
          const agentAID = sellerCard.metadata?.agentAID || "N/A";
          const url = sellerCard.url;
          const oorId = sellerCard.metadata?.oorId || "N/A";

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

          console.log("[BuyerAgent] Seller agent card fetched successfully!");
          console.log(`  Name: ${name}`);
          console.log(`  Agent AID: ${agentAID}`);
          console.log(`  URL: ${url}`);
          console.log(`  OOR ID: ${oorId}`);
        } catch (fetchError: any) {
          console.error("[BuyerAgent] Error fetching seller agent:", fetchError);
          responseText = `❌ Error fetching seller agent: ${fetchError?.message ?? String(fetchError)}\n\nMake sure the seller agent is running at http://localhost:8080`;
        }
      } else if (userText.includes("hello") || userText.includes("hi")) {
        responseText = "Hello! I'm Tommy Hilfiger Agent. Ask me to 'fetch seller agent' to see available sellers!";
      } else if (userText.includes("help")) {
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
          kind: "status-update",
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
        kind: "message",
        role: "agent",
        messageId: uuidv4(),
        parts: [{ kind: "text", text: responseText }],
        taskId: taskId,
        contextId: contextId,
      };

      const finalUpdate: TaskStatusUpdateEvent = {
        kind: "status-update",
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
        kind: "status-update",
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "failed",
          message: {
            kind: "message",
            role: "agent",
            messageId: uuidv4(),
            parts: [{ kind: "text", text: `Error: ${error?.message ?? String(error)}` }],
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
const tommyCardPath = path.resolve(
  "C:/CHAINAIM3003/mcp-servers/LegentUI/A2A/agent-cards/tommyBuyerAgent-card.json"
);
const tommyHilfigerAgentCard: AgentCard = JSON.parse(
  fs.readFileSync(tommyCardPath, "utf8")
);

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
  const app = express();
  
  // Add CORS middleware to allow requests from UI
  app.use(cors({
    origin: 'http://localhost:3000', // Allow UI origin
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  }));
  
  const expressApp = appBuilder.setupRoutes(app);

  // 5. Start the server
  const PORT = process.env.PORT || 9090;
  expressApp.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║       👔 TOMMY HILFIGER AGENT (BUYER) STARTED 👔          ║
╠════════════════════════════════════════════════════════════╣
║  Name:       ${tommyHilfigerAgentCard.name}              
║  Agent AID:  ${tommyHilfigerAgentCard.extensions?.keriIdentifiers?.agentAID}
║  OOR AID:    ${tommyHilfigerAgentCard.extensions?.gleifIdentity?.officialRole || 'N/A'}
╠════════════════════════════════════════════════════════════╣
║  Agent Card: http://localhost:${PORT}/.well-known/agent-card.json
║  Status:     🟢 READY                                     
║  Feature:    Can fetch seller agent details!              
╚════════════════════════════════════════════════════════════╝

💡 Try saying: "fetch seller agent"
`);
  });
}

main().catch(console.error);
