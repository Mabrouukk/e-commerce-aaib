import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema ({ timestamps:true})

export class Product {
@Prop({ required: true })
name: string;

@Prop({required: true})
description: string;

@Prop({ required: true })
price: number;

@Prop({ required: true })
stock: string;

@Prop({required: true})
category: string;

@Prop({ type: Object, default: {} })
details:Record<string, any>;

@Prop({ type: [String], default: [] })
tags: string[];

@Prop({ default: true })
isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product); // to generate a Mongoose schema based on the Product class