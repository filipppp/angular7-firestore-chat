export interface Message {
  author: string;
  content: string;
  postedAt: Date;
}

export interface Chat {
  admins: Array<string>;
  createdAt: Date;
  members: Array<string>;
  messages?: Array<Message>;
  name: string;
  id?: string;
}
