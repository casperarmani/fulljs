export interface TokenInfo {
  token_balance: number;
  subscription?: {
    subscription_tiers?: {
      tier_name: string;
      tokens: number;
    };
  };
}