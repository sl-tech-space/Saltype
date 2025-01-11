export interface UserData {
  user_id: string;
  username: string;
  email: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
}

export interface UserList {
  userId: string;
  userName: string;
  email: string;
  todaysMaxScore: string;
  userRank: string;
  passwordExists: boolean;
}

export interface ApiUserList {
  user_id: string;
  username: string;
  email: string;
  highest_score: number | null;
  rank_name: string | null;
  password_exists: boolean;
}
