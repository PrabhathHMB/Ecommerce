import { Size } from './common.types';

export interface Category {
    id: string;
    name: string;
    parentCategory?: Category;
    level: number;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice: number;
    discountPersent: number;
    quantity: number;
    brand: string;
    color: string;
    colors?: string[];
    sizes: Size[];
    imageUrl: string;
    images?: string[];
    sizeChart?: string;
    category: Category;
    numRatings: number;
    averageRating: number;
    createdAt: string;
}

export interface CreateProductRequest {
    title: string;
    description: string;
    price: number;
    discountedPrice: number;
    discountPersent: number;
    quantity: number;
    brand: string;
    color: string;
    colors?: string[];
    size: Size[];
    imageUrl: string;
    images?: string[];
    sizeChart?: string;
    topLavelCategory: string;
    secondLavelCategory: string;
    thirdLavelCategory: string;
}

export interface ProductFilterParams {
    category?: string;
    parentCategory?: string;
    color?: string[];
    size?: string[];
    minPrice?: number;
    maxPrice?: number;
    minDiscount?: number;
    sort?: string;
    stock?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface ProductPage {
    content: Product[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}
