"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        try {
            const createdProduct = new this.productModel(createProductDto);
            return await createdProduct.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException('Product with this name already exists');
            }
            throw error;
        }
    }
    async findAll(queryDto = {}) {
        const { category, search, page = 1, limit = 10 } = queryDto;
        const query = { isActive: true };
        if (category) {
            query.category = category;
        }
        if (search) {
            query.$text = { $search: search };
        }
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
    async findOne(id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        const product = await this.productModel.findById(id).exec();
        if (!product || !product.isActive) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByCategory(category) {
        return await this.productModel
            .find({ category, isActive: true })
            .sort({ name: 1 })
            .exec();
    }
    async findByIds(ids) {
        return await this.productModel
            .find({ _id: { $in: ids }, isActive: true })
            .exec();
    }
    async update(id, updateProductDto) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        const updatedProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return updatedProduct;
    }
    async remove(id) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        const result = await this.productModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
    }
    async updateStock(id, quantity) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be positive');
        }
        const product = await this.productModel
            .findByIdAndUpdate(id, { $inc: { stock: -quantity } }, { new: true })
            .exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.stock < 0) {
            await this.productModel.findByIdAndUpdate(id, { $inc: { stock: quantity } });
            throw new common_1.BadRequestException('Insufficient stock available');
        }
        return product;
    }
    async getCategories() {
        return await this.productModel.distinct('category').exec();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map