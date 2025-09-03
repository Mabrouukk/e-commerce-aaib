import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) 
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const createdProduct = new this.productModel(createProductDto);
      return await createdProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Product with this name already exists');
      }
      throw error;
    }
  }

  async findAll(queryDto: ProductQueryDto = {}): Promise<{ products: Product[];pagination: {page: number;limit: number;total: number; pages: number;};}> {
  const { category, search, page = 1, limit = 10 } = queryDto;
    
    // Build query
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute queries
    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productModel.findById(id).exec();
    
    if (!product || !product.isActive) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productModel
      .find({ category, isActive: true })
      .sort({ name: 1 })
      .exec();
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return await this.productModel
      .find({ _id: { $in: ids }, isActive: true })
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid product ID format');
    }

    // Soft delete - mark as inactive
    const result = await this.productModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid product ID format');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }

    const product = await this.productModel
      .findByIdAndUpdate(
        id, 
        { $inc: { stock: -quantity } }, 
        { new: true }
      )
      .exec();
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (product.stock < 0) {
      await this.productModel.findByIdAndUpdate(id, { $inc: { stock: quantity } });
      throw new BadRequestException('Insufficient stock available');
    }
    
    return product;
  }

  async getCategories(): Promise<string[]> {
    return await this.productModel.distinct('category').exec();
  }
}