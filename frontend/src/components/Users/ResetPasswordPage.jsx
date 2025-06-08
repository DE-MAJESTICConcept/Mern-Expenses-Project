// import React, { useEffect } from "react";
// import { useFormik } from "formik";
// import { useMutation } from "@tanstack/react-query";
// import * as Yup from "yup";
// import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
// import { FaLock } from "react-icons/fa";
// import AlertMessage from "../Alert/AlertMessage"; // Adjust path if needed
// import { resetPasswordAPI } from "../../services/users/userService"; // You'll create this API function

// //! Validation schema for the new password inputs
// const validationSchema = Yup.object({
//   password: Yup.string()
//     .min(8, "Password must be at least 8 characters long") // Recommended minimum length
//     .required("New password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password'), null], 'Passwords must match') // Ensures passwords match
//     .required('Confirm password is required'),
// });

// const ResetPasswordPage = () => {
//   const { token } = useParams(); // Extract the token from the URL
//   const navigate = useNavigate();

//   // Mutation hook for sending password reset request
//   const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
//     mutationFn: ({ token, newPassword }) => resetPasswordAPI(token, newPassword),
//     mutationKey: ["reset-password"],
//     onSuccess: () => {
//       console.log("Password reset successfully!");
//       // Optionally, add a delay to show success message before redirecting
//       setTimeout(() => {
//         navigate('/login'); // Redirect to login page after successful reset
//       }, 2000);
//     },
//     onError: (err) => {
//       console.error("Error resetting password:", err);
//     },
//   });

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema,
//     onSubmit: (values) => {
//       mutateAsync({ token, newPassword: values.password }); // Pass token and new password to mutation
//     },
//   });

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
//         <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
//           Reset Your Password
//         </h2>
//         <p className="text-sm text-center text-gray-500 mb-6">
//           Enter and confirm your new password below.
//         </p>

//         {/* Display messages */}
//         {isPending && <AlertMessage type="loading" message="Resetting password..." />}
//         {isError && (
//           <AlertMessage
//             type="error"
//             message={error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."}
//           />
//         )}
//         {isSuccess && (
//           <AlertMessage
//             type="success"
//             message="Password reset successfully! Redirecting to login..."
//           />
//         )}

//         <form onSubmit={formik.handleSubmit} className="space-y-6">
//           {/* New Password Field */}
//           <div className="relative">
//             <FaLock className="absolute top-3 left-3 text-gray-400" />
//             <input
//               id="password"
//               type="password"
//               {...formik.getFieldProps("password")}
//               placeholder="New Password"
//               className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
//             />
//             {formik.touched.password && formik.errors.password && (
//               <span className="text-xs text-red-500 mt-1 block">{formik.errors.password}</span>
//             )}
//           </div>

//           {/* Confirm New Password Field */}
//           <div className="relative">
//             <FaLock className="absolute top-3 left-3 text-gray-400" />
//             <input
//               id="confirmPassword"
//               type="password"
//               {...formik.getFieldProps("confirmPassword")}
//               placeholder="Confirm New Password"
//               className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
//             />
//             {formik.touched.confirmPassword && formik.errors.confirmPassword && (
//               <span className="text-xs text-red-500 mt-1 block">{formik.errors.confirmPassword}</span>
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
//             {isPending ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;
