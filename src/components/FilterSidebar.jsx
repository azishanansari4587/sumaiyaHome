import React, {useState, useEffect} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// interface FilterSidebarProps {
//   filters: Filters;
//   onFilterChange: (filters: Filters) => void;
// }

const colors = [
  { id: 'beige', name: 'Beige', color: '#e8d9c7' },
  { id: 'blue', name: 'Blue', color: '#a4c2e3' },
  { id: 'pink', name: 'Pink', color: '#FF69B4' },
  { id: 'yellow', name: 'Yellow', color: '#FFFF00' },
  { id: 'gold', name: 'Golden', color: '#CFB53B' },
  { id: 'red', name: 'Red', color: '#c25e5e' },
  { id: 'green', name: 'Green', color: '#87a987' },
  { id: 'gray', name: 'Gray', color: '#9f9ea1' },
  { id: 'brown', name: 'Brown', color: '#8b5e46' },
  { id: 'black', name: 'Black', color: '#333333' },
  { id: 'purple', name: 'Purple', color: '#9B177E' },
  { id: 'multicolor', name: 'Multicolor', color: 'linear-gradient(90deg, #e8d9c7, #a4c2e3, #c25e5e, #87a987)' },
];

const sizeOptions  = [
  { value: "small", label: "Small (3' x 5')" },
  { value: "medium", label: "Medium (5' x 8')" },
  { value: "large", label: "Large (8' x 10')" },
  { value: "runner", label: "Runner (2' x 8')" },
  { value: "round", label: "Round (6' Diameter)" },
];

// const collectionOptions  = [
//   { value: "modern", label: "Modern" },
//   { value: "traditional", label: "Traditional" },
//   { value: "bohemian", label: "Bohemian" },
//   { value: "vintage", label: "Vintage" },
//   { value: "geometric", label: "Geometric" },
// ];

const FilterSidebar = ({ onFilterChange }) => {

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);

  const toggleMobileFilter = () => setIsMobileFilterOpen(!isMobileFilterOpen);

  const [categories, setCategories] = useState([]);  // categories from backend
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);



  // ...existing states
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    sizes: true,
    designers: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };


  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        console.log('Fetched categories:', data);
        if (res.ok) {
          setCategories(data.categories || data); // fallback in case categories key missing
        } else {
          console.error('Failed to load categories:', data.message);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
  
    fetchCategories();
  }, []);
  
  const handleCategoryChange = (categoryId, checked) => {
    let updatedCategories;
    if (checked) {
      updatedCategories = [...selectedCategories, categoryId];
    } else {
      updatedCategories = selectedCategories.filter(id => id !== categoryId);
    }
    setSelectedCategories(updatedCategories);
  
    // 👇 Apply filter immediately on desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: updatedCategories,
        colors: selectedColors,
        sizes: selectedSizes,
        designers: selectedDesigners
      });
    }
  };
  

  const handleColorChange = (colorId, checked) => {
    const colorName = colors.find(c => c.id === colorId)?.name;
    if (!colorName) return;
  
    let updatedColors;
    if (checked) {
      updatedColors = [...selectedColors, colorName];
    } else {
      updatedColors = selectedColors.filter(c => c !== colorName);
    }
    setSelectedColors(updatedColors);
  
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: updatedColors, // Now contains names instead of hex codes
        sizes: selectedSizes,
        designers: selectedDesigners
      });
    }
  };

  const handleSizeChange = (sizeId, checked) => {
    let updatedSizes;
    if (checked) {
      updatedSizes = [...selectedSizes, sizeId];
    } else {
      updatedSizes = selectedSizes.filter(id => id !== sizeId);
    }
    setSelectedSizes(updatedSizes);
  
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: selectedColors,
        sizes: updatedSizes,
      });
    }
  };

  const handleDesignerChange = (designerId, checked) => {
    let updatedDesigners;
    if (checked) {
      updatedDesigners = [...selectedDesigners, designerId];
    } else {
      updatedDesigners = selectedDesigners.filter(id => id !== designerId);
    }
    setSelectedDesigners(updatedDesigners);
  
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      onFilterChange({
        categories: selectedCategories,
        colors: selectedColors,
        sizes: selectedSizes,
        designers: updatedDesigners
      });
    }
  };


  

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      designers: selectedDesigners
      // priceRange
    });
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    // setPriceRange([0, 3000]);
    onFilterChange({
      categories: [],
      colors: [],
      sizes: [],
      designers: [],
      priceRange: [0, 3000]
    });
  };

  return (
    <aside className="bg-white p-4 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif font-semibold">Filters</h2>
        <button 
          onClick={resetFilters} 
          className="text-sm text-primary hover:underline"
        >
          Clear All
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["colors", "sizes", "collections"]} className="space-y-2">
        <AccordionItem value="colors">
          <AccordionTrigger className="text-lg font-medium">Colors</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {colors.map((color) => (
                <div key={color.name} className="flex items-center space-x-2">
                  {/* <Checkbox 
                    id={`color-${color.value}`}
                    checked={filters.colors.includes(color.value)}
                    onCheckedChange={() => handleColorChange(color.value)}
                  /> */}
                  <Checkbox 
                    id={`color-${color.id}`}
                    checked={selectedColors.includes(color.name)} 
                    onCheckedChange={(checked) => handleColorChange(color.id, checked )}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`color-${color.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {color.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* <AccordionItem value="sizes">
          <AccordionTrigger className="text-lg font-medium">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {sizeOptions.map((size) => (
                <div key={size.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`size-${size.value}`}
                    checked={filters.sizes.includes(size.value)}
                    onCheckedChange={() => handleSizeChange(size.value)}
                  />
                  <label 
                    htmlFor={`size-${size.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {size.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}

        <AccordionItem value="collections">
          <AccordionTrigger className="text-lg font-medium">Collections</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {categories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  {/* <Checkbox 
                    id={`collection-${collection.value}`}
                    checked={filters.collections.includes(collection.value)}
                    onCheckedChange={() => handleCollectionChange(collection.value)}
                  /> */}
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked )}
                    className="mr-2"
                  />
                  <label 
                    htmlFor={`collection-${category.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </aside>
  );
};

export default FilterSidebar;