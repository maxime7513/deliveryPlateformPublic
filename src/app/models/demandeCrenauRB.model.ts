export interface DemandecrenauRB {
    id?: string;
    date: any;
    heureEnlevement : Number;
    adresseEnlevement : string;
    adresseLivraison: Array<string>;
    urlBonLivraison : string;
    urlBonLivraisonSigne? : string;
    km: string;
    time: number;
    numeroMission?: string;
}