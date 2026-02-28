// "use client";
// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import ContactForm, { formSchema } from "./ContactForm";
// import { toast } from "react-toastify";

// export default function EditContactModal({ open, onClose, contact, onContactUpdated }) {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: contact || {},
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const onSubmit = async (values) => {
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`/api/contact/${contact.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       if (!res.ok) throw new Error("Update failed");

//       toast.success("Contact updated successfully");
//       onContactUpdated(contact.id, values);
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update contact");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-xl">
//         <DialogHeader>
//           <DialogTitle>✏️ Edit Contact</DialogTitle>
//         </DialogHeader>
//         <ContactForm form={form} onSubmit={onSubmit} disabled={isSubmitting} />
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContactForm, { formSchema } from "@/components/ContactForm";
import { toast } from "react-toastify";

export default function EditContactModal({ open, onClose, contact, onContactUpdated }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: contact || {},
  });

  useEffect(() => {
    if (contact) form.reset(contact);
  }, [contact, form]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/contact/${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast.success("Contact updated successfully!");
      onContactUpdated(contact.id, values);
      onClose();
    } catch {
      toast.error("Failed to update contact!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <ContactForm form={form} onSubmit={onSubmit} isAdmin disabled={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}

