

// "use client";
// import { useSearchParams } from "next/navigation";
// import { useState } from "react";

// export default function ResetPassword() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [newPassword, setNewPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/reset-password", {
//       method: "POST",
//       body: JSON.stringify({ token, newPassword }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await res.json();
//     setMsg(data.message || data.error);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border rounded">
//       <h2 className="text-xl font-bold mb-4">Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="Enter new password"
//           className="w-full mb-3 p-2 border"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="w-full p-2 bg-green-600 text-white">
//           Reset Password
//         </button>
//       </form>
//       {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function ResetPassword() {
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  if (!token) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full mb-3 p-2 border"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full p-2 bg-green-600 text-white">
          Reset Password
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-700">{msg}</p>}
    </div>
  );
}

