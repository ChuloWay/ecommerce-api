import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Smartphone',
    description: 'The name of the product',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 599.99, description: 'The price of the product' })
  @IsNumber()
  @Min(0)
  readonly price: number;

  @ApiProperty({
    example: 'Latest model smartphone',
    description: 'The description of the product',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: 100, description: 'The quantity of the product' })
  @IsNumber()
  @Min(0)
  readonly quantity: number;
}
