export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sumaiyahome.com';
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/(admin)/*', '/api/*', '/cart', '/wishlist', '/profile'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
