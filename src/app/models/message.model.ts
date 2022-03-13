export interface Message {
    id?: string;
    date: any;
    nom : string;
    prenom : string;
    photoUrl? : string;
    bonLivraisonUrl? : string;
    contenue : string;
    lu: boolean;
    traite: boolean;
}