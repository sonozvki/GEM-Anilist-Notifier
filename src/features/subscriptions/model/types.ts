export interface AnimeSubscription {
  title: string;
  subscribers: string[]; // user IDs
}

export interface SubscriptionsData {
  [mediaId: string]: AnimeSubscription;
}
