import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    allowCustom?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    label,
    allowCustom = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.value === value);


    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && allowCustom && inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-select-container" ref={containerRef}>
            {label && <label className="custom-select-label">{label}</label>}

            <div
                className={`custom-select-header ${isOpen ? 'is-open' : ''}`}
                onClick={!allowCustom ? handleToggle : undefined}
            >
                {allowCustom ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="custom-select-input"
                        value={value} // Use raw value for input
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        onClick={() => setIsOpen(true)}
                    />
                ) : (
                    <>
                        {selectedOption ? (
                            <span className="custom-select-value">{selectedOption.label}</span>
                        ) : (
                            <span className="custom-select-placeholder">{placeholder}</span>
                        )}
                    </>
                )}
                <div className="custom-select-icon" onClick={handleToggle}></div>
            </div>

            {isOpen && (
                <div className="custom-select-list">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <div
                                key={option.value}
                                className={`custom-select-option ${option.value === value ? 'is-selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="custom-select-option" style={{ cursor: 'default', color: '#999' }}>
                            No options
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
