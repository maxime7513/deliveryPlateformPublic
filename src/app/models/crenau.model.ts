export interface Crenau {
    id?: string;
    date: any;
    dateString : string;
    heureDebut : any;
    heureFin : any;
    inscrit : number;
    inscritMax : number;
    vehicule? : string;
    societe: string;
    users?: any[];
    idDemandeCreneauRB?: string;
    smsId?: string;
    astreinte: boolean;
    astreinteInscrit: number;
    nbLivreurAstreinte?: number;
    usersAstreinte?: any[];
    call?: boolean;
}