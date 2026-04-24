export interface Channel {
  id: string;
  type: string;
  label: string;
  identifier: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramLink {
  linkToken: string;
  deepLink: string;
}
