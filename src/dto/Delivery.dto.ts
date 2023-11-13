import { IsEmail, IsEmpty, Length } from 'class-validator'

export class CreateDevlieryUserInput {
    @IsEmail()
    email:string;

    @Length(10,12)
    phone:string;

    @Length(6,12)
    password:string;

    @Length(3,12)
    firstName

    @Length(3,12)
    lastName


    @Length(3,200)
    address

    @Length(2,20)
    pincode
}

export class DeliveryLoginInput {
    @IsEmail()
    email:string;

    @Length(6,12)
    password:string;
}

export class UpdateDeliveryInput {

    @Length(3,12)
    firstName

    @Length(3,12)
    lastName


    @Length(3,200)
    address
}