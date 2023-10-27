export interface CreateOfferInput {    
    offerType:string; // VENDOR.GENERIC
    vendors:[any];
    title:string;
    description:string|null;
    minValue:number;
    offerAmount:number;
    startValidity:Date;
    endValidity:Date;
    promocode:string;
    promoType:string;
    bank:[any];
    bins:[any];
    pincode:string|null;
    isActive:boolean
}   