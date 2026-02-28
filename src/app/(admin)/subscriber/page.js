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
import { Mail, Trash2} from "lucide-react";
import Spinner from '@/components/Spinner';
import withAuth from "@/lib/withAuth";
import { toast } from 'react-toastify';

const Subscriber = () => {
  
  const [subscribers, setSubscribers] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)

useEffect(() => { 
    const fetchSubscribers = async () => { 
      try { 
        setIsLoading(true);
        const response = await fetch('/api/subscriber'); 
        const data = await response.json(); 
        setSubscribers(data.subscribers);
      } catch (error) { 
        console.error('Error fetching subscribers:', error); 
      } finally {
      setIsLoading(false); // ✅ yaha loading khatam
      }
    }; 
    fetchSubscribers(); 
  }, []);


  // 🧩 Open confirmation dialog
  const confirmDelete = (sub) => {
    setSelectedSubscriber(sub)
    setOpenDialog(true)
  }

  // 🗑️ Actual delete function
  const handleDelete = async () => {
    if (!selectedSubscriber) return
    try {
      setIsLoading(true)
      const res = await fetch(`/api/subscriber/${selectedSubscriber.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setSubscribers((prev) =>
          prev.filter((r) => r.id !== selectedSubscriber.id)
        )
        setOpenDialog(false)
        toast.success("Subscriber deleted successfully!")
      } else {
        toast.error("Failed to delete subscriber.")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Something went wrong while deleting.")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-screen mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Newsletter Subscriber</h1>
          </div>
        </div>
        
        <div className="bg-white border border-forest-200 rounded-lg overflow-hidden">
          {isLoading ? (
               <Spinner />
               ) : subscribers.length === 0 ? (
               <div className="text-center py-8 text-forest-600">
                    No subscriber found.
               </div>
               ) : (
               <div className="overflow-x-auto">
               <Table className="px-4">
               <TableHeader>
                    <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {subscribers.map((msg) => (
                    <TableRow key={msg.id}>
                        <TableCell >{msg.email}</TableCell>
                        <TableCell>
                          {new Date(msg.created_at).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long", // August, September etc.
                            year: "numeric",
                          })}
                        </TableCell>
                         <TableCell className="text-right">
                         <div className="flex justify-end items-center gap-2">
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

          {/* ✅ Delete Confirmation Dialog */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[400px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-red-600">
                  Confirm Delete
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-black">
                    {selectedSubscriber?.email}
                  </span>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
}

export default withAuth(Subscriber, [1]);