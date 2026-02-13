import api from './axiosConfig';

export interface ReviewRequest {
    productId: string;
    review: string;
}

export interface RatingRequest {
    productId: string;
    rating: number;
}

export const reviewApi = {
    createReview: async (data: ReviewRequest) => {
        const response = await api.post('/api/reviews/create', data);
        return response.data;
    },

    createRating: async (data: RatingRequest) => {
        const response = await api.post('/api/ratings/create', data);
        return response.data;
    },

    getProductReviews: async (productId: string) => {
        const response = await api.get(`/api/reviews/product/${productId}`);
        return response.data;
    },

    getProductRatings: async (productId: string) => {
        const response = await api.get(`/api/ratings/product/${productId}`);
        return response.data;
    }
};
