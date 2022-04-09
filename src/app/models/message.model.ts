export interface Message {
    id?: string;
    date: any;
    nom : string;
    prenom : string;
    photoUrl? : string;
    urlBonLivraison? : string;
    contenue : string;
    lu: boolean;
    traite: boolean;
}