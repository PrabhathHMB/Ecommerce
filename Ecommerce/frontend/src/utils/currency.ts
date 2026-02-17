/**
 * Formats a number as a currency string for Sri Lankan Rupees.
 * Uses 'en-LK' locale to ensure proper grouping (e.g. 1,500.00).
 * Prefixes with "Rs." as per common local usage.
 * 
 * @param amount The numerical amount to format
 * @returns Formatted currency string (e.g. "Rs. 1,500.00")
 */
export const formatPrice = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) {
        return 'Rs. 0.00';
    }

    // Using en-LK for correct comma separation (e.g. 1,000.00 instead of 1,000.00)
    // and specifying minimumFractionDigits to always show cents
    return "Rs. " + new Intl.NumberFormat('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};
