import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    example: '5f9d7a3b9d3f2c1b4c9e6b7a',
    description: 'The id of the product',
  })
  readonly _id: string;

  @ApiProperty({
    example: 'Smartphone',
    description: 'The name of the product',
  })
  readonly name: string;

  @ApiProperty({ example: 599.99, description: 'The price of the product' })
  readonly price: number;

  @ApiProperty({
    example: 'Latest model smartphone',
    description: 'The description of the product',
  })
  readonly description: string;

  @ApiProperty({ example: 100, description: 'The quantity of the product' })
  readonly quantity: number;

  @ApiProperty({
    example: '5f9d7a3b9d3f2c1b4c9e6b7b',
    description: 'The id of the product owner',
  })
  readonly owner: string;

  @ApiProperty({
    example: true,
    description: 'Whether the product is approved',
  })
  readonly isApproved: boolean;
}
