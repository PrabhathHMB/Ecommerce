import React, { useState } from 'react';
import { Product } from '../../types/product.types';
import { formatPrice } from '../../utils/currency';
import { resolveImage } from '../../utils/image';
import './AdminTable.css';

interface AdminProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

const AdminProductTable: React.FC<AdminProductTableProps> = ({ products, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Get current products
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="admin-table-container">
            <table className="admin-sheet-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Total Qty</th>
                        <th>Stock Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => {
                        const hasSizes = product.sizes && product.sizes.length > 0;
                        const isLowStock = product.quantity < 10 && product.quantity > 0;
                        const isOutStock = product.quantity === 0;

                        return (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={resolveImage(product.imageUrl)}
                                        alt={product.title}
                                        className="product-thumb"
                                    />
                                </td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{product.title}</div>
                                    <div style={{ fontSize: '0.8em', color: '#666' }}>ID: {product.id.substring(0, 8)}...</div>
                                </td>
                                <td>{product.brand}</td>
                                <td>
                                    {product.category?.name}
                                    {product.category?.parentCategory && ` > ${product.category.parentCategory.name}`}
                                </td>
                                <td>
                                    <div>{formatPrice(product.discountedPrice)}</div>
                                    {product.discountPersent > 0 && (
                                        <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.8em' }}>
                                            {formatPrice(product.price)}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {product.discountPersent > 0 ? (
                                        <span style={{ color: '#d97706', fontWeight: 500 }}>{product.discountPersent}% Off</span>
                                    ) : '-'}
                                </td>
                                <td>
                                    <span className={`stock-status ${isOutStock ? 'stock-out' : isLowStock ? 'stock-low' : 'stock-ok'}`}>
                                        {product.quantity}
                                    </span>
                                </td>
                                <td>
                                    {hasSizes ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                                            {product.sizes.map((size, idx) => (
                                                <span key={idx} style={{
                                                    fontSize: '0.75rem',
                                                    padding: '2px 4px',
                                                    backgroundColor: size.quantity > 0 ? '#f3f4f6' : '#fee2e2',
                                                    borderRadius: '3px',
                                                    border: '1px solid #e5e7eb'
                                                }}>
                                                    {size.name}:{size.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ color: '#999', fontStyle: 'italic' }}>No variants</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex' }}>
                                        <button className="action-btn btn-edit" onClick={() => onEdit(product)}>
                                            Edit
                                        </button>
                                        <button className="action-btn btn-delete" onClick={() => onDelete(product.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        className="page-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt; Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            Sheet {page}
                        </button>
                    ))}

                    <button
                        className="page-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminProductTable;
