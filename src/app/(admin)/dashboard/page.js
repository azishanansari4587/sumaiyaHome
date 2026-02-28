"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  Users,
  Mail,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Plus,
  Eye,
  FolderPlus,
  FolderOpen,
  Loader2,
  AlertCircle
} from "lucide-react";
import withAuth from "@/lib/withAuth";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Helper to format time ago
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
          <p className="text-forest-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-red-600">
          <AlertCircle className="h-8 w-8" />
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-forest-800">Admin Dashboard</h1>
          <p className="text-forest-600 mt-2">Welcome back, Admin</p>
        </div>

        {/* Stats Cards — Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-forest-800">
                <Package className="mr-2 h-4 w-4 text-forest-700" /> Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-900 mb-2">{data?.totalProducts ?? 0}</div>
              <CardDescription className="text-forest-600 flex items-center">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" /> Total active products
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-forest-800">
                <Layers className="mr-2 h-4 w-4 text-forest-700" /> Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-900 mb-2">{data?.totalCollections ?? 0}</div>
              <CardDescription className="text-forest-600">
                Total collections
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-forest-800">
                <Users className="mr-2 h-4 w-4 text-forest-700" /> Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-900 mb-2">{data?.totalUsers ?? 0}</div>
              <CardDescription className="text-forest-600 flex items-center">
                Registered users
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-forest-800">
                <ShoppingCart className="mr-2 h-4 w-4 text-forest-700" /> Enquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest-900 mb-2">{data?.totalOrders ?? 0}</div>
              <CardDescription className="text-forest-600 flex items-center">
                {data?.percentageChange !== undefined && (
                  <>
                    {data.percentageChange >= 0 ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    {Math.abs(data.percentageChange)}% vs last month
                  </>
                )}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards — Fixed Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-forest-800">Products Management</CardTitle>
                <Button asChild className="bg-primary hover:bg-forest-800">
                  <Link href="/products/addProduct" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Product
                  </Link>
                </Button>
              </div>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-forest-50 rounded-md border border-forest-100">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-3 text-forest-700" />
                    <div>
                      <h3 className="font-medium text-forest-800">View All Products</h3>
                      <p className="text-sm text-forest-600">See, edit and manage your products</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-forest-300" asChild>
                    <Link href="/products" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-forest-50 rounded-md border border-forest-100">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-3 text-forest-700" />
                    <div>
                      <h3 className="font-medium text-forest-800">Enquiries</h3>
                      <p className="text-sm text-forest-600">Check customer enquiries</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-forest-300" asChild>
                    <Link href="/enquiry" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-forest-800">Collections Management</CardTitle>
                <Button asChild className="bg-primary hover:bg-forest-800">
                  <Link href="/collections/addCollection" className="flex items-center gap-2">
                    <FolderPlus className="h-4 w-4" /> Add Collection
                  </Link>
                </Button>
              </div>
              <CardDescription>Manage your product collections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-forest-50 rounded-md border border-forest-100">
                  <div className="flex items-center">
                    <FolderOpen className="h-5 w-5 mr-3 text-forest-700" />
                    <div>
                      <h3 className="font-medium text-forest-800">View All Collections</h3>
                      <p className="text-sm text-forest-600">See, edit and manage your collections</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-forest-300" asChild>
                    <Link href="/collections" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-forest-50 rounded-md border border-forest-100">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-forest-700" />
                    <div>
                      <h3 className="font-medium text-forest-800">Newsletter Subscribers</h3>
                      <p className="text-sm text-forest-600">View and export subscriber list</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-forest-300" asChild>
                    <Link href="/subscriber" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products — Dynamic, No Price */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-forest-800">Recently Updated Products</CardTitle>
            <CardDescription>The most recently updated products in your store</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.recentProducts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/editProduct/${product.slug}`}
                    className="border border-forest-200 rounded-md overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="h-40 bg-forest-100 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-forest-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-forest-800 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-forest-600 mb-2">Updated {timeAgo(product.updatedAt)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {product.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-forest-500">
                <Package className="h-12 w-12 text-forest-300 mb-3" />
                <p className="text-lg font-medium">No products yet</p>
                <p className="text-sm">Add your first product to see it here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, [1]);