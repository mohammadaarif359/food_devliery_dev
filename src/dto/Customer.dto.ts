import { IsEmail, IsEmpty, Length } from 'class-validator'

export class CreateCustomerInput {
    @IsEmail()
    email:string;

    @Length(10,12)
    phone:string;

    @Length(6,12)
    password:string;
}

export class UpdateCustomerInput {
    @Length(3,16)
    firstName:string;

    @Length(3,16)
    lastName:string;

    @Length(3,16)
    address:string;
}

export class CustomerLoginInput {
    @IsEmail()
    email:string;

    @Length(6,12)
    password:string;
}

export interface CustomerPayload {
    _id:string;
    email:string;
    verified:boolean;
}

export interface CreateOrderInput {
    _id:string;
    unit:number;
}