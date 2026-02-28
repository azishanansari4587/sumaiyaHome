"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { User, Package, Heart, ShoppingBag, LogOut, Settings, Home } from "lucide-react";

export default function Account() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Mock order data
  const orders = [
    {
      id: "ORD-12345",
      date: "2025-04-26",
      total: 1299.99,
      status: "Delivered",
      items: 3
    },
    {
      id: "ORD-12346",
      date: "2025-04-10",
      total: 799.50,
      status: "Shipped",
      items: 2
    },
    {
      id: "ORD-12347",
      date: "2025-03-15",
      total: 349.99,
      status: "Processing",
      items: 1
    }
  ];

  // Mock wishlist data
  const wishlist = [
    {
      id: 1,
      name: "Persian Royal Blue Carpet",
      price: 799.99,
      imageUrl: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Modern Geometric Rug",
      price: 349.99,
      imageUrl: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Traditional Oriental Carpet",
      price: 1299.99,
      imageUrl: "/placeholder.svg"
    }
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleRemoveWishlistItem = (id) => {
    toast({
      title: "Item Removed",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // In a real app, you would redirect to home page or login page
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-forest-700" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-800">My Account</h1>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Hidden on mobile */}
          <Card className="hidden lg:block lg:col-span-1 bg-sand-50 border-sand-200 h-fit">
            <CardContent className="p-4">
              <div className="space-y-1 pt-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-full bg-forest-200 flex items-center justify-center text-forest-700 text-xl font-bold">
                    JS
                  </div>
                  <div>
                    <h3 className="font-medium text-forest-800">{profileData.fullName}</h3>
                    <p className="text-sm text-forest-600">{profileData.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/user" className="flex items-center gap-2 p-2 rounded-md bg-forest-100 text-forest-800">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-2 p-2 rounded-md hover:bg-sand-100 text-forest-700">
                    <Package className="h-4 w-4" /> Orders
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-2 p-2 rounded-md hover:bg-sand-100 text-forest-700">
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 p-2 rounded-md hover:bg-sand-100 text-forest-700">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-sand-100 text-forest-700">
                    <Home className="h-4 w-4" /> Back to Home
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 overflow-x-auto">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4 text-forest-800">Personal Information</h3>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="fullName" className="text-sm font-medium text-forest-800">
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium text-forest-800">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium text-forest-800">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                      </div>

                      <h3 className="text-xl font-medium mb-2 mt-6 text-forest-800">Shipping Address</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <label htmlFor="address" className="text-sm font-medium text-forest-800">
                            Street Address
                          </label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="city" className="text-sm font-medium text-forest-800">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={profileData.city}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="state" className="text-sm font-medium text-forest-800">
                            State/Province
                          </label>
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={profileData.state}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="zipCode" className="text-sm font-medium text-forest-800">
                            ZIP/Postal Code
                          </label>
                          <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={profileData.zipCode}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="country" className="text-sm font-medium text-forest-800">
                            Country
                          </label>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            value={profileData.country}
                            onChange={handleProfileChange}
                            className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="bg-forest-700 hover:bg-forest-800"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4 text-forest-800">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-medium text-forest-800">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium text-forest-800">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-forest-800">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-forest-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-500"
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          className="bg-forest-700 hover:bg-forest-800"
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4 text-forest-800">Your Orders</h3>

                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-forest-200 rounded-md p-4">
                            <div className="flex flex-wrap items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-forest-800">Order #{order.id}</h4>
                                <p className="text-sm text-forest-600">Placed on {order.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-forest-800">${order.total.toFixed(2)}</p>
                                <p className="text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                                    {order.status}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-forest-700">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                              <div className="space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/orders/${order.id}`}>View Order</Link>
                                </Button>
                                {order.status === 'Delivered' && (
                                  <Button size="sm" variant="outline">
                                    Write Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-forest-300 mb-4" />
                        <h4 className="text-lg font-medium text-forest-800 mb-2">No orders yet</h4>
                        <p className="text-forest-600 mb-4">When you place orders, they will appear here</p>
                        <Button asChild className="bg-forest-700 hover:bg-forest-800">
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-medium mb-4 text-forest-800">Your Wishlist</h3>

                    {wishlist.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="border border-forest-200 rounded-md overflow-hidden group">
                            <div className="relative h-48">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <button
                                onClick={() => handleRemoveWishlistItem(item.id)}
                                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white text-forest-700"
                                aria-label="Remove from wishlist"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-forest-800 mb-1 truncate">{item.name}</h4>
                              <p className="font-bold text-forest-900 mb-3">${item.price.toFixed(2)}</p>
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-forest-700 hover:bg-forest-800 flex-1">
                                  Add to Cart
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1" asChild>
                                  <Link href={`/product/${item.id}`}>View</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 mx-auto text-forest-300 mb-4" />
                        <h4 className="text-lg font-medium text-forest-800 mb-2">Your wishlist is empty</h4>
                        <p className="text-forest-600 mb-4">Save items you love to your wishlist</p>
                        <Button asChild className="bg-forest-700 hover:bg-forest-800">
                          <Link href="/products">Explore Products</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}