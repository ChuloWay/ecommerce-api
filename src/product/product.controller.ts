import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/user/models/user.model';
import { Product } from './models/product.model';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all approved products' })
  @ApiResponse({
    status: 200,
    description: 'Return all approved products',
    type: [ProductResponseDto],
  })
  getApprovedProducts() {
    return this.productService.getApprovedProducts();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductResponseDto,
  })
  createProduct(@Body() productData: CreateProductDto, @User() user) {
    return this.productService.createProduct(productData, user._id);
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get authenticated user's products" })
  @ApiResponse({
    status: 200,
    description: "Return authenticated user's products",
    type: [ProductResponseDto],
  })
  getUserProducts(@User() user) {
    return this.productService.getUserProducts(user._id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: ProductResponseDto,
  })
  updateProduct(
    @Param('id') productId: string,
    @Body() productData: UpdateProductDto,
    @User() user,
  ) {
    // Add logic to ensure the user owns the product
    return this.productService.updateProduct(productId, productData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
    type: ProductResponseDto,
  })
  deleteProduct(@Param('id') productId: string, @User() user) {
    // Add logic to ensure the user owns the product
    return this.productService.deleteProduct(productId);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully approved.',
    type: ProductResponseDto,
  })
  approveProduct(@Param('id') productId: string) {
    return this.productService.approveProduct(productId);
  }

  @Patch(':id/disapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disapprove a product' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully disapproved.',
    type: ProductResponseDto,
  })
  disapproveProduct(@Param('id') productId: string) {
    return this.productService.disapproveProduct(productId);
  }
}
