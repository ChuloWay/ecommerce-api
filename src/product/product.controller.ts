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

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getApprovedProducts() {
    return this.productService.getApprovedProducts();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct(@Body() productData: Partial<Product>, @User() user) {
    return this.productService.createProduct(productData, user._id);
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard)
  getUserProducts(@User() user) {
    return this.productService.getUserProducts(user._id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateProduct(
    @Param('id') productId: string,
    @Body() productData: Partial<Product>,
    @User() user,
  ) {
    // Add logic to ensure the user owns the product
    return this.productService.updateProduct(productId, productData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param('id') productId: string, @User() user) {
    // Add logic to ensure the user owns the product
    return this.productService.deleteProduct(productId);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approveProduct(@Param('id') productId: string) {
    return this.productService.approveProduct(productId);
  }

  @Patch(':id/disapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  disapproveProduct(@Param('id') productId: string) {
    return this.productService.disapproveProduct(productId);
  }
}
