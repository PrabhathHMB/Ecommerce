import React, { useEffect, useState } from 'react';
import { categoryApi } from '../../api/categoryApi';
import { Category } from '../../types/product.types';
import CustomSelect from '../common/CustomSelect';
import './ProductFilter.css';

interface ProductFilterProps {
    onFilterChange: (filters: any) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [topLevel, setTopLevel] = useState<Category[]>([]);
    const [secondLevel, setSecondLevel] = useState<Category[]>([]);
    const [thirdLevel, setThirdLevel] = useState<Category[]>([]);

    const [selectedTop, setSelectedTop] = useState('');
    const [selectedSecond, setSelectedSecond] = useState('');
    const [selectedThird, setSelectedThird] = useState('');
    const [selectedSort, setSelectedSort] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryApi.getAllCategories();
                setCategories(data);
                setTopLevel(data.filter(c => c.level === 1));
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleTopChange = (value: string) => {
        const top = value;
        setSelectedTop(top);
        setSelectedSecond('');
        setSelectedThird('');

        const seconds = categories.filter(c => c.level === 2 && c.parentCategory?.name === top);
        setSecondLevel(seconds);
        setThirdLevel([]);

        onFilterChange({ category: top });
    };

    const handleSecondChange = (value: string) => {
        const second = value;
        setSelectedSecond(second);
        setSelectedThird('');

        let thirds = categories.filter(c => c.level === 3 && c.parentCategory?.name === second);

        // Specific restriction: If Top Category is "Men" or "Male", exclude "Gowns" from Third Category
        const topUpper = selectedTop.toUpperCase();
        if (topUpper === 'MEN' || topUpper === 'MALE') {
            thirds = thirds.filter(c => c.name.toUpperCase() !== 'GOWNS,HEELES,SKIRTS');
        }



        setThirdLevel(thirds);
        onFilterChange({ category: second, parentCategory: selectedTop });
    };

    const handleThirdChange = (value: string) => {
        const third = value;
        setSelectedThird(third);
        onFilterChange({ category: third, parentCategory: selectedSecond });
    };

    const handleColorChange = (color: string) => {
        onFilterChange({ color: [color] });
    };

    const handlePriceChange = (minPrice: number, maxPrice: number) => {
        onFilterChange({ minPrice, maxPrice });
    };

    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        onFilterChange({ sort: value });
    };

    const handleReset = () => {
        setSelectedTop('');
        setSelectedSecond('');
        setSelectedThird('');
        setSelectedSort('');
        setSecondLevel([]);
        setThirdLevel([]);

        // Reset all filters in parent
        onFilterChange({
            category: '',
            color: [],
            size: [],
            minPrice: 0,
            maxPrice: 999999,
            sort: '',
            stock: ''
        });
    };

    // Helper to format options for CustomSelect
    const formatOptions = (cats: Category[]) => cats.map(c => ({ value: c.name, label: c.name }));

    const sortOptions = [
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' }
    ];

    return (
        <div className="product-filter">
            <h3>Filters</h3>

            <div className="filter-section">
                <h4>Category</h4>
                <div className="category-selects">
                    <CustomSelect
                        label="Top Category"
                        options={formatOptions(topLevel)}
                        value={selectedTop}
                        onChange={handleTopChange}
                        placeholder="Select Goal..."
                    />

                    {selectedTop && (
                        <CustomSelect
                            label="Sub Category"
                            options={formatOptions(secondLevel)}
                            value={selectedSecond}
                            onChange={handleSecondChange}
                            placeholder="Select Type..."
                        />
                    )}

                    {selectedSecond && (
                        <CustomSelect
                            label="Specific Type"
                            options={formatOptions(thirdLevel)}
                            value={selectedThird}
                            onChange={handleThirdChange}
                            placeholder="Select..."
                        />
                    )}
                </div>
            </div>

            <div className="filter-section">
                <h4>Price Range</h4>
                <div className="filter-options">
                    <button onClick={() => handlePriceChange(0, 5000)}>Under Rs. 5,000</button>
                    <button onClick={() => handlePriceChange(5000, 10000)}>Rs. 5,000 - 10,000</button>
                    <button onClick={() => handlePriceChange(10000, 20000)}>Rs. 10,000 - 20,000</button>
                    <button onClick={() => handlePriceChange(20000, 999999)}>Over Rs. 20,000</button>
                </div>
            </div>

            <div className="filter-section">
                <h4>Color</h4>
                <div className="filter-options color-options">
                    <button className="color-btn black" onClick={() => handleColorChange('Black')} title="Black"></button>
                    <button className="color-btn white" onClick={() => handleColorChange('White')} title="White"></button>
                    <button className="color-btn red" onClick={() => handleColorChange('Red')} title="Red"></button>
                    <button className="color-btn blue" onClick={() => handleColorChange('Blue')} title="Blue"></button>
                    <button className="color-btn green" onClick={() => handleColorChange('Green')} title="Green"></button>
                    <button className="color-btn pink" onClick={() => handleColorChange('Pink')} title="Pink"></button>
                </div>
            </div>

            <div className="filter-section">
                <h4>Sort By</h4>
                <CustomSelect
                    options={sortOptions}
                    value={selectedSort}
                    onChange={handleSortChange}
                    placeholder="Default Sorting"
                />
            </div>

            <button className="reset-btn" onClick={handleReset}>
                Reset All Filters
            </button>
        </div>
    );
};

export default ProductFilter;
