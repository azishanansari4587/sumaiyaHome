"use client"
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Heart, User, LayoutDashboard, UserCircle, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import useWishlistStore from "@/store/useWishlistStore"
import useCartStore from "@/store/cartStore";
import { Badge } from './ui/badge';
import Logo1 from "../assets/Logo1.png";
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.id) {
          setIsLoggedIn(true);
          setUserData(decoded);
        }
      } catch (err) {
        console.error("Invalid token");
        setIsLoggedIn(false);
        setUserData(null);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    router.push("/signin");
    setIsMenuOpen(false);
  };

  const wishlist = useWishlistStore((state) => state.wishlist)
  const cart = useCartStore((state) => state.cart)

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${value}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* <h1 className="text-2xl font-serif font-bold text-primary">Sumaiya & Home</h1> */}
            <Image src={Logo1} alt='' width={160} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/rugs" className="text-foreground hover:text-primary text-gray-600 font-normal">Rugs</Link>
            <Link href="/remnant" className="text-foreground hover:text-primary text-gray-600 font-normal">Remnant</Link>
            <Link href="/decor" className="text-foreground hover:text-primary text-gray-600 font-normal">Decor</Link>
            <Link href="/outdoor" className="text-foreground hover:text-primary text-gray-600 font-normal">Outdoor</Link>
            <Link href="/about" className="text-foreground hover:text-primary text-gray-600 font-normal">About Us</Link>
            {/* <Link href="/contact" className="text-foreground hover:text-primary font-medium">Contact</Link>
            <Link href="/customize" className="text-foreground hover:text-primary font-medium">Customize</Link> */}

          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Dropdown */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
                <Search size={20} className="text-gray-600" />
              </Button>
              {showSearch && (
                <div className="absolute top-[120%] right-0 w-[300px] md:w-[400px] bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search for rugs, decor..."
                        className="w-full pl-9 pr-4 py-2 border-none focus:ring-0 text-sm bg-gray-50 rounded-md outline-none"
                      />
                      {query && (
                        <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {query && (
                    <div className="max-h-[400px] overflow-y-auto w-full bg-white">
                      {isSearching ? (
                        <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                      ) : results.length > 0 ? (
                        <div className="flex flex-col">
                          {results.map((product) => {
                            const images = JSON.parse(product.images || "[]");
                            const imageSrc = images.length > 0 ? images[0] : "/placeholder.jpg";
                            return (
                              <Link
                                href={`/product/${product.slug}`}
                                key={product.id}
                                onClick={() => { setShowSearch(false); setQuery(''); setResults([]); }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors"
                              >
                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                  <Image src={imageSrc} alt={product.name} fill className="object-cover" />
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                  <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                                  <span className="text-xs text-gray-500 truncate">{product.code}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">No products found for "{query}"</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart size={20} />
              </Link>
            </Button> */}
            <Link href="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {wishlist?.length || 0}
                </Badge>
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {/* {cart.reduce((total, item) => total + item.quantity, 0)} */}
                  {cart.length}
                </Badge>
              </Button>
            </Link>

            <Link href="/partner" className="text-foreground hover:text-primary font-medium px-4">Open a trade Account</Link>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userData?.role === 1 && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/inquiries" className="cursor-pointer flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Inquiries</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button><Link href="/signin">Sign In</Link></Button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link href="/rugs" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal">Rugs</Link>
              <Link href="/remnant" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal">Remnant</Link>
              <Link href="/decor" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal">Decor</Link>
              <Link href="/outdoor" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal">Outdoor</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal">About Us</Link>
              <Link href="/partner" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal">Open a Trade Account</Link>
            </nav>
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-border">
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="w-5 h-5" />
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlist?.length || 0}
                  </Badge>
                </Button>
              </Link>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cart.length}
                  </Badge>
                </Button>
              </Link>
            </div>

            <div className="mt-4 w-full">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-2 w-full pt-2">
                  <span className="text-sm font-semibold px-4 text-muted-foreground">My Account</span>
                  {userData?.role === 1 && (
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-secondary rounded flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Link>
                  )}
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-secondary rounded flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" /> Profile
                  </Link>
                  <Link href="/inquiries" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 hover:bg-secondary rounded flex items-center">
                    <Package className="mr-2 h-4 w-4" /> My Inquiries
                  </Link>
                  <button onClick={handleSignOut} className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded flex items-center">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <Button className="w-full mt-2" onClick={() => setIsMenuOpen(false)} asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;