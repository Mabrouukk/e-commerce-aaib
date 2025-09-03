export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    details?: Record<string, any>;
    tags?: string[];
    isActive?: boolean;
    imageUrl?: string;
}
