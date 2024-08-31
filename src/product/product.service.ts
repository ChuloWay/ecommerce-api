import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/product.model';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async createProduct(
    productData: Partial<Product>,
    userId: string,
  ): Promise<Product> {
    const product = new this.productModel({ ...productData, owner: userId });
    return product.save();
  }

  async getApprovedProducts(): Promise<Product[]> {
    return this.productModel.find({ isApproved: true }).exec();
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    return this.productModel.find({ owner: userId }).exec();
  }

  async updateProduct(
    productId: string,
    productData: Partial<Product>,
  ): Promise<Product> {
    return this.productModel.findByIdAndUpdate(productId, productData, {
      new: true,
    });
  }

  async deleteProduct(productId: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(productId);
  }

  async approveProduct(productId: string): Promise<Product> {
    return this.productModel.findByIdAndUpdate(
      productId,
      { isApproved: true },
      { new: true },
    );
  }

  async disapproveProduct(productId: string): Promise<Product> {
    return this.productModel.findByIdAndUpdate(
      productId,
      { isApproved: false },
      { new: true },
    );
  }
}
