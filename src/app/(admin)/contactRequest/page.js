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
import { Eye,  Pencil, Phone, Trash2 } from "lucide-react";
import Spinner from '@/components/Spinner';
import ViewContactModal from '@/components/ViewContactModal';
import withAuth from "@/lib/withAuth";
import { toast } from 'react-toastify';
import EditContactModal from '@/components/EditContactModal';

const ContactRequest = () => {
  
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(true);

const [viewModalOpen, setViewModalOpen] = useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);
const [selectedContact, setSelectedContact] = useState(null);
const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  // Update status after modal edit
  const handleStatusUpdated = (id, newStatus) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };




useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, []);


  const confirmDelete = (order) => {
    setSelectedContact(order);
    setOpenDeleteDialog(true);
  };


    // ! Delete Logic
  const handleDelete = async () => {
  if (!selectedContact) return;

  try {
    setLoading(true);
    const res = await fetch(`/api/contact/${selectedContact.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((r) => r.id !== selectedContact.id));
      toast.success("Contact Request deleted successfully!");
      setOpenDeleteDialog(false);
    } else {
      toast.error("Failed to delete contact request.");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Something went wrong while deleting.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-screen mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-forest-700" />
            <h1 className="text-3xl font-serif font-bold text-forest-800">Contact Request</h1>
          </div>
        </div>
        
        <div className="bg-white border border-forest-200 rounded-lg overflow-hidden">
          {loading ? (
               <Spinner />
               ) : messages.length === 0 ? (
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
                  <TableHead className="text-center">Subject</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">{msg.name}</TableCell>
                    <TableCell className="text-center">{msg.email}</TableCell>
                    <TableCell className="text-center">{msg.phone}</TableCell>
                    <TableCell className="text-center">{msg.subject}</TableCell>
                    <TableCell className="text-center">
                        {msg.status}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedContact(msg);
                            setViewModalOpen(true);
                          }}
                        >
                          <span className="sr-only">View</span>
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedContact(msg);
                            setEditModalOpen(true);
                          }}
                        >
                          <span className="sr-only">Edit</span>
                          <Pencil className="h-4 w-4" />
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
      </div>

      {/* View Modal */}
      <ViewContactModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        contact={selectedContact}
      />

      {/* View Modal */}
      <EditContactModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        contact={selectedContact}
        onContactUpdated={handleStatusUpdated}
      />


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
                {selectedContact?.email}
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
  );
}

export default withAuth(ContactRequest, [1]);