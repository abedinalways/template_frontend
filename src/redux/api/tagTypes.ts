export const TAG_TYPES = {
  Auth: "Auth",
  User: "User",
  Notification: "Notification",
} as const;

export type TagType = (typeof TAG_TYPES)[keyof typeof TAG_TYPES];

export const tagTypesList: TagType[] = Object.values(TAG_TYPES);
