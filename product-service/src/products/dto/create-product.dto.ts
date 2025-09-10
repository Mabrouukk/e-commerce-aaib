import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Min,IsArray,IsBoolean} from "class-validator";



export class CreateProductDto {
@IsString()
@IsNotEmpty()
name:string;

@IsString()
@IsNotEmpty()
description:string;

@IsNumber()
@Min(0)
price:number;

@IsNumber()
@Min(0)
stock:number;

@IsString()
@IsNotEmpty()
category:string;

@IsOptional()
@IsArray()
@IsString({ each: true })
tags?: string[];

@IsOptional()
@IsBoolean()
isActive?: boolean;
}