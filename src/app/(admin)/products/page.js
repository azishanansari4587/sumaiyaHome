"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Ensure you have this or use simple div
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Package,
  CheckCircle2,
  AlertCircle,
  Filter
} from "lucide-react";
import withAuth from "@/lib/withAuth";
import Image from 'next/image';

const ViewProducts = () => {
  const { toast } = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch Collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collections?all=true");
        const data = await res.json();
        setCollections([{ id: "all", name: "All Collections" }, ...data]);
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    fetchCollections();
  }, []);

  // Safe Parse Helper
  const safeParse = (value, fallback = []) => {
    try {
      if (!value) return fallback;
      if (typeof value === "string") return JSON.parse(value);
      if (Array.isArray(value)) return value;
      return fallback;
    } catch {
      return fallback;
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product?all=true");
      const data = await res.json();

      if (res.ok) {
        const formatted = data.products.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: p.images?.[0] || "/placeholder.svg",
          collectionId: p.collectionId,
          inStock: p.inStock == 1,
          active: p.isActive == 1,
          code: p.code || "N/A"
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollection = collectionFilter === "all" || product.collectionId.toString() === collectionFilter;
    return matchesSearch && matchesCollection;
  });

  // Handle Delete
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/product?id=${productToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        toast({ title: "Deleted", description: "Product deleted successfully", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Handle Toggle Active
  const handleToggleActive = (id, currentState) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, active: !currentState } : product
    ));
    // In real app, make API call here
    toast({
      title: currentState ? "Hidden" : "Visible",
      description: `Product is now ${currentState ? 'inactive' : 'active'}.`,
    });
  };

  // Stats for the top cards
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const outOfStock = products.filter(p => !p.inStock).length;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your product catalog, inventory, and listings.</p>
          </div>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-md transition-all hover:-translate-y-0.5">
            <Link href="/products/addProduct" className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add New Product
            </Link>
          </Button>
        </div>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Listings</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Out of Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* --- Filters & Search --- */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
              >
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[100px] pl-6">Product</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">Loading products...</TableCell>
                  </TableRow>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                      <TableCell className="pl-6">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                          <Image
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 line-clamp-1">{product.name}</span>
                          <span className="text-xs text-gray-500 font-mono">Code: {product.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {collections.find((col) => col.id === product.collectionId)?.name || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <button
                          onClick={() => handleToggleActive(product.id, product.active)}
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium border transition-all
                            ${product.active
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }
                          `}
                        >
                          {product.active ? 'Active' : 'Draft'}
                        </button>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50" asChild>
                            <Link href={`/products/${product.id}`} title="View">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button> */}
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50" asChild>
                            <Link href={`/products/editProduct/${product.slug}`} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => confirmDelete(product)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Package className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-lg font-medium text-gray-900">No products found</p>
                        <p className="text-sm">Try adjusting your search or filter.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer (Static for now) */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredProducts.length}</span> results
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
              This action cannot be undone and will remove the product from your store.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default withAuth(ViewProducts, [1]);