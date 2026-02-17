export const resolveImage = (url: string | undefined | null) => {
    if (!url) return '/placeholder-dress.jpg';
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;

    // Clean up common file system paths users might copy-paste
    let cleanUrl = url.trim();

    // Remove 'frontend/public' or 'public' prefix if present
    if (cleanUrl.startsWith('frontend/public/')) {
        cleanUrl = cleanUrl.replace('frontend/public/', '/');
    } else if (cleanUrl.startsWith('public/')) {
        cleanUrl = cleanUrl.replace('public/', '/');
    }

    // Ensure it starts with / if it doesn't already (and isn't a protocol url handled above)
    if (!cleanUrl.startsWith('/')) {
        return `/${cleanUrl}`;
    }

    return cleanUrl;
};
