// TODO: add support for pocketbase files: https://github.com/pocketbase/pocketbase/discussions/4627
export interface User {
  collectionId: string;
  collectionName: string;
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  username: string;
  avatar: string;
  created: Date; // ISO date string
  updated: Date; // ISO date string
}
