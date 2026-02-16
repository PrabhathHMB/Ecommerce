import React, { useState } from 'react';
import { CreateProductRequest, Product } from '../../types/product.types';
import { Size } from '../../types/common.types';
import CustomSelect from '../common/CustomSelect';
import { resolveImage } from '../../utils/image';
import './ProductForm.css';

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: CreateProductRequest | Product) => void | Promise<void>;
    onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        price: product?.price || 0,
        discountedPrice: product?.discountedPrice || 0,
        discountPersent: product?.discountPersent || 0,
        quantity: product?.quantity || 0,
        brand: product?.brand || '',
        color: product?.color || '',
        imageUrl: product?.imageUrl || '',
        topLavelCategory: '',
        secondLavelCategory: '',
        thirdLavelCategory: '',
        sizeChart: product?.sizeChart || '',
    });

    const [sizes, setSizes] = useState<Size[]>(product?.sizes || []);
    const [imagesList, setImagesList] = useState<string[]>(product?.images || []);
    const [colorsList, setColorsList] = useState<string[]>(product?.colors || []);
    const [sizeInput, setSizeInput] = useState({ name: '', quantity: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        handleFieldChange(name, value);
    };

    const handleFieldChange = (name: string, value: string | number) => {
        let finalValue: string | number = value;
        let updates: any = {};

        if (typeof value === 'string' && (name.includes('price') || name === 'quantity' || name.includes('Persent'))) {
            finalValue = Number(value);
        }

        // Auto-calculation logic (Preserved from original)
        if (name === 'price') {
            const newPrice = Number(value);
            updates.price = newPrice;
            if (formData.discountPersent > 0) {
                updates.discountedPrice = Math.round(newPrice * (1 - formData.discountPersent / 100));
            }
        } else if (name === 'discountPersent') {
            const newPercent = Number(value);
            updates.discountPersent = newPercent;
            if (formData.price > 0) {
                updates.discountedPrice = Math.round(formData.price * (1 - newPercent / 100));
            }
        } else if (name === 'discountedPrice') {
            const newDiscountedPrice = Number(value);
            updates.discountedPrice = newDiscountedPrice;
            if (formData.price > 0 && newDiscountedPrice <= formData.price) {
                updates.discountPersent = Math.round(((formData.price - newDiscountedPrice) / formData.price) * 100);
            }
        }

        setFormData(prev => ({ ...prev, [name]: finalValue, ...updates }));
    };

    const handleAddSize = () => {
        if (sizeInput.name && sizeInput.quantity > 0) {
            setSizes([...sizes, sizeInput]);
            setSizeInput({ name: '', quantity: 0 });
        }
    };

    const handleRemoveSize = (index: number) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation check for categories if creating new
        if (!product && (!formData.topLavelCategory || !formData.secondLavelCategory || !formData.thirdLavelCategory)) {
            alert("Please select all category levels");
            return;
        }

        if (product) {
            onSubmit({ ...product, ...formData, sizes, images: imagesList, colors: colorsList } as Product);
        } else {
            onSubmit({ ...formData, size: sizes, images: imagesList, colors: colorsList } as CreateProductRequest);
        }
    };

    // Options mapping
    const colorOptions = [
        { value: "BLACK", label: "Black" },
        { value: "WHITE", label: "White" },
        { value: "RED", label: "Red" },
        { value: "GREEN", label: "Green" },
        { value: "BLUE", label: "Blue" },
        { value: "YELLOW", label: "Yellow" },
        { value: "PINK", label: "Pink" },
        { value: "PURPLE", label: "Purple" },
        { value: "ORANGE", label: "Orange" },
        { value: "GREY", label: "Grey" },
        { value: "BROWN", label: "Brown" },
        { value: "GOLD", label: "Gold" },
        { value: "SILVER", label: "Silver" }
    ];

    const sizeOptions = [
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "XXL", label: "XXL" }
    ];

    return (
        <div className="product-form-container">
            <h3 className="form-title">{product ? 'Edit Product' : 'Create New Product'}</h3>

            <form onSubmit={handleSubmit} className="product-form">

                {/* Basic Info Section */}
                <div className="form-section">
                    <h4>Basic Information</h4>
                    <div className="form-grid">
                        <div className="form-group span-2">
                            <label>Title <span className="required">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Premium Cotton T-Shirt"
                            />
                        </div>

                        <div className="form-group span-3">
                            <label>Description <span className="required">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Detailed product description..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Brand <span className="required">*</span></label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Nike"
                            />
                        </div>

                        <div className="form-group">
                            <CustomSelect
                                label="Color *"
                                options={colorOptions}
                                value={formData.color}
                                onChange={(val) => handleFieldChange("color", val)}
                                placeholder="Select or Type Color"
                                allowCustom={true}
                            />
                        </div>

                        {/* Multiple Colors Support */}
                        <div className="form-group span-3">
                            <label>Additional Colors</label>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Add another color (e.g. Navy Blue)"
                                    id="new-color-input"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const input = e.currentTarget;
                                            if (input.value) {
                                                setColorsList([...colorsList, input.value]);
                                                input.value = '';
                                            }
                                        }
                                    }}
                                />
                                <button type="button" className="btn-secondary" onClick={(e) => {
                                    const input = document.getElementById('new-color-input') as HTMLInputElement;
                                    if (input && input.value) {
                                        setColorsList([...colorsList, input.value]);
                                        input.value = '';
                                    }
                                }}>Add</button>
                            </div>

                            <div className="colors-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {colorsList.map((col, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        padding: '5px 10px', background: '#f0f0f0', borderRadius: '20px', fontSize: '0.9rem'
                                    }}>
                                        <span>{col}</span>
                                        <button
                                            type="button"
                                            onClick={() => setColorsList(colorsList.filter((_, i) => i !== idx))}
                                            style={{
                                                background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 0.5
                                            }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="form-section">
                    <h4>Media</h4>
                    <div className="image-upload-area">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Main Image URL <span className="required">*</span></label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                required
                                placeholder="https://example.com/image.jpg OR /assets/image.jpg"
                            />
                            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                For local images, place them in <code>public/assets</code> and use <code>/assets/filename.jpg</code>
                            </small>
                        </div>
                        <div className="image-preview-card">
                            {formData.imageUrl ? (
                                <img
                                    src={resolveImage(formData.imageUrl)}
                                    alt="Preview"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f0f0f0', color: '#aaa' }}>
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Multiple Images Support */}
                    <div className="additional-images-section" style={{ marginTop: '20px' }}>
                        <label>Additional Images</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="Add image URL or /assets/..."
                                id="new-image-input" // Using ID for simplicity, state managed via button click
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const input = e.currentTarget;
                                        if (input.value) {
                                            setImagesList([...imagesList, input.value]);
                                            input.value = '';
                                        }
                                    }
                                }}
                            />
                            <button type="button" className="btn-secondary" onClick={(e) => {
                                const input = document.getElementById('new-image-input') as HTMLInputElement;
                                if (input && input.value) {
                                    setImagesList([...imagesList, input.value]);
                                    input.value = '';
                                }
                            }}>Add</button>
                        </div>

                        <div className="images-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {imagesList.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', border: '1px solid #ddd' }}>
                                    <img
                                        src={resolveImage(img)}
                                        alt={`Extra ${idx}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setImagesList(imagesList.filter((_, i) => i !== idx))}
                                        style={{
                                            position: 'absolute', top: 0, right: 0, background: 'red', color: 'white',
                                            border: 'none', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="form-section">
                    <h4>Pricing & Inventory</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Price (Rs.) <span className="required">*</span></label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
                        </div>

                        <div className="form-group">
                            <label>Discounted (Rs.)</label>
                            <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} min="0" />
                        </div>

                        <div className="form-group">
                            <label>Discount %</label>
                            <input type="number" name="discountPersent" value={formData.discountPersent} onChange={handleChange} min="0" max="100" />
                        </div>

                        <div className="form-group">
                            <label>Total Quantity</label>
                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" />
                        </div>
                    </div>
                </div>

                {/* Categorization & Sizes (New Product Only or Edit if needed) */}
                {!product && (
                    <div className="form-section">
                        <h4>Categorization</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <CustomSelect
                                    label="Top Category *"
                                    options={[
                                        { value: "MALE", label: "Male" },
                                        { value: "FEMALE", label: "Female" },
                                        { value: "KIDS", label: "Kids" }
                                    ]}
                                    value={formData.topLavelCategory}
                                    onChange={(val) => handleFieldChange("topLavelCategory", val)}
                                    placeholder="Select or Type..."
                                    allowCustom={true}
                                />
                            </div>

                            <div className="form-group">
                                <CustomSelect
                                    label="Sub Category *"
                                    options={[
                                        { value: "Clothing", label: "Clothing" },
                                        { value: "Accessories", label: "Accessories" },
                                        { value: "Footwear", label: "Footwear" }
                                    ]}
                                    value={formData.secondLavelCategory}
                                    onChange={(val) => handleFieldChange("secondLavelCategory", val)}
                                    placeholder="Select or Type..."
                                    allowCustom={true}
                                />
                            </div>

                            <div className="form-group">
                                <CustomSelect
                                    label="Item Type *"
                                    options={[
                                        { value: "SHIRT", label: "Shirt" },
                                        { value: "TSHIRT", label: "T-Shirt" },
                                        { value: "JEANS", label: "Jeans" },
                                        { value: "PAINT", label: "Pant" },
                                        { value: "SAREE", label: "Saree" },
                                        { value: "GOWNS", label: "Gowns" },
                                        { value: "JACKET", label: "Jacket" },
                                        { value: "SHOES", label: "Shoes" },
                                    ]}
                                    value={formData.thirdLavelCategory}
                                    onChange={(val) => handleFieldChange("thirdLavelCategory", val)}
                                    placeholder="Select or Type..."
                                    allowCustom={true}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Size Chart Section - Only for Clothing */}
                {(formData.secondLavelCategory?.toLowerCase() === 'clothing' ||
                    product?.category?.parentCategory?.name?.toLowerCase() === 'clothing' ||
                    product?.category?.parentCategory?.parentCategory?.name?.toLowerCase() === 'clothing') && (
                        <div className="form-section">
                            <h4>Size Chart</h4>
                            <div className="image-upload-area">
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Size Chart URL</label>
                                    <input
                                        type="text"
                                        name="sizeChart"
                                        value={formData.sizeChart || ''}
                                        onChange={handleChange}
                                        placeholder="https://example.com/size-chart.jpg OR /assets/chart.jpg"
                                    />
                                    <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                                        For local charts, place them in <code>public/assets</code> and use <code>/assets/filename.jpg</code> (support jpg, png, webp, etc.)
                                    </small>
                                </div>
                                <div className="image-preview-card">
                                    {formData.sizeChart ? (
                                        <img
                                            src={resolveImage(formData.sizeChart)}
                                            alt="Size Chart Preview"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f0f0f0', color: '#aaa' }}>
                                            No Chart
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                <div className="form-section">
                    <h4>Available Sizes</h4>
                    <div className="sizes-container">
                        <div className="size-input-group">
                            <div style={{ flex: 2 }}>
                                <CustomSelect
                                    options={sizeOptions}
                                    value={sizeInput.name}
                                    onChange={(val) => setSizeInput({ ...sizeInput, name: val })}
                                    placeholder="Select or Type Size"
                                    allowCustom={true}
                                />
                            </div>
                            <input
                                type="number"
                                placeholder="Qty"
                                value={sizeInput.quantity}
                                onChange={(e) => setSizeInput({ ...sizeInput, quantity: Number(e.target.value) })}
                                className="size-qty"
                                min="0"
                                style={{ flex: 1 }}
                            />
                            <button type="button" onClick={handleAddSize} className="btn-add-size">
                                + Add
                            </button>
                        </div>

                        {sizes.length > 0 && (
                            <div className="sizes-list">
                                {sizes.map((size, index) => (
                                    <div key={index} className="size-tag">
                                        <span>{size.name}</span>
                                        <span style={{ opacity: 0.7 }}>x{size.quantity}</span>
                                        <button type="button" onClick={() => handleRemoveSize(index)} className="btn-remove-size">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">
                        {product ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default ProductForm;
