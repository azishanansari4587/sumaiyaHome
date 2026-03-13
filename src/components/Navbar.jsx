"use client"
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Heart, User, LayoutDashboard, UserCircle, LogOut, Package, ChevronDown } from 'lucide-react';
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
          <nav className="hidden md:flex space-x-8 items-center">
            <div className="relative group">
              <Link href="/rugs?category=All Rugs" className="flex items-center gap-1 text-foreground hover:text-primary text-gray-600 font-normal">
                Rugs <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-md shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                  <Link href="/rugs?category=All Rugs" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">All Rugs</Link>
                  <Link href="/rugs?category=Natural" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Natural</Link>
                  <Link href="/rugs?category=Machine Made" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Machine Made</Link>
                  <Link href="/rugs?category=Novelty" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Novelty</Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Link href="/remnant?category=Casa Residential" className="flex items-center gap-1 text-foreground hover:text-primary text-gray-600 font-normal">
                Remnant <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 pt-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-md shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                  <Link href="/remnant?category=Casa Resedential" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Casa Resedential</Link>
                  <Link href="/remnant?category=Casa Room Size" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Casa Room Size</Link>
                  <Link href="/remnant?category=Casa Commercial" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Casa Commercial</Link>
                  <Link href="/remnant?category=Pinnacle" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Pinnacle</Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Link href="/decor?category=Poufs" className="flex items-center gap-1 text-foreground hover:text-primary text-gray-600 font-normal">
                Decor <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 pt-4 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-md shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                  <Link href="/decor?category=Poufs" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Pouf</Link>
                  <Link href="/decor?category=Pillows" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Pillow</Link>
                  <Link href="/decor?category=Throws" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Throw</Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Link href="/outdoor?category=Tropical" className="flex items-center gap-1 text-foreground hover:text-primary text-gray-600 font-normal">
                Outdoor <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 pt-4 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-md shadow-lg border border-gray-100 p-2 flex flex-col gap-1">
                  <Link href="/outdoor?category=Tropical" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Tropical</Link>
                  <Link href="/outdoor?category=Beachbum" className="px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Beachbum</Link>
                </div>
              </div>
            </div>

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
            <nav className="flex flex-col space-y-4 px-2">
              <details className="group">
                <summary className="flex items-center justify-between text-foreground hover:text-primary text-gray-600 font-normal cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Rugs <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col space-y-3 mt-3 pl-4 border-l-2 border-gray-100 ml-1">
                  <Link href="/rugs?category=All Rugs" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">All Rugs</Link>
                  <Link href="/rugs?category=Natural" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Natural</Link>
                  <Link href="/rugs?category=Machine Made" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Machine Made</Link>
                  <Link href="/rugs?category=Novelty" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Novelty</Link>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between text-foreground hover:text-primary text-gray-600 font-normal cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Remnant <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col space-y-3 mt-3 pl-4 border-l-2 border-gray-100 ml-1">
                  <Link href="/remnant?category=Casa Resedential" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Casa Resedential</Link>
                  <Link href="/remnant?category=Casa Room Size" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Casa Room Size</Link>
                  <Link href="/remnant?category=Casa Commercial" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Casa Commercial</Link>
                  <Link href="/remnant?category=Pinnacle" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Pinnacle</Link>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between text-foreground hover:text-primary text-gray-600 font-normal cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Decor <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col space-y-3 mt-3 pl-4 border-l-2 border-gray-100 ml-1">
                  <Link href="/decor?category=Poufs" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Poufs</Link>
                  <Link href="/decor?category=Pillows" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Pillows</Link>
                  <Link href="/decor?category=Throws" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Throws</Link>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between text-foreground hover:text-primary text-gray-600 font-normal cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Outdoor <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col space-y-3 mt-3 pl-4 border-l-2 border-gray-100 ml-1">
                  <Link href="/outdoor?category=Tropical" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Tropical</Link>
                  <Link href="/outdoor?category=Beachbum" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-500 hover:text-primary">Beachbum</Link>
                </div>
              </details>

              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary text-gray-600 font-normal pt-1">About Us</Link>
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