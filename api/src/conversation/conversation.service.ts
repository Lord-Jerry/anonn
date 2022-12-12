import {
	Injectable,
	ForbiddenException,
	NotFoundException,
	BadRequestException,
} from "@nestjs/common";
import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} from "unique-names-generator";

import { DatabaseService } from "src/providers/database/database.service";
import { UserService } from "src/user/user.service";
import { markMessageAsBelongsToUser } from "./utils";

@Injectable()
export class ConversationService {
	constructor(private db: DatabaseService, private userService: UserService) {}

	generateConversationName() {
		return uniqueNamesGenerator({
			dictionaries: [adjectives, animals, colors],
			length: 2,
		});
	}

	async checkConversationPermissions(
		userId: string,
		conversationId: string,
		supressError = false,
	) {
		const { conversations, users, username } =
			(await this.db.users_conversations.findFirst({
				where: {
					conversations: {
						pId: conversationId,
					},
					users: {
						pId: userId,
					},
				},
				select: {
					conversations: true,
					users: true,
					username: true,
				},
			})) || {};

		if (supressError && !conversations?.id) {
			return null;
		}

		if (!(conversations?.id && conversations.isOpen)) {
			throw new ForbiddenException("conversation not found or already closed");
		}

		return {
			conversationId: conversations.id,
			userId: users.id,
			username,
			isGroup: conversations.isGroup,
		};
	}
	async initPrivateConversation(
		initiatorId: string,
		participantId: string,
		content: string,
	) {
		const [conversationInitiator, conversationParticipant] = await Promise.all([
			this.userService.findUserById(initiatorId),
			this.userService.findUserById(participantId),
		]);

		const message = await this.db.$transaction(async (tx) => {
			const conversation = await tx.conversations.create({
				data: {
					creatorId: conversationInitiator.id,
				},
			});

			/**
			 * Create permissions for both users in the conversation
			 *  random username was genrated for the conversation starter for anonymity
			 * the conversation participant shared his profile for engagement
			 * anyone starting a conversation with the participant wants to be anonymous
			 *
			 */
			const randomUsername = this.generateConversationName();
			await tx.users_conversations.createMany({
				data: [
					{
						conversationId: conversation.id,
						userId: conversationInitiator.id,
						username: randomUsername,
					},
					{
						conversationId: conversation.id,
						userId: conversationParticipant.id,
						username: conversationParticipant.username,
					},
				],
			});

			return tx.messages.create({
				data: {
					conversationId: conversation.id,
					senderId: conversationInitiator.id,
					content,
					/**
					 * prisma/schema.prisma
					 * check message table schema,
					 * for more details as to why the username is denormalized
					 */
					username: randomUsername,
				},
			});
		});
		return markMessageAsBelongsToUser(conversationInitiator.id, message);
	}

	async sendMessage(userId: string, conversationId: string, content: string) {
		const conversationPermission = await this.checkConversationPermissions(
			userId,
			conversationId,
		);
		const message = await this.db.messages.create({
			data: {
				conversationId: conversationPermission.conversationId,
				senderId: conversationPermission.userId,
				username: conversationPermission.username,
				content,
			},
		});

		return {
			...markMessageAsBelongsToUser(conversationPermission.userId, message),
			username: conversationPermission.username,
		};
	}

	async getConversations(userId: string, cursor?: string) {
		const user = await this.userService.findUserById(userId);
		const permittedConversations = await this.db.users_conversations.findMany({
			take: 10,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { pId: cursor } : undefined,
			orderBy: {
				conversations: {
					createdAt: "desc",
				},
			},
			where: {
				userId: user.id,
			},
			select: {
				conversationId: true,
			},
		});

		const row = await this.db.users_conversations.findMany({
			take: 10,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { pId: cursor } : undefined,
			distinct: ["conversationId"],
			orderBy: {
				conversations: {
					createdAt: "desc",
				},
			},
			where: {
				NOT: {
					userId: user.id,
				},
				conversationId: {
					in: permittedConversations.map((c) => c.conversationId),
				},
			},
			select: {
				conversations: {
					select: {
						id: true,
						pId: true,
						isOpen: true,
						isGroup: true,
						name: true,
						description: true,
						createdAt: true,
						updatedAt: true,
						messages: {
							take: 1,
							orderBy: {
								createdAt: "desc",
							},
							select: {
								content: true,
								senderId: true,
							},
						},
					},
				},
				username: true,
			},
		});

		return row.map((row) => ({
			...row.conversations,
			username: row.username,
			message: {
				content: row.conversations.messages[0].content,
				isMine: row.conversations.messages[0].senderId === user.id,
			},
		}));
	}

	async getConversationMessages(
		userId: string,
		conversationId: string,
		cursor?: string,
	) {
		const conversationPermission = await this.checkConversationPermissions(
			userId,
			conversationId,
		);
		const messages = await this.db.messages.findMany({
			take: 10,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { pId: cursor } : undefined,
			orderBy: {
				createdAt: "desc",
			},
			where: {
				conversationId: conversationPermission.conversationId,
			},
		});

		return messages.map((message) =>
			markMessageAsBelongsToUser(conversationPermission.userId, message),
		);
	}

	async initGroupConversation(
		userId: string,
		name: string,
		description: string,
	) {
		const user = await this.userService.findUserById(userId);
		if (!user.username) {
			throw new BadRequestException(
				"User must have a username to create a group",
			);
		}

		return this.db.$transaction(async (tx) => {
			const conversation = await tx.conversations.create({
				data: {
					name,
					description,
					isGroup: true,
					creatorId: user.id,
				},
			});

			await tx.users_conversations.create({
				data: {
					conversationId: conversation.id,
					userId: user.id,
					username: user.username,
				},
			});

			return conversation;
		});
	}

	async joinGroupConversation(userId: string, conversationId: string) {
		const [user, conversation, conversationPermission] = await Promise.all([
			this.userService.findUserById(userId),
			this.db.conversations.findUnique({
				where: {
					pId: conversationId,
				},
			}),
			this.checkConversationPermissions(userId, conversationId, true),
		]);

		if (!conversation) {
			throw new NotFoundException("Conversation not found");
		}

		if (!conversation.isGroup) {
			throw new BadRequestException("Conversation is not a group");
		}

		if (conversationPermission?.userId) {
			throw new BadRequestException("User is already in the conversation");
		}

		return this.db.users_conversations.create({
			data: {
				conversationId: conversation.id,
				userId: user.id,
				username: this.generateConversationName(),
			},
		});
	}

	async leaveGroupConversation(userId: string, conversationId: string) {
		const [user, conversationPermission] = await Promise.all([
			this.userService.findUserById(userId),
			this.checkConversationPermissions(userId, conversationId),
		]);

		if (!conversationPermission.isGroup) {
			throw new BadRequestException("Conversation is not a group");
		}

		return this.db.users_conversations.deleteMany({
			where: {
				conversationId: conversationPermission.conversationId,
				userId: user.id,
			},
		});
	}
}
