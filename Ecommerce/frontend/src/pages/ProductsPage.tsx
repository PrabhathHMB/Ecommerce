import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { Product, ProductFilterParams } from '../types/product.types';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<ProductFilterParams>({
        pageNumber: 0,
        pageSize: 12,
        category: undefined,
        color: [],
        size: [],
        minPrice: 0,
        maxPrice: 999999,
        sort: undefined,
        stock: undefined,
    });


    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setFilters(prev => ({ ...prev, category: categoryParam, pageNumber: 0 }));
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productApi.getAllProducts(filters);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setFilters(prev => ({ ...prev, pageNumber: 0 }));
            return;
        }

        try {
            setLoading(true);
            const results = await productApi.searchProducts(searchQuery);
            setProducts(results);
            setTotalPages(1);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: Partial<ProductFilterParams>) => {
        setFilters({ ...filters, ...newFilters, pageNumber: 0 });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters({ ...filters, pageNumber: newPage });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="products-page">
            <div className="products-hero">
                <div className="hero-inner">
                    <h1>{filters.category ? `${filters.category === 'MALE' ? 'Men' : filters.category === 'FEMALE' ? 'Women' : filters.category === 'KIDS' ? 'Kids' : filters.category} Collection` : 'Shop Collection'}</h1>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search dresses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="btn-search" aria-label="Search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <span>Search</span>
                        </button>
                    </div>

                    <div className="category-nav">
                        {[
                            { label: 'All', value: undefined },
                            { label: 'Men', value: 'MALE' },
                            { label: 'Women', value: 'FEMALE' },
                            { label: 'Kids', value: 'KIDS' }
                        ].map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => {
                                    const newCategory = cat.value;
                                    setFilters(prev => ({ ...prev, category: newCategory, pageNumber: 0 }));
                                    if (newCategory) {
                                        setSearchParams({ category: newCategory });
                                    } else {
                                        setSearchParams({});
                                    }
                                }}
                                className={`category-btn ${((filters.category === cat.value) || (!filters.category && cat.label === 'All')) ? 'active' : ''}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="products-container">
                <ProductFilter onFilterChange={handleFilterChange} />

                <div className="products-content">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <ProductList products={products} />

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '10px' }}>
                                    <button
                                        onClick={() => handlePageChange(filters.pageNumber! - 1)}
                                        disabled={filters.pageNumber === 0}
                                        style={{
                                            padding: '8px 16px',
                                            cursor: filters.pageNumber === 0 ? 'not-allowed' : 'pointer',
                                            backgroundColor: filters.pageNumber === 0 ? '#f0f0f0' : '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, index) => {
                                        
                                        const currentPage = filters.pageNumber || 0;
                                        if (
                                            index === 0 ||
                                            index === totalPages - 1 ||
                                            (index >= currentPage - 1 && index <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePageChange(index)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        cursor: 'pointer',
                                                        backgroundColor: currentPage === index ? '#6c5ce7' : '#fff',
                                                        color: currentPage === index ? '#fff' : '#333',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontWeight: currentPage === index ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {index + 1}
                                                </button>
                                            );
                                        } else if (
                                            (index === currentPage - 2 && currentPage > 2) ||
                                            (index === currentPage + 2 && currentPage < totalPages - 3)
                                        ) {
                                            return <span key={index} style={{ alignSelf: 'center' }}>...</span>;
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => handlePageChange(filters.pageNumber! + 1)}
                                        disabled={filters.pageNumber === totalPages - 1}
                                        style={{
                                            padding: '8px 16px',
                                            cursor: filters.pageNumber === totalPages - 1 ? 'not-allowed' : 'pointer',
                                            backgroundColor: filters.pageNumber === totalPages - 1 ? '#f0f0f0' : '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
