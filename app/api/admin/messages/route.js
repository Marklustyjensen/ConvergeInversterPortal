import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options.js";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/emailService";
import { v4 as uuidv4 } from "uuid";

export async function GET(request) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    let whereClause = {};
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        sentDate: "desc",
      },
    });

    // Group messages by groupId to avoid showing duplicates for multi-recipient messages
    const groupedMessages = [];
    const seenGroups = new Set();

    for (const message of messages) {
      // If message has a groupId and we've already processed this group, skip it
      if (message.groupId && seenGroups.has(message.groupId)) {
        continue;
      }

      // If message has a groupId, get all recipients for display
      if (message.groupId) {
        seenGroups.add(message.groupId);

        // Get all messages in this group to show recipient count
        const groupMessages = await prisma.message.findMany({
          where: { groupId: message.groupId },
          include: {
            recipient: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
              },
            },
          },
        });

        // Add recipient list and count to the message
        const messageWithGroupInfo = {
          ...message,
          recipients: groupMessages.map((m) => m.recipient).filter(Boolean),
          recipientCount: groupMessages.length,
          groupId: message.groupId,
        };

        groupedMessages.push(messageWithGroupInfo);
      } else {
        // Single recipient message, add as-is
        const messageWithGroupInfo = {
          ...message,
          recipients: message.recipient ? [message.recipient] : [],
          recipientCount: message.recipient ? 1 : 0,
        };
        groupedMessages.push(messageWithGroupInfo);
      }
    }

    return NextResponse.json(groupedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message, propertyId, recipientId, emailNotification } =
      await request.json();

    if (!subject || !message || !propertyId) {
      return NextResponse.json(
        { error: "Subject, message, and property are required" },
        { status: 400 }
      );
    }

    // If no specific recipient, send to all property investors
    const recipients = recipientId
      ? [{ userId: recipientId }]
      : await prisma.userProperty.findMany({
          where: { propertyId },
          select: { userId: true, user: true },
        });

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { name: true, code: true },
    });

    const createdMessages = [];

    // Generate a groupId if sending to multiple recipients
    const groupId = recipients.length > 1 ? uuidv4() : null;

    // Create messages for each recipient
    for (const recipient of recipients) {
      const targetUserId = recipient.userId || recipient.user.id;

      const newMessage = await prisma.message.create({
        data: {
          subject,
          message,
          propertyId,
          senderId: session.user.id,
          recipientId: targetUserId,
          groupId,
          emailNotification,
        },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            },
          },
        },
      });

      createdMessages.push(newMessage);

      // Send email notification if requested
      if (emailNotification && newMessage.recipient?.email) {
        try {
          const emailSubject = `New Message: ${subject}`;
          const emailBody = `
            <h2>You have received a new message about ${property.name}</h2>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Property:</strong> ${property.name} (${property.code})</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p>Please log in to your investor portal to view all messages.</p>
            <hr>
            <p><small>This is an automated message from the Investor Portal.</small></p>
          `;

          await sendEmail({
            to: newMessage.recipient.email,
            subject: emailSubject,
            html: emailBody,
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the message creation if email fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      messages: createdMessages,
      count: createdMessages.length,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
