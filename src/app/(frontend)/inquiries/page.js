"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, Image as ImageIcon } from "lucide-react";
import Spinner from "@/components/Spinner";
import Image from "next/image";

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    router.push("/signin");
                    return;
                }

                const res = await fetch(`/api/myEnquiry`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch inquiries");
                }

                const data = await res.json();
                setInquiries(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, [router]);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>;
    if (error) return <div className="min-h-[60vh] flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-[80vh] bg-cream/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                        <Package className="h-8 w-8 text-primary" /> My Inquiries
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Track the status of your past product inquiries and requests.
                    </p>
                </div>

                {/* Inquiries List */}
                {inquiries.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No inquiries yet</h3>
                        <p>You haven&apos;t made any product inquiries. Browse our products and add them to your cart to inquire.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
                                {/* Inquiry Header */}
                                <div className="bg-gray-50 px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Inquiry #{inquiry.id}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                                                    year: 'numeric', month: 'long', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${inquiry.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                inquiry.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {inquiry.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                {/* Inquiry Items */}
                                <div className="px-4 py-5 sm:p-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Products Inquired</h4>
                                    <ul className="divide-y divide-gray-200">
                                        {inquiry.cartItems && inquiry.cartItems.map((item, index) => (
                                            <li key={index} className="py-4 flex items-start gap-4">
                                                <div className="relative h-16 w-16 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt="Product"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">Product ID: {item.productId}</p>
                                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                                        {item.color && <span>Color: {item.color}</span>}
                                                        {item.size && <span>Size: {item.size}</span>}
                                                        <span>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
