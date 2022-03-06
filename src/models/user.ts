export type User = {
  uid: string;
  providerId: string;
  displayName: string;
  photoURL: string;
  email: string;
};

export type UserGoogleCred = {
  token: string;
  secret: string;
};
