import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CheckUserExistenceService } from 'src/application/auth/services/check-user-existence.service';

@Injectable()
export class GetLastConversationWithUserService {
  constructor(
    private readonly _db: DatabaseService,
    private readonly _checkUserExistenceService: CheckUserExistenceService,
  ) {}
  async getLastConversationWithUser(conversationInitiatorId: string, conversationParticipantId: string) {
    const [conversationInitiator, conversationParticipant] = await Promise.all([
      this._checkUserExistenceService.findUserByPublicIdOrFail(conversationInitiatorId),
      this._checkUserExistenceService.findUserByPublicIdOrFail(conversationParticipantId),
    ]);

    const conversation = await this._db.users_conversations.findFirst({
      where: {
        userId: conversationInitiator.id,
        conversations: {
          creatorId: conversationInitiator.id,
        },
      },
    });
  }
}
