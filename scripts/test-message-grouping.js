import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testMessageGrouping() {
  console.log("Testing message grouping functionality...");

  try {
    // Check current messages
    console.log("\n--- Current Messages ---");
    const allMessages = await prisma.message.findMany({
      include: {
        property: true,
        recipient: true,
        sender: true,
      },
      orderBy: { sentDate: "desc" },
    });

    console.log(`Total messages in database: ${allMessages.length}`);

    // Group messages by groupId to show the grouping effect
    const groupedMessages = new Map();
    const singleMessages = [];

    for (const message of allMessages) {
      if (message.groupId) {
        if (!groupedMessages.has(message.groupId)) {
          groupedMessages.set(message.groupId, []);
        }
        groupedMessages.get(message.groupId).push(message);
      } else {
        singleMessages.push(message);
      }
    }

    console.log(
      `\nMessages in groups: ${Array.from(groupedMessages.values()).flat().length}`
    );
    console.log(`Single messages: ${singleMessages.length}`);
    console.log(`Total groups: ${groupedMessages.size}`);

    // Show grouped messages
    if (groupedMessages.size > 0) {
      console.log("\n--- Grouped Messages (Admin View) ---");
      for (const [groupId, messages] of groupedMessages.entries()) {
        const firstMessage = messages[0];
        console.log(`Group ${groupId}:`);
        console.log(`  Subject: "${firstMessage.subject}"`);
        console.log(`  Property: ${firstMessage.property.name}`);
        console.log(`  Recipients: ${messages.length}`);
        console.log(
          `  Recipients: ${messages.map((m) => m.recipient.name || m.recipient.username).join(", ")}`
        );
        console.log("");
      }
    }

    // Show single messages
    if (singleMessages.length > 0) {
      console.log("--- Single Messages (Admin View) ---");
      for (const message of singleMessages) {
        console.log(`Message ID: ${message.id}`);
        console.log(`  Subject: "${message.subject}"`);
        console.log(`  Property: ${message.property.name}`);
        console.log(
          `  Recipient: ${message.recipient ? message.recipient.name || message.recipient.username : "None"}`
        );
        console.log("");
      }
    }

    console.log("\n--- Summary ---");
    console.log(
      `Before fix: Would show ${allMessages.length} separate message entries`
    );
    console.log(
      `After fix: Shows ${groupedMessages.size + singleMessages.length} message entries`
    );
    console.log(
      `Reduction: ${allMessages.length - (groupedMessages.size + singleMessages.length)} duplicate entries removed`
    );
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testMessageGrouping();
