"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from 'next/link';
import {Eye, Pencil, Plus, Shapes, Trash2} from "lucide-react";
import Spinner from '@/components/Spinner';
import withAuth from "@/lib/withAuth";
import { toast } from 'react-toastify';

const CustomizeRequest = () => {
  
const [partners, setPartners] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedPartner, setSelectedPartner] = useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

useEffect(() => {
  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/customize");
      const data = await res.json();
      setPartners(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchPartners();
}, []);


const confirmDelete = (order) => {
    setSelectedPartner(order);
    setOpenDeleteDialog(true);
  };


    // ! Delete Logic
  const handleDelete = async () => {
  if (!selectedPartner) return;

  try {
    setLoading(true);
    const res = await fetch(`/api/contact/${selectedPartner.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setPartners((prev) => prev.filter((r) => r.id !== selectedPartner.id));
      toast.success("Customize Request deleted successfully!");
      setOpenDeleteDialog(false);
    } else {
      toast.error("Failed to delete customize request.");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Something went wrong while deleting.");
  } finally {
    setLoading(false);
  }
};

  const handleToggleStatus = (id, field, currentValue) => {
    // In a real app, would call API to update
    setPartners(partners.map(part => 
      part.id === id ? { ...part, [field]: !currentValue } : part
    ));
    
    let message = "";
    if (field === 'Status') {
      message = currentValue 
        ? "The collection has been hidden from your store." 
        : "The collection is now visible in your store.";
      
      toast({
        title: currentValue ? "Collection Deactivated" : "Collection Activated",
        description: message,
      });
    } else {
      message = currentValue 
        ? "The collection has been removed from featured." 
        : "The collection is now featured on your store.";
      
      toast({
        title: currentValue ? "Collection Unfeatured" : "Collection Featured",
        description: message,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-screen mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shapes className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Customize Request</h1>
          </div>
        </div>
        
        <div className="bg-white border border-forest-200 rounded-lg overflow-hidden">
          {loading ? (
               <Spinner />
               ) : partners.length === 0 ? (
               <div className="text-center py-8 text-forest-600">
                    No contact messages found.
               </div>
               ) : (
               <div className="overflow-x-auto">
               <Table className="px-4">
               <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Phone</TableHead>
                    <TableHead className="text-center">Budget</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {partners.map((msg) => (
                    <TableRow key={msg.id}>
                        <TableCell className="font-medium">{msg.name}</TableCell>
                         <TableCell className="text-center">{msg.email}</TableCell>
                         <TableCell className="text-center">{msg.phone}</TableCell>
                         <TableCell className="text-center">$ {msg.budget}</TableCell>
                         <TableCell className="text-center">
                         {msg.Status}
                         </TableCell>
                         <TableCell className="text-right">
                         <div className="flex justify-end items-center gap-2">
                         <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              asChild
                         >
                              <Link href={`/collections/${msg.id}`}>
                              <span className="sr-only">View</span>
                              <Eye className="h-4 w-4" />
                              </Link>
                         </Button>
                         <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              asChild
                         >
                              <Link href={`/admin/collections/edit/${msg.id}`}>
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-4 w-4" />
                              </Link>
                         </Button>
                         <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => confirmDelete(msg)}
                         >
                              <span className="sr-only">Delete</span>
                              <Trash2 className="h-4 w-4" />
                         </Button>
                         </div>
                         </TableCell>
                    </TableRow>
                    ))}
               </TableBody>
               </Table>
               </div>
          )}
        </div>

        {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-black">
                {selectedPartner?.email}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

export default withAuth(CustomizeRequest, [1]);