// src/agents/buyer-agent/index.ts
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import algosdk from 'algosdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from buyer-agent/.env
dotenv.config({ path: path.join(__dirname, '.env') });

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
 * REAL WORKING ALGORAND PAYMENT FUNCTION
 * This executes actual payments on Algorand TestNet
 */
async function executeAlgorandPayment(params: {
  toAddress: string;
  amount: number;
}): Promise<{ txId: string; confirmedRound: number }> {

  const buyerMnemonic = process.env.BUYER_MNEMONIC;
  if (!buyerMnemonic) {
    throw new Error('BUYER_MNEMONIC environment variable not set');
  }

  const algodToken = '';
  const algodServer = 'https://testnet-api.algonode.cloud';
  const algodPort = '';
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  const senderAccount = algosdk.mnemonicToSecretKey(buyerMnemonic);

  console.log(`[Payment] Sender: ${senderAccount.addr}`);
  console.log(`[Payment] Recipient: ${params.toAddress}`);
  console.log(`[Payment] Amount: ${params.amount} ALGO`);

  const accountInfo = await algodClient.accountInformation(senderAccount.addr).do();
  const balanceInAlgo = Number(accountInfo.amount) / 1_000_000;
  console.log(`[Payment] Balance: ${balanceInAlgo} ALGO`);

  const requiredAmount = Number(params.amount);
  if (balanceInAlgo < requiredAmount + 0.001) {
    throw new Error(`Insufficient balance: ${balanceInAlgo} ALGO (need ${requiredAmount + 0.001} ALGO)`);
  }

  const suggestedParams = await algodClient.getTransactionParams().do();

  const ptxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: senderAccount.addr,
    receiver: params.toAddress,
    amount: Math.round(Number(params.amount) * 1_000_000),
    suggestedParams,
    note: new Uint8Array(Buffer.from(`Invoice payment - ${new Date().toISOString()}`))
  });

  const signedTxn = ptxn.signTxn(senderAccount.sk);

  console.log(`[Payment] Submitting transaction...`);
  const sendResult = await algodClient.sendRawTransaction(signedTxn).do();
  const txId = sendResult.txid;  // Note: lowercase 'txid'

  if (!txId) {
    console.error(`[Payment] Send result:`, sendResult);
    throw new Error('Transaction submission failed - no txId returned');
  }

  console.log(`[Payment] Transaction sent: ${txId}`);
  console.log(`[Payment] Explorer: https://testnet.explorer.perawallet.app/tx/${txId}`);

  // Algorand TestNet typically confirms in 3-5 seconds
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
  const confirmedRound = confirmedTxn['confirmed-round'];

  console.log(`[Payment] ✅ Confirmed in round ${confirmedRound}`);

  return { txId, confirmedRound };
}

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

        eventBus.publish({
          kind: "status-update",
          taskId, contextId,
          status: {
            state: "working",
            message: {
              kind: "message", role: "agent", messageId: uuidv4(),
              parts: [{ kind: "text", text: "📄 Processing invoice..." }],
              taskId, contextId,
            },
            timestamp: new Date().toISOString(),
          },
          final: false,
        } as TaskStatusUpdateEvent);

        try {
          const invoiceData = (dataParts[0] as any).data as InvoiceMessage;
          console.log(`[BuyerAgent] Invoice ID: ${invoiceData.invoiceId}`);
          console.log(`[BuyerAgent] Amount: ${invoiceData.invoice.amount} ${invoiceData.invoice.currency}`);
          console.log(`[BuyerAgent] Full invoice data:`, JSON.stringify(invoiceData, null, 2));

          // STEP 1: Fetch Seller Agent Card
          eventBus.publish({
            kind: "status-update",
            taskId, contextId,
            status: {
              state: "working",
              message: {
                kind: "message", role: "agent", messageId: uuidv4(),
                parts: [{ kind: "text", text: "🔍 Fetching seller agent credentials..." }],
                taskId, contextId,
              },
              timestamp: new Date().toISOString(),
            },
            final: false,
          } as TaskStatusUpdateEvent);

          const sellerAgentUrl = "http://localhost:8080";
          const client = new A2AClient(sellerAgentUrl);
          const sellerCard = await client.getAgentCard();

          console.log(`[BuyerAgent] Fetched seller card: ${sellerCard.name}`);
          console.log(`[BuyerAgent] Seller AID: ${sellerCard.extensions?.keriIdentifiers?.agentAID}`);

          // STEP 2: Validate Seller Agent
          eventBus.publish({
            kind: "status-update",
            taskId, contextId,
            status: {
              state: "working",
              message: {
                kind: "message", role: "agent", messageId: uuidv4(),
                parts: [{ kind: "text", text: "🔐 Validating vLEI credentials..." }],
                taskId, contextId,
              },
              timestamp: new Date().toISOString(),
            },
            final: false,
          } as TaskStatusUpdateEvent);

          const verificationResponse = await fetch('http://localhost:4000/api/verify/seller', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(120000)
          });

          if (!verificationResponse.ok) {
            throw new Error(`Verification API returned ${verificationResponse.status}`);
          }

          const validationResult = await verificationResponse.json();

          console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          console.log(`[BuyerAgent] 🔐 vLEI VALIDATION RESULTS (FROM KERI LOGS):`);
          console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

          // STEP 3: STRICTLY VALIDATE THE ACTUAL KERI DELEGATION CHAIN
          // This checks the REAL cryptographic verification from KERI logs, not just API success
          const delegationChainVerified = validationResult.validation?.delegationChain?.verified === true;
          const agentKELVerified = validationResult.validation?.kelVerification?.agentKEL?.verified === true;
          const oorHolderKELVerified = validationResult.validation?.kelVerification?.oorHolderKEL?.verified === true;
          const notRevoked = validationResult.validation?.credentialStatus?.revoked === false;
          const notExpired = validationResult.validation?.credentialStatus?.expired === false;

          // ALL conditions must be true for payment to proceed
          const isDelegationValid =
            validationResult.success === true &&
            delegationChainVerified &&
            agentKELVerified &&
            oorHolderKELVerified &&
            notRevoked &&
            notExpired;

          // Extract Legal Entity and OOR Role information
          const sellerAgentName = validationResult.agent || sellerCard.name || 'Unknown Agent';
          const oorRole = validationResult.validation?.delegationChain?.oorRole || validationResult.oorHolder || 'Unknown Role';
          const legalEntity = validationResult.validation?.delegationChain?.legalEntity || 'Unknown Legal Entity';

          console.log(`[BuyerAgent] Agent Name: ${sellerAgentName}`);
          console.log(`[BuyerAgent] OOR Role: ${oorRole}`);
          console.log(`[BuyerAgent] Legal Entity: ${legalEntity}`);
          console.log(`[BuyerAgent]`);
          console.log(`[BuyerAgent] KERI Delegation Chain Verification:`);
          console.log(`[BuyerAgent]   ✓ Delegation Chain Verified: ${delegationChainVerified ? '✅ YES' : '❌ NO'}`);
          console.log(`[BuyerAgent]   ✓ Agent KEL Verified: ${agentKELVerified ? '✅ YES' : '❌ NO'}`);
          console.log(`[BuyerAgent]   ✓ OOR Holder KEL Verified: ${oorHolderKELVerified ? '✅ YES' : '❌ NO'}`);
          console.log(`[BuyerAgent]   ✓ Credential Not Revoked: ${notRevoked ? '✅ YES' : '❌ NO'}`);
          console.log(`[BuyerAgent]   ✓ Credential Not Expired: ${notExpired ? '✅ YES' : '❌ NO'}`);
          console.log(`[BuyerAgent]`);

          if (isDelegationValid) {
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent] ✅ VERIFICATION SUCCESS`);
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent]`);
            console.log(`[BuyerAgent] Our verifier successfully verified the delegation for:`);
            console.log(`[BuyerAgent]   📋 Agent: ${sellerAgentName}`);
            console.log(`[BuyerAgent]   👤 OOR Role: ${oorRole}`);
            console.log(`[BuyerAgent]   🏢 Legal Entity: ${legalEntity}`);
            console.log(`[BuyerAgent]`);
            console.log(`[BuyerAgent] ✅ All KERI delegation chain checks passed`);
            console.log(`[BuyerAgent] ✅ Payment authorization GRANTED`);
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          } else {
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent] ❌ VERIFICATION FAILED`);
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent]`);
            console.log(`[BuyerAgent] KERI delegation chain verification failed for:`);
            console.log(`[BuyerAgent]   📋 Agent: ${sellerAgentName}`);
            console.log(`[BuyerAgent]   👤 OOR Role: ${oorRole}`);
            console.log(`[BuyerAgent]   🏢 Legal Entity: ${legalEntity}`);
            console.log(`[BuyerAgent]`);
            console.log(`[BuyerAgent] ❌ Payment will NOT be executed`);
            console.log(`[BuyerAgent] ❌ One or more delegation chain checks failed`);
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent] Full validation details:`, JSON.stringify(validationResult.validation, null, 2));
          }

          // STEP 4: Send validation result back to seller
          eventBus.publish({
            kind: "status-update",
            taskId, contextId,
            status: {
              state: "working",
              message: {
                kind: "message", role: "agent", messageId: uuidv4(),
                parts: [{ kind: "text", text: "📤 Sending validation result to seller..." }],
                taskId, contextId,
              },
              timestamp: new Date().toISOString(),
            },
            final: false,
          } as TaskStatusUpdateEvent);

          try {
            const validationMessage = isDelegationValid
              ? `✅ VALIDATION APPROVED\n\nInvoice ID: ${invoiceData.invoiceId}\n\n🔐 vLEI Verification Results:\n  - Agent: ${validationResult.agent}\n  - OOR Holder: ${validationResult.oorHolder}\n  - Delegation Chain: ✓ VERIFIED\n  - Agent KEL: ✓ VERIFIED\n  - OOR Holder KEL: ✓ VERIFIED\n  - Credential Status: ✓ ACTIVE (not revoked/expired)\n\n✓ Your invoice has been approved for payment.`
              : `❌ VALIDATION REJECTED\n\nInvoice ID: ${invoiceData.invoiceId}\n\n🔐 vLEI Verification Results:\n  - Agent: ${validationResult.agent}\n  - Status: REJECTED\n  - Reason: ${validationResult.error || 'Delegation chain verification failed'}\n\n⚠️ Your invoice cannot be processed due to failed vLEI verification.`;

            // Send message back to seller agent (use localhost, not card URL)
            const sellerClientForNotify = new A2AClient(sellerAgentUrl);
            await sellerClientForNotify.sendMessage({
              role: "user",
              parts: [
                {
                  kind: "text",
                  text: validationMessage
                }
              ]
            });

            console.log(`[BuyerAgent] ✅ Validation result sent to seller agent`);
          } catch (notifyError: any) {
            console.error(`[BuyerAgent] ⚠️ Failed to notify seller agent:`, notifyError.message);
            // Continue with payment processing even if notification fails
          }

          // STEP 5: Execute Payment if Valid
          if (isDelegationValid) {
            eventBus.publish({
              kind: "status-update",
              taskId, contextId,
              status: {
                state: "working",
                message: {
                  kind: "message", role: "agent", messageId: uuidv4(),
                  parts: [{ kind: "text", text: "💳 Executing payment on Algorand TestNet..." }],
                  taskId, contextId,
                },
                timestamp: new Date().toISOString(),
              },
              final: false,
            } as TaskStatusUpdateEvent);

            console.log(`[BuyerAgent] Invoice destination account:`, invoiceData.invoice.destinationAccount);

            // Validate wallet address exists
            const walletAddress = invoiceData.invoice.destinationAccount?.walletAddress;
            if (!walletAddress) {
              throw new Error('Invoice missing walletAddress in destinationAccount');
            }

            console.log(`[BuyerAgent] Payment parameters:`);
            console.log(`[BuyerAgent]   - toAddress: ${walletAddress}`);
            console.log(`[BuyerAgent]   - amount: ${invoiceData.invoice.amount}`);

            // REAL PAYMENT EXECUTION
            const payment = await executeAlgorandPayment({
              toAddress: walletAddress,
              amount: invoiceData.invoice.amount
            });

            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent] ✅ PAYMENT SUCCESSFUL`);
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`[BuyerAgent]`);
            console.log(`[BuyerAgent] Our verifier successfully verified the delegation for ${sellerAgentName}`);
            console.log(`[BuyerAgent] to the ${oorRole} role at ${legalEntity}.`);
            console.log(`[BuyerAgent]`);
            console.log(`[BuyerAgent] 💳 Payment Transaction:`);
            console.log(`[BuyerAgent]   - Transaction ID: ${payment.txId}`);
            console.log(`[BuyerAgent]   - Block: ${payment.confirmedRound}`);
            console.log(`[BuyerAgent]   - Amount: ${invoiceData.invoice.amount} ${invoiceData.invoice.currency}`);
            console.log(`[BuyerAgent]   - Network: Algorand TestNet`);
            console.log(`[BuyerAgent]   - Explorer: https://testnet.explorer.perawallet.app/tx/${payment.txId}`);
            console.log(`[BuyerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

            // STEP 6: Notify seller agent of successful payment
            try {
              const paymentNotification = `💳 PAYMENT COMPLETED\n\nInvoice ID: ${invoiceData.invoiceId}\nAmount: ${invoiceData.invoice.amount} ${invoiceData.invoice.currency}\n\n🔗 Transaction Details:\n  - Network: Algorand TestNet\n  - Transaction ID: ${payment.txId}\n  - Block: ${payment.confirmedRound}\n  - Timestamp: ${new Date().toISOString()}\n\n🔍 View on Explorer:\n  https://testnet.explorer.perawallet.app/tx/${payment.txId}\n\n✅ Payment has been confirmed on the blockchain.`;

              const sellerClientForPayment = new A2AClient(sellerAgentUrl);
              await sellerClientForPayment.sendMessage({
                role: "user",
                parts: [
                  {
                    kind: "text",
                    text: paymentNotification
                  }
                ]
              });

              console.log(`[BuyerAgent] ✅ Payment confirmation sent to seller agent`);
            } catch (notifyError: any) {
              console.error(`[BuyerAgent] ⚠️ Failed to notify seller of payment:`, notifyError.message);
              // Payment was successful, notification failure is not critical
            }

            // SUCCESS RESPONSE WITH BLOCKCHAIN EXPLORER LINKS
            responseText = `
✅ PAYMENT SUCCESSFUL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INVOICE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoice ID:       ${invoiceData.invoiceId}
Amount:           ${invoiceData.invoice.currency} ${invoiceData.invoice.amount.toFixed(2)}
Due Date:         ${invoiceData.invoice.dueDate}
Sender Agent:     ${invoiceData.senderAgent.name}
Sender AID:       ${invoiceData.senderAgent.agentAID}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 vLEI VERIFICATION (ACTUAL KEL VALIDATION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verification Status: ✓ APPROVED
Agent Verified:      ${validationResult.agent}
OOR Holder:          ${validationResult.oorHolder}
Verification Time:   ${validationResult.timestamp}

Delegation Chain Verified:
  GLEIF ROOT → QVI → Legal Entity → OOR Holder → Agent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 PAYMENT EXECUTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Network:          Algorand TestNet (testnet-v1.0)
From Address:     ${process.env.BUYER_ADDRESS}
To Address:       ${walletAddress}
Amount Sent:      ${invoiceData.invoice.amount} ${invoiceData.invoice.currency}
Transaction ID:   ${payment.txId}
Confirmed:        Block ${payment.confirmedRound}
Timestamp:        ${new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VIEW TRANSACTION ON BLOCKCHAIN EXPLORER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Pera Explorer (Recommended):
   https://testnet.explorer.perawallet.app/tx/${payment.txId}

🔗 AlgoExplorer:
   https://testnet.algoexplorer.io/tx/${payment.txId}

🔗 GoalSeeker:
   https://goalseeker.purestake.io/algorand/testnet/transaction/${payment.txId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Payment authorized based on verified KERI delegation chain
✓ Invoice marked as PAID
            `.trim();

          } else {
            // VERIFICATION FAILED
            responseText = `
❌ PAYMENT REJECTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INVOICE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoice ID:       ${invoiceData.invoiceId}
Amount:           ${invoiceData.invoice.currency} ${invoiceData.invoice.amount.toFixed(2)}
Sender Agent:     ${invoiceData.senderAgent.name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 vLEI VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verification Status: ✗ REJECTED
Reason:              ${validationResult.error || 'Verification endpoint returned false'}
Agent:               ${validationResult.agent}
Timestamp:           ${validationResult.timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Payment has been declined due to failed verification.
⚠️  The seller agent's vLEI credentials could not be validated.
⚠️  No funds have been transferred.
            `.trim();
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
  //"C:/CHAINAIM3003/mcp-servers/LegentUI/A2A/agent-cards/tommyBuyerAgent-card.json"
  "C:/CHAINAIM3003/mcp-servers/Legent2/Legent/A2A/agent-cards/tommyBuyerAgent-card.json"
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
