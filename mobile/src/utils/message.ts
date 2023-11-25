export const getContentFromMessageId = (id: string) => atob(id);
export const generateIdFromMessageContent = (message: string) => btoa(message);
