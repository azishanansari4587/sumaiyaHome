"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PartnerForm from "./PartnerForm"; // ✅ Your form component

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

// ✅ Zod schema for status-only (basic)
const formSchema = z.object({
  companyName: z.string(),
  contactName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().optional(),
  businessType: z.string(),
  message: z.string(),
  termsAccepted: z.boolean(),
  Status: z.enum(["Pending", "Approved", "Rejected"]),
});

export default function EditPartnerForm({
  open,
  onClose,
  partner,
  onStatusUpdated,
}) {

  const form = useForm({
    resolver: zodResolver(formSchema),
      defaultValues: {
        ...partner,
        Status: partner?.Status ?? "Pending", // 👈 fallback if Status is missing
      },
  });

  // Sync default values when partner changes
  useEffect(() => {
    if (partner) {
      form.reset(partner);
    }
  }, [partner, form]);

  const handleSubmit = async (values) => {
    try {
      const res = await fetch(`/api/partner/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: values.Status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast("Partner status updated");

      onStatusUpdated(partner.id, values.Status);
      onClose();
    } catch (err) {
      console.error(err);
      toast("Could not update partner status.",);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Partner</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <PartnerForm form={form} disabled={true} />

          {/* Status Field Outside Form (Editable) */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={form.watch("Status")}
              onValueChange={(value) => form.setValue("Status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">⏳ Pending</SelectItem>
                <SelectItem value="Approved">✅ Approved</SelectItem>
                <SelectItem value="Rejected">❌ Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={form.handleSubmit(handleSubmit)}>Save</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
