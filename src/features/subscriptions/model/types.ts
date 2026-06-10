export interface AnimeSubscription {
  title: string;
  subscribers: string[]; // Discord user IDs
}

export interface SubscriptionsData {
  [mediaId: string]: AnimeSubscription;
}
