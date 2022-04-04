export interface DemandecrenauRB {
    id?: string;
    date: any;
    heureEnlevement : Number;
    adresseEnlevement : string;
    adresseLivraison: Array<string>;
    urlBonLivraison? : string;
    km: string;
    time: number;
}