export function markMessageAsBelongsToUser(
	userId: number,
	message: {
		senderId: number;
		content: string;
		createdAt: Date;
		updatedAt: Date;
	},
) {
  return {
    ...message,
    isMine: message.senderId === userId,
  }
}
