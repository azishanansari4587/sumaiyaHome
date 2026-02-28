import connection from "@/lib/connection";

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sumaiyahome.com';

    // Static routes
    const staticRoutes = [
        '',
        '/rugs',
        '/remnant',
        '/decor',
        '/outdoor',
        '/about',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Fetch dynamic product slugs
    let productRoutes = [];
    try {
        const [rows] = await connection.query("SELECT slug, updated_at FROM product");
        productRoutes = rows.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        }));
    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    return [...staticRoutes, ...productRoutes];
}
