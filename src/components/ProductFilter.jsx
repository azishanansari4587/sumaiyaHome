import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X, FilterIcon, Minus, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ For animation
import { Separator } from './ui/separator';

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

const ProductFilter = ({ onFilterChange }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
  });

  const toggleMobileFilter = () => {
    document.body.style.overflow = isMobileFilterOpen ? 'auto' : 'hidden'; // ✅ Prevent background scroll
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        setCategories(data.categories || data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (type, value, checked) => {
    const update = (list) =>
      checked ? [...list, value] : list.filter((v) => v !== value);

    let newFilters = {
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      designers: selectedDesigners,
    };

    if (type === 'category')
      newFilters.categories = update(selectedCategories);
    if (type === 'color') newFilters.colors = update(selectedColors);
    if (type === 'size') newFilters.sizes = update(selectedSizes);
    if (type === 'designer')
      newFilters.designers = update(selectedDesigners);

    setSelectedCategories(newFilters.categories);
    setSelectedColors(newFilters.colors);
    setSelectedSizes(newFilters.sizes);
    setSelectedDesigners(newFilters.designers);

    if (window.innerWidth >= 1024) onFilterChange(newFilters);
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      designers: selectedDesigners,
    });
    toggleMobileFilter();
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedDesigners([]);
    onFilterChange({
      categories: [],
      colors: [],
      sizes: [],
      designers: [],
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <button
          onClick={() => toggleSection('categories')}
          className="flex justify-between items-center w-full font-semibold text-lg mb-2"
        >
          <span>Categories</span>
          {openSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {openSections.categories && (
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                htmlFor={`category-${cat.id}`}
                className="flex items-center space-x-2 cursor-pointer text-sm"
              >
                <Checkbox
                  id={`category-${cat.id}`}
                  checked={selectedCategories.includes(cat.id)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('category', cat.id, checked)
                  }
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <Separator/>
      {/* Colors */}
      <div>
        <button
          onClick={() => toggleSection('colors')}
          className="flex justify-between items-center w-full font-semibold text-lg mb-2"
        >
          <span>Colors</span>
          {openSections.colors ? <ChevronUp  size={18} /> : <ChevronDown size={18} />}
        </button>
        {openSections.colors && (
          <div id="colors-section"  className="grid grid-cols-1 gap-2">
            {colors.map((color) => (
              <label
                key={color.id}
                htmlFor={`color-${color.id}`}
                className="flex items-center cursor-pointer text-sm"
              >
                <Checkbox
                  id={`color-${color.id}`}
                  checked={selectedColors.includes(color.name)}
                  onCheckedChange={(checked) =>
                    handleFilterChange('color', color.name, checked)
                  }
                />
                <span
                  className="w-4 h-4 rounded-full ml-2 border"
                  style={{ background: color.color }}
                ></span>
                <span className="ml-2">{color.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={toggleMobileFilter}
          className="w-full flex items-center justify-center gap-2"
        >
          <FilterIcon size={18} />
          Filters
        </Button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileFilter}
            />

            {/* Drawer */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-4/5 sm:w-3/5 bg-background z-50 p-4 shadow-lg overflow-y-auto rounded-l-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button variant="ghost" size="icon" onClick={toggleMobileFilter}>
                  <X size={22} />
                </Button>
              </div>
              <FilterContent />

              <div className="mt-8 space-y-3">
                <Button className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset All
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Filters</h2>
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-secondary"
            >
              Reset All
            </Button>
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
