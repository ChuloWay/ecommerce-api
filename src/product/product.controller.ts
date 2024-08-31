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
  NotFoundException,
  ForbiddenException,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/user/models/user.model';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import mongoose from 'mongoose';
import { Product } from './models/product.model';
import { Response } from 'express';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products with optional approval status filter',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all products with optional filters applied',
    type: [ProductResponseDto],
  })
  async getAllProducts(
    @Res() res: Response,
    @Query('isApproved') isApproved?: string,
  ) {
    const approvedFilter = isApproved ? isApproved === 'true' : undefined;
    const products = await this.productService.getAllProducts(approvedFilter);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'Products fetched successfully',
    });
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
  async createProduct(
    @Body() productData: CreateProductDto,
    @User() user,
    @Res() res: Response,
  ) {
    const product = await this.productService.createProduct(
      productData,
      user._id,
    );
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: product,
      message: 'Product created successfully',
    });
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
  async getUserProducts(@User() user, @Res() res: Response) {
    const products = await this.productService.getUserProducts(user._id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'User products fetched successfully',
    });
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
  async updateProduct(
    @Param('id') productId: string,
    @Body() productData: UpdateProductDto,
    @User() user: { _id: string; role: string },
    @Res() res: Response,
  ) {
    this.validateObjectId(productId);
    const product = await this.productService.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    this.ensureOwnership(product, user._id);

    const updatedProduct = await this.productService.updateProduct(
      productId,
      productData,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updatedProduct,
      message: 'Product updated successfully',
    });
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
  async deleteProduct(
    @Param('id') productId: string,
    @User() user,
    @Res() res: Response,
  ) {
    this.validateObjectId(productId);
    const product = await this.productService.findProductById(productId);
    this.ensureOwnership(product, user._id);

    await this.productService.deleteProduct(productId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Product deleted successfully',
    });
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
  async approveProduct(@Param('id') productId: string, @Res() res: Response) {
    this.validateObjectId(productId);
    const product = await this.productService.findProductById(productId);
    if (product.isApproved) {
      throw new ForbiddenException('Product is already approved.');
    }
    const approvedProduct = await this.productService.approveProduct(productId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: approvedProduct,
      message: 'Product approved successfully',
    });
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
  async disapproveProduct(
    @Param('id') productId: string,
    @Res() res: Response,
  ) {
    this.validateObjectId(productId);
    const disapprovedProduct =
      await this.productService.disapproveProduct(productId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: disapprovedProduct,
      message: 'Product disapproved successfully',
    });
  }

  private validateObjectId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid product ID.');
    }
  }

  private ensureOwnership(product: Product, userId: string) {
    const productOwnerId = product.owner.toString();
    const currentUserId = userId.toString();

    if (productOwnerId !== currentUserId) {
      throw new ForbiddenException('You do not own this product.');
    }
  }
}
