// "use client"
// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import PhoneNumber from "./PhoneNumber";


// export const formSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   phone: z.string().optional(),
//   subject: z.string().min(2, { message: "Subject must be at least 2 characters" }),
//   message: z.string().min(10, { message: "Message must be at least 10 characters" }),
// });

// const ContactForm = ({  disabled = false }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       subject: "",
//       message: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     try {
//       setIsSubmitting(true);
//       console.log("Form data:", data);
//       toast.success("Message sent successfully!");
//       // 🔥 yahan API call ya email service add kar sakte ho
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send message!");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

 

//   return (
//     <div className="bg-white p-6 md:p-10 rounded-lg border border-border">
//       <h2 className="text-3xl font-serif font-medium mb-6">Send Us a Message</h2>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John Doe" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="john@example.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone (Optional)</FormLabel>
//                   <FormControl>
//                     <PhoneNumber {...field}/>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="subject"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Subject</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Order inquiry" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="message"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Message</FormLabel>
//                 <FormControl>
//                   <Textarea 
//                     placeholder="I'm interested in learning more about your handcrafted rugs..." 
//                     className="min-h-[150px]"
//                     {...field} 
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {!disabled && (
//             <Button type="submit" className="w-full md:w-auto">Submit Application</Button>
//           )}
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default ContactForm;

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form"; // ✅ Missing import added here
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PhoneNumber from "./PhoneNumber";

export const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(5),
  status: z.string().optional(), // ✅ Admin-only field
});

const ContactForm = ({ form, onSubmit, disabled = false, isAdmin = false }) => {
  // ✅ Use internal form if no form prop is passed
  const internalForm =
    form ||
    useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        status: "Pending",
      },
    });

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200">
      <Form {...internalForm}>
        <form onSubmit={internalForm.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <FormField
              control={internalForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={internalForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="john@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <FormField
              control={internalForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneNumber {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={internalForm.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="Order inquiry" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={internalForm.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={disabled}
                    placeholder="Type your message here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ Status dropdown only for Admin */}
          {isAdmin && (
            <FormField
              control={internalForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!disabled && (
            <Button type="submit" disabled={disabled}>
              {isAdmin ? "Update Status" : "Submit Message"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
