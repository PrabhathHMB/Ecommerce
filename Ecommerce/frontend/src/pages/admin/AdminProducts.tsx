import React, { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';
import { Product, CreateProductRequest } from '../../types/product.types';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProductForm from '../../components/admin/ProductForm';
import AdminProductTable from '../../components/admin/AdminProductTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const { success, error: showError } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productApi.getAllProductsAdmin();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CreateProductRequest) => {
        try {
            await productApi.createProduct(data);
            success('Product created successfully!');
            setShowForm(false);
            fetchProducts();
        } catch (error: any) {
            console.error('Failed to create product:', error);
            showError(`Failed to create product: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleUpdate = async (data: Product) => {
        try {
            await productApi.updateProduct(data.id, data);
            success('Product updated successfully!');
            setEditingProduct(undefined);
            setShowForm(false);
            fetchProducts();
        } catch (error) {
            console.error('Failed to update product:', error);
            showError('Failed to update product');
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productApi.deleteProduct(productId);
            success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            showError('Failed to delete product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProduct(undefined);
    };

    const handleFormSubmit = async (data: Product | CreateProductRequest) => {
        if (editingProduct) {
            // Type guard: if we're editing, data should be treated as Product
            await handleUpdate(data as Product);
        } else {
            // Type guard: if we're creating, data should be treated as CreateProductRequest
            await handleCreate(data as CreateProductRequest);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <div className="admin-content">
                <div className="admin-header">
                    <h1>Product Management</h1>
                    {!showForm && (
                        <button onClick={() => setShowForm(true)} className="btn-primary">
                            + Add New Product
                        </button>
                    )}
                </div>

                {showForm ? (
                    <ProductForm
                        product={editingProduct}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                    />
                ) : (
                    <>
                        {loading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="admin-card">
                                <AdminProductTable
                                    products={products}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
