import { v4 as uuidv4 } from 'uuid';
import { A2AClient } from "@a2a-js/sdk/client";
import { Message, MessageSendParams } from "@a2a-js/sdk";

async function initiateHello() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        🚀 INITIATING SELLER → BUYER HELLO 🚀              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Create client pointing to Buyer Agent
  const buyerUrl = 'http://localhost:9090';
  const client = new A2AClient(buyerUrl);

  console.log(`📤 Sending "Hello from Seller" to Buyer at ${buyerUrl}...`);

  // Construct the message
  const message: Message = {
    messageId: uuidv4(),
    kind: 'message',
    role: 'user',
    parts: [
      {
        kind: 'text',
        text: 'Hello from Seller'
      }
    ]
  };

  const params: MessageSendParams = {
    message: message
  };

  try {
    // Send message and get stream
    const stream = client.sendMessageStream(params);

    console.log('\n📥 Receiving response stream from Buyer...\n');

    // Process stream events
    for await (const event of stream) {
      if (event.kind === 'status-update') {
        console.log(`   Status: ${event.status.state}`);
        if (event.status.message) {
          const text = event.status.message.parts
            .filter(p => p.kind === 'text')
            .map(p => (p as any).text)
            .join(' ');
          if (text) {
            console.log(`   Message: ${text}`);
          }
        }
      } else if (event.kind === 'task') {
        console.log(`   Task ID: ${event.id}`);
        console.log(`   Context ID: ${event.contextId}`);
      }
    }

    console.log('\n✅ Communication completed successfully!\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  Check Buyer and Seller terminals for detailed logs       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

  } catch (error: any) {
    console.error('\n❌ Error during communication:');
    console.error(`   ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure Buyer Agent is running on port 9090');
      console.error('   Run: npm run agents:buyer');
    }
    process.exit(1);
  }
}

initiateHello().catch(console.error);
