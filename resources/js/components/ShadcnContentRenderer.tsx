import { useEffect, useState } from 'react';

interface ShadcnContentRendererProps {
    content: string;
    className?: string;
}

export default function ShadcnContentRenderer({ content, className = '' }: ShadcnContentRendererProps) {
    const [htmlContent, setHtmlContent] = useState<string>('');

    useEffect(() => {
        if (!content) {
            setHtmlContent('');
            return;
        }

        try {
            // Try to parse as JSON (Shadcn Editor format)
            const jsonContent = JSON.parse(content);
            
            // Check if it's a Lexical editor state
            if (jsonContent.root && jsonContent.root.children) {
                const html = convertLexicalToHtml(jsonContent);
                setHtmlContent(html);
            } else {
                // If not Lexical format, treat as regular HTML
                setHtmlContent(content);
            }
        } catch (error) {
            // If JSON parsing fails, treat as regular HTML
            setHtmlContent(content);
        }
    }, [content]);

    const convertLexicalToHtml = (lexicalState: any): string => {
        if (!lexicalState.root || !lexicalState.root.children) {
            return '';
        }

        return lexicalState.root.children.map((node: any) => {
            return convertNodeToHtml(node);
        }).join('');
    };

    const convertNodeToHtml = (node: any): string => {
        if (!node) return '';

        switch (node.type) {
            case 'paragraph':
                // Handle empty paragraphs
                if (!node.children || node.children.length === 0) {
                    return '';
                }
                
                const paragraphContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                
                // If paragraph content is empty after processing, skip it
                if (!paragraphContent.trim()) {
                    return '';
                }
                
                return `<p>${paragraphContent}</p>`;
            
            case 'heading':
                const level = node.tag || 'h2';
                const headingContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                return `<${level}>${headingContent}</${level}>`;
            
            case 'list':
                const listTag = node.listType === 'number' ? 'ol' : 'ul';
                const listContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                
                // Only render list if it has content
                if (!listContent.trim()) {
                    return '';
                }
                
                return `<${listTag}>${listContent}</${listTag}>`;
            
            case 'listitem':
                const listItemContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                
                // Only render list item if it has content
                if (!listItemContent.trim()) {
                    return '';
                }
                
                return `<li>${listItemContent}</li>`;
            
            case 'text':
                // Check if text property exists and has value
                if (!node.hasOwnProperty('text') || !node.text) {
                    return '';
                }
                
                let text = node.text;
                
                // Skip empty text nodes
                if (!text.trim()) {
                    return '';
                }
                
                // Handle line breaks - convert them to actual line breaks
                text = text.replace(/\\r\\n\\r\\n/g, '\n\n');
                text = text.replace(/\\r\\n/g, '\n');
                text = text.replace(/\\n\\n/g, '\n\n');
                text = text.replace(/\\n/g, '\n');
                
                // Apply formatting - check each bit
                if (node.format !== undefined) {
                    const format = node.format;
                    
                    // Bold (bit 0)
                    if (format & 1) {
                        text = `<strong>${text}</strong>`;
                    }
                    
                    // Italic (bit 1) 
                    if (format & 2) {
                        text = `<em>${text}</em>`;
                    }
                    
                    // Underline (bit 2)
                    if (format & 4) {
                        text = `<u>${text}</u>`;
                    }
                    
                    // Code (bit 3)
                    if (format & 8) {
                        text = `<code>${text}</code>`;
                    }
                    
                    // Strikethrough (bit 4)
                    if (format & 16) {
                        text = `<del>${text}</del>`;
                    }
                    
                    // Subscript (bit 5)
                    if (format & 32) {
                        text = `<sub>${text}</sub>`;
                    }
                    
                    // Superscript (bit 6)
                    if (format & 64) {
                        text = `<sup>${text}</sup>`;
                    }
                }
                
                return text;
            
            case 'link':
                const url = node.url || '#';
                const linkContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkContent}</a>`;
            
            case 'image':
                const src = node.src || '';
                const alt = node.altText || '';
                
                // Only render image if src is not empty
                if (src && src.trim()) {
                    return `<img src="${src}" alt="${alt}" class="max-w-full h-auto" />`;
                }
                return '';
            
            case 'quote':
                const quoteContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                return `<blockquote>${quoteContent}</blockquote>`;
            
            case 'code':
                const codeContent = node.children?.map((child: any) => convertNodeToHtml(child)).join('') || '';
                return `<pre><code>${codeContent}</code></pre>`;
            
            default:
                // For unknown node types, try to render children
                if (node.children) {
                    return node.children.map((child: any) => convertNodeToHtml(child)).join('');
                }
                return '';
        }
    };

    if (!htmlContent) {
        return <p className="text-gray-500 italic">Nội dung đang được cập nhật...</p>;
    }

    return (
        <div 
            className={`prose prose-lg max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
