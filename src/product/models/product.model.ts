import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/models/user.model';

@Schema()
export class Product extends Document {
  @ApiProperty({
    example: 'Smartphone',
    description: 'The name of the product',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 599.99, description: 'The price of the product' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    example: 'Latest model smartphone',
    description: 'The description of the product',
  })
  @Prop()
  description: string;

  @ApiProperty({
    example: 100,
    description: 'The quantity of the product in stock',
  })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({
    type: String,
    description: 'The ID of the user who owns this product',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @ApiProperty({
    example: false,
    description: 'Whether the product is approved for listing',
  })
  @Prop({ default: false })
  isApproved: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
