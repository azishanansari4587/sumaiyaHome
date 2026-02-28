"use client"
import React, { useState, useEffect } from "react";
import ShopHeader from "@/components/ShopHeader";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductFilter from "@/components/ProductFilter";
import Spinner from "@/components/Spinner";


const Decor = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();

        const products = data?.products || [];

        const filtered = products
          .filter((product) => {
            let tags = [];

            try {
              tags = Array.isArray(product.tags)
                ? product.tags
                : JSON.parse(product.tags || "[]");
            } catch (e) {
              console.error("Tag parsing error:", e);
            }

            const decorTags = ["cushion", "pillows", "pouff", "throws"];
            return tags.some(tag => typeof tag === 'string' && decorTags.includes(tag.toLowerCase()));
          });

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);





  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    designers: [],
    // priceRange: [0, 3000]
  });

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;


  // Pagination fix section

  // Step 1: Flatten products color-wise first
  const expandedProducts = products.flatMap((product) => {
    let images = [];
    try {
      if (Array.isArray(product.images)) {
        images = product.images;
      } else if (typeof product.images === "string") {
        if (product.images.trim().startsWith("[")) {
          images = JSON.parse(product.images);
        } else {
          images = [product.images];
        }
      }
    } catch (e) {
      console.error("Failed to parse images:", e);
    }

    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map((color, idx) => ({
        ...product,
        key: `${product.id}-${idx}`,
        displayName: `${product.name} - ${color.name}`,
        displayImage: color.images?.[0] || images[0],
        hoverImage: color.images?.[1] || images[1] || null,
        selectedColor: color,
      }));
    }

    return [
      {
        ...product,
        key: product.id,
        displayName: product.name,
        displayImage: images[0],
        hoverImage: images[1] || null,
      },
    ];
  });

  // Step 2: Apply filters
  const filteredProducts = expandedProducts.filter((product) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.map(String).includes(String(product.collectionId))
    )
      return false;

    if (
      filters.colors.length > 0 &&
      !product.colors?.some((color) => filters.colors.includes(color.name))
    )
      return false;

    if (
      filters.designers.length > 0 &&
      !product.designers?.some((designer) =>
        filters.designers.includes(designer)
      )
    )
      return false;

    return true;
  });

  // Step 3: Apply pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  // Pagination
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  // const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      categories: newFilters.categories.map(cat => {
        if (typeof cat === 'object' && cat !== null && 'id' in cat) return cat.id;
        if (typeof cat === 'string' || typeof cat === 'number') return cat;
        return '';
      }),

      sizes: newFilters.sizes.map(size => size.toLowerCase()),
      // designers: newFilters.designers.map(designer => designer),
      // colors: newFilters.colors.map(color => color.name.toLowerCase())
    });

    setCurrentPage(1);
  };


  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };


  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const toggleFilterSidebar = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="bg-cream py-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-4">Shop Our Decor</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handcrafted collection of premium rugs, made with sustainable materials
              and traditional techniques. Find the perfect piece for your space.
            </p>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile filter button */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={toggleFilterSidebar}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Filter size={18} />
                  Filters
                </Button>
              </div>

              {/* Filter sidebar - hidden on mobile unless toggled */}
              <div className={`
              ${isFilterOpen ? 'block' : 'hidden'} 
              lg:block lg:w-1/4 transition-all duration-300
            `}>
                {/* <FilterSidebar filters={filters} onFilterChange={handleFilterChange} /> */}
                <ProductFilter onFilterChange={handleFilterChange} />
              </div>

              {/* Product grid */}
              <div className="lg:w-3/4">
                {/* <ProductGrid filters={filters} /> */}
                {currentProducts.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6"
                        : "space-y-6"
                    }
                  >
                    {currentProducts.map((product) => (
                      <ProductGrid
                        key={product.key}
                        productId={product.id}
                        id={product.slug}
                        name={product.displayName}
                        image={product.displayImage}
                        hoverImage={product.hoverImage}
                        category={product.category}
                        colors={product.colors || []}
                        badges={product.badges}
                        sizes={product.sizes || []}
                        selectedColor={product.selectedColor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters to find what you&apos;re looking for.
                    </p>
                    <Button
                      onClick={() =>
                        handleFilterChange({
                          categories: [],
                          colors: [],
                          sizes: [],
                        })
                      }
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}


                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex flex-wrap justify-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </Button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Decor;



