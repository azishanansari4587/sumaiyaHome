"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, ShieldCheck, MapPin, Building, Briefcase } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const userDataStr = localStorage.getItem("user");

                if (!token || !userDataStr) {
                    router.push("/signin");
                    return;
                }

                const userData = JSON.parse(userDataStr);
                const userId = userData.id;

                if (!userId) {
                    throw new Error("Invalid user session");
                }

                const res = await fetch(`/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>;
    if (error) return <div className="min-h-[60vh] flex items-center justify-center text-red-500">{error}</div>;
    if (!user) return null;

    const fullName = user.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "N/A";

    return (
        <div className="min-h-[80vh] bg-cream/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">My Profile</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        View your personal information and account details.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:px-6 flex items-center gap-4 bg-gray-50 border-b border-gray-100">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{fullName}</h3>
                            <p className="max-w-2xl text-sm text-gray-500">
                                {user.role === 1 ? "Administrator Account" : "Customer Account"}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" /> Full Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {fullName}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" /> Email Address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.email}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" /> Contact
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.contact || "Not provided"}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400" /> Address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.address || "Not provided"}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Building className="h-4 w-4 text-gray-400" /> City / State
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {[user.city, user.state].filter(Boolean).join(", ") || "Not provided"}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-gray-400" /> Business Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.businessType || "Not provided"}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-gray-400" /> Role
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.role === 1 ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            User
                                        </span>
                                    )}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" /> Member Since
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {new Date(user.created_at).toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </dd>
                            </div>

                        </dl>
                    </div>
                </div>

            </div>
        </div>
    );
}
