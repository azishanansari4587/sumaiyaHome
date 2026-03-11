"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, ShieldCheck, MapPin, Building, Briefcase } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        name: '',
        contact: '',
        address: '',
        city: '',
        state: '',
        businessType: ''
    });
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
                setFormData({
                    first_name: data.user.first_name || '',
                    last_name: data.user.last_name || '',
                    name: data.user.name || '',
                    contact: data.user.contact || '',
                    address: data.user.address || '',
                    city: data.user.city || '',
                    state: data.user.state || '',
                    businessType: data.user.businessType || data.user.business_type || ''
                });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to save profile");

            // Refetch Profile after save
            const verifyRes = await fetch(`/api/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const verifyData = await verifyRes.json();
            setUser(verifyData.user);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            setError("Could not update profile.");
        } finally {
            setSaving(false);
        }
    };

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
                        <div className="flex-1">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{fullName}</h3>
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-400" /> Full Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                name="first_name" 
                                                value={formData.first_name} 
                                                onChange={handleInputChange} 
                                                placeholder="First Name"
                                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                            />
                                            <input 
                                                type="text" 
                                                name="last_name" 
                                                value={formData.last_name} 
                                                onChange={handleInputChange} 
                                                placeholder="Last Name"
                                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                            />
                                        </div>
                                    ) : (
                                        fullName
                                    )}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" /> Email Address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.email} <span className="text-xs text-gray-400 ml-2">(Cannot be changed)</span>
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" /> Contact
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            name="contact" 
                                            value={formData.contact} 
                                            onChange={handleInputChange} 
                                            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                        />
                                    ) : (
                                        user.contact || "Not provided"
                                    )}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400" /> Address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleInputChange} 
                                            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                        />
                                    ) : (
                                        user.address || "Not provided"
                                    )}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Building className="h-4 w-4 text-gray-400" /> City / State
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                name="city" 
                                                value={formData.city} 
                                                onChange={handleInputChange} 
                                                placeholder="City"
                                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                            />
                                            <input 
                                                type="text" 
                                                name="state" 
                                                value={formData.state} 
                                                onChange={handleInputChange} 
                                                placeholder="State"
                                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                            />
                                        </div>
                                    ) : (
                                        [user.city, user.state].filter(Boolean).join(", ") || "Not provided"
                                    )}
                                </dd>
                            </div>

                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-gray-400" /> Business Type
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            name="businessType" 
                                            value={formData.businessType} 
                                            onChange={handleInputChange} 
                                            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2" 
                                        />
                                    ) : (
                                        user.businessType || user.business_type || "Not provided"
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
