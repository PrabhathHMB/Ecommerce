import { useEffect, useState } from 'react';
import { getWishlist, removeItemFromWishlist } from '../../api/wishlistApi';
import ProductCard from '../product/ProductCard';
import Pagination from '../common/Pagination';
import '../common/Pagination.css';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleRemoveItem = async (productId: string) => {
        try {
            const updatedWishlist = await removeItemFromWishlist(productId);
            setWishlist(updatedWishlist);

            if (updatedWishlist && updatedWishlist.products) {
                const newTotalPages = Math.ceil(updatedWishlist.products.length / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
            }
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await getWishlist();
                setWishlist(data);
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-500">Explore products and save your favorites here!</p>
            </div>
        );
    }

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = wishlist.products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(wishlist.products.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-10">My Wishlist</h1>
            <div className="product-grid">
                {currentProducts.map((product: any) => (
                    <div key={product.id} style={{ position: 'relative' }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemoveItem(product.id);
                            }}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 20,
                                background: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#e74c3c',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                            title="Remove from Wishlist"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Wishlist;
