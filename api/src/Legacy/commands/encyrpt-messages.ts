import { CommandRunner, Command } from 'nest-commander';

import { DatabaseService } from 'src/Legacy/providers/database/database.service';
import { EncryptionService } from 'src/Legacy/encryption/encryption.service';

@Command({
  name: 'encrypt-messages',
  options: { isDefault: true },
})
export class EncryptMessages extends CommandRunner {
  constructor(
    private db: DatabaseService,
    private encryptionService: EncryptionService,
  ) {
    super();
  }

  async fetchConversations(conversationId: number = undefined) {
    return this.db.conversations.findMany({
      cursor: conversationId
        ? {
            id: conversationId,
          }
        : undefined,
      take: 100,
      skip: conversationId ? 1 : undefined,
      where: {
        key: null,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async fetchMessages(conversationId: number, messageId: number = undefined) {
    return this.db.messages.findMany({
      cursor: messageId
        ? {
            id: messageId,
          }
        : undefined,
      take: 100,
      skip: messageId ? 1 : undefined,
      where: {
        conversationId,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async encryptMessages(
    conversationId: number,
    conversationEncryptionKey: `${string}-${string}`,
  ) {
    let messageId: number = undefined;
    let messages = await this.fetchMessages(conversationId, messageId);
    console.log('Encrypting messages...');

    while (messages.length > 0) {
      for (const message of messages) {
        const encryptedMessage = this.encryptionService.encryptMessage(
          message.content,
          conversationEncryptionKey,
        );

        await this.db.messages.update({
          where: {
            id: message.id,
          },
          data: {
            content: encryptedMessage,
          },
        });
      }

      messageId = messages[messages.length - 1].id;
      messages = await this.fetchMessages(conversationId, messageId);
    }
  }

  async generateKeyForConversations() {
    let conversationId = undefined;
    let conversations = await this.fetchConversations(conversationId);
    console.log('Generating encryption keys for conversations...');

    while (conversations.length > 0) {
      for (const conversation of conversations) {
        const key = this.encryptionService.generateEncryptionKey();

        await this.db.conversations.update({
          where: {
            id: conversation.id,
          },
          data: {
            key,
          },
        });
        await this.encryptMessages(conversation.id, key);
      }

      conversationId = conversations[conversations.length - 1].id;
      conversations = await this.fetchConversations(conversationId);
    }
  }

  async run() {
    this.generateKeyForConversations();
  }
}
