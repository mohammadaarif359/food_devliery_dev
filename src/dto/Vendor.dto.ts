export interface CreateVendorInput {
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    lat:number;
    lng:number;
}

export interface VendorLoginInput {
    email:string;
    password:string;
}

export interface VendorPayload {
    _id:string;
    name:string;
    foodType:[string];
    email:string;
}

export interface EditVendorInput {
    name:string;
    address:string;
    phone:string;
    foodType:[string];
}