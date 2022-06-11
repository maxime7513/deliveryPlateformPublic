export interface ProfileUser {
    uid: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    photoURL?: string;
    crenauInscrit?: string[];
    astreinteInscrit?: string[];
    role?: string;
    vehicule?: Array<string>;
  }