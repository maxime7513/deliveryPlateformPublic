export interface Crenau {
    id?: string;
    date: any;
    dateString : string;
    heureDebut : number;
    heureFin : number;
    inscrit : number;
    inscritMax : number;
    vehicule? : string;
    societe: string;
    users?: any[];
    idDemandeCreneauRB?: string;
    smsId?: string;
}