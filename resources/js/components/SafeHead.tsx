import { Head } from '@inertiajs/react';

interface SafeHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export default function SafeHead({ 
    title = 'Trung tâm Tiếng Trung Toàn Diện',
    description = 'Trung tâm đào tạo tiếng Trung chất lượng cao',
    keywords = 'tiếng trung, học tiếng trung, trung tâm ngoại ngữ',
    image = '',
    url = ''
}: SafeHeadProps) {
    // Ensure all values are strings and not null/undefined
    const safeTitle = String(title || 'Trung tâm Tiếng Trung Toàn Diện');
    const safeDescription = String(description || 'Trung tâm đào tạo tiếng Trung chất lượng cao');
    const safeKeywords = String(keywords || 'tiếng trung, học tiếng trung, trung tâm ngoại ngữ');
    const safeImage = String(image || '');
    const safeUrl = String(url || '');

    return (
        <Head>
            <title>{safeTitle}</title>
            <meta name="description" content={safeDescription} />
            <meta name="keywords" content={safeKeywords} />
            
            {/* Open Graph */}
            <meta property="og:title" content={safeTitle} />
            <meta property="og:description" content={safeDescription} />
            {safeImage && <meta property="og:image" content={safeImage} />}
            {safeUrl && <meta property="og:url" content={safeUrl} />}
            <meta property="og:type" content="website" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={safeTitle} />
            <meta name="twitter:description" content={safeDescription} />
            {safeImage && <meta name="twitter:image" content={safeImage} />}
        </Head>
    );
}
