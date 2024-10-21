export interface RankingItem {
  user_id: string;
  username: string;
  score: number;
}

export interface RankingProps {
  rankingData: RankingItem[];
}
