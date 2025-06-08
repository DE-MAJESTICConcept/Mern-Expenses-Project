// import React, { useEffect } from "react";
// import { useFormik } from "formik";
// import { useMutation } from "@tanstack/react-query";
// import * as Yup from "yup";
// import { FaEnvelope } from "react-icons/fa";
// import AlertMessage from "../Alert/AlertMessage"; // Adjust path if needed
// import { initiatePasswordResetAPI } from "../../services/users/userService"; // You'll need to create this API function

// //! Validation schema for the email input
// const validationSchema = Yup.object({
//   email: Yup.string().email("Invalid email address").required("Email is required"),
// });

// const ForgotPasswordPage = () => {
//   // Mutation hook for sending password reset request
//   const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
//     mutationFn: initiatePasswordResetAPI,
//     mutationKey: ["forgot-password"],
//     onSuccess: () => {
//       console.log("Password reset email sent successfully!");
//       // Optionally, display a success message and then prevent re-submission for a bit
//     },
//     onError: (err) => {
//       console.error("Error initiating password reset:", err);
//     },
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       mutateAsync(values.email); // Pass just the email string to the API
//     },
//   });

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
//           Forgot Password?
//         </h2>
//         <p className="text-sm text-center text-gray-500 mb-6">
//           Enter your email address below and we'll send you a link to reset your password.
//         </p>

//         {/* Display messages */}
//         {isPending && <AlertMessage type="loading" message="Sending reset link..." />}
//         {isError && (
//           <AlertMessage
//             type="error"
//             message={error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."}
//           />
//         )}
//         {isSuccess && (
//           <AlertMessage
//             type="success"
//             message="If an account with that email exists, a password reset link has been sent to your inbox."
//           />
//         )}

//         <form onSubmit={formik.handleSubmit} className="space-y-6">
//           {/* Input Field - Email */}
//           <div className="relative">
//             <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
//             <input
//               id="email"
//               type="email"
//               {...formik.getFieldProps("email")}
//               placeholder="Your Email Address"
//               className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <span className="text-xs text-red-500 mt-1 block">{formik.errors.email}</span>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isPending}
//             className={`w-full py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white transition duration-150 ease-in-out ${
//               isPending
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//             }`}
//           >
//             {isPending ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;
