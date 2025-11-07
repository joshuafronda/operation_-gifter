
export type Role = 'ADMIN' | 'USER' | null;

export interface Participant {
  id: string;
  name: string;
  wishlist: string;
  assignedTo?: string; // ID of the participant they are gifting
}

export interface Group {
  id: string;
  name: string;
  participants: Participant[];
  drawCompleted: boolean;
}

export interface CurrentUser {
  name: string;
  role: Role;
}
