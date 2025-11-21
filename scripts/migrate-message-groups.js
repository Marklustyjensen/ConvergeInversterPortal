import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function migrateMessageGroups() {
  console.log("Starting message group migration...");

  try {
    // Get all messages without a groupId
    const messagesWithoutGroup = await prisma.message.findMany({
      where: {
        groupId: null,
      },
      orderBy: [
        { senderId: "asc" },
        { propertyId: "asc" },
        { subject: "asc" },
        { sentDate: "asc" },
      ],
      include: {
        sender: true,
        property: true,
      },
    });

    console.log(
      `Found ${messagesWithoutGroup.length} messages without groupId`
    );

    // Group messages that were likely sent together
    const messageGroups = new Map();

    for (const message of messagesWithoutGroup) {
      // Create a key based on sender, property, subject, and approximate time (within 1 minute)
      const sentTime = new Date(message.sentDate);
      const timeKey = Math.floor(sentTime.getTime() / (60 * 1000)); // Group by minute

      const groupKey = `${message.senderId}-${message.propertyId}-${message.subject}-${timeKey}`;

      if (!messageGroups.has(groupKey)) {
        messageGroups.set(groupKey, []);
      }

      messageGroups.get(groupKey).push(message);
    }

    let updatedCount = 0;

    // Assign groupIds to messages that were likely sent together
    for (const [groupKey, messages] of messageGroups.entries()) {
      if (messages.length > 1) {
        // Multiple messages with same sender, property, subject, and time - group them
        const groupId = uuidv4();

        console.log(
          `Grouping ${messages.length} messages: "${messages[0].subject}" for ${messages[0].property.name}`
        );

        for (const message of messages) {
          await prisma.message.update({
            where: { id: message.id },
            data: { groupId },
          });
          updatedCount++;
        }
      }
      // Single messages don't need a groupId - they'll display individually
    }

    console.log(
      `Migration completed. Updated ${updatedCount} messages with groupIds.`
    );
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateMessageGroups();
