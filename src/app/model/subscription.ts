export type Subscription = {
  userAgent: string;
  endpoint: string;
  publicKey: string;
  privateKey: string;
  expirationTime: number | null;
};
