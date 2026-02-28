"use client";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import ContactForm from "./ContactForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./ContactForm"; // Import same schema

export default function ViewContactModal({ open, onClose, contact }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: contact || {},
  });

    // 👇 useEffect to reset form when contact prop changes
  useEffect(() => {
    if (contact) {
      form.reset(contact);
    }
  }, [contact]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>👁️ View Contact</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <ContactForm form={form} disabled={true} />
        </Form>
      </DialogContent>
    </Dialog>
  );
}
