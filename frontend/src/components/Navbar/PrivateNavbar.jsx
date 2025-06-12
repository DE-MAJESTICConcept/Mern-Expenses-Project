import React, { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Removed BellIcon as it's not used
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5"; // Your logout icon
import { SiAuthy } from "react-icons/si"; // Your logo icon
import { logoutAction } from "../../redux/slice/authSlice";

// Helper function to conditionally apply classes
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
  //Dispatch
  const dispatch = useDispatch();

  //Logout handler
  const logoutHandler = () => {
    dispatch(logoutAction());
    //remove the user from storage
    localStorage.removeItem("userInfo");
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-lg py-2 md:py-3 fixed w-full top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 transition-colors duration-200">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-8 w-8 text-purple-600" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-8 w-8 text-gray-600" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  {/* Logo */}
                  <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors duration-200">
                    <SiAuthy className="h-10 w-auto text-teal-500 transform hover:scale-110 transition-transform duration-220" />
                    <span className="text-gray-800 text-xl md:text-2xl tracking-tight">OTZAR</span>
                  </Link>
                </div>
           
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-500 transition-all duration-250 ease-in-out"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/add-transaction"
                    className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-500 transition-all duration-250 ease-in-out"
                  >
                    Add Transaction
                  </Link>
                  <Link
                    to="/chatbot"
                    className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-500 transition-all duration-250 ease-in-out"
                  >
                    Chatbot
                  </Link>
                  <Link
                    to="/add-category"
                    className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-500 transition-all duration-250 ease-in-out"
                  >
                    Add Category
                  </Link>
                  <Link
                    to="/categories"
                    className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-500 transition-all duration-250 ease-in-out"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-purple-700 border-b-2 border-transparent hover:border-purple-500 transition-all duration-250 ease-in-out"
                  >
                    Profile
                  </Link>
                </div>
              </div>

              {/* Desktop Logout Button */}
              <div className="flex items-center ml-auto">
                <div className="flex-shrink-0">
                  <button
                    onClick={logoutHandler}
                    type="button"
                    className="relative ml-2 inline-flex items-center gap-x-1.5 rounded-lg bg-red-600 px-5 py-2.5 text-base font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-all duration-250 ease-in-out transform hover:-translate-y-0.5"
                  >
                    <IoLogOutOutline className="h-5 w-5" aria-hidden="true" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navs private links - ENHANCED STYLING */}
          <Disclosure.Panel className="md:hidden origin-top-right transition-all duration-300 ease-out">
            <div className="space-y-2 px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 shadow-inner">
              {/* Home Link (Main Nav link) */}
              <Link to="/HeroSection">
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  OTZAR
                </Disclosure.Button>
              </Link>
              {/* Other Mobile Navigation Links */}
              <Link to="/add-transaction">
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  Add Transaction
                </Disclosure.Button>
              </Link>
              <Link to="/chatbot"> {/* Uncommented and styled */}
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  Chatbot
                </Disclosure.Button>
              </Link>
              <Link to="/add-category">
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  Add Category
                </Disclosure.Button>
              </Link>
              <Link to="/categories">
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  Categories
                </Disclosure.Button>
              </Link>
              <Link to="/profile">
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  Profile
                </Disclosure.Button>
              </Link>
              <Link to="/dashboard">
                <Disclosure.Button
                  as="a"
                  className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors duration-200"
                >
                  My Dashboard
                </Disclosure.Button>
              </Link>

              {/* Mobile Logout Button - Highly visible and separated */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Disclosure.Button
                  as="button"
                  onClick={logoutHandler}
                  className="block w-full text-center py-3 px-3 text-lg font-semibold text-white rounded-lg shadow-md bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <IoLogOutOutline className="h-6 w-6" aria-hidden="true" />
                  <span>Sign out</span>
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}





// import React, { Fragment, useEffect } from "react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { IoLogOutOutline } from "react-icons/io5"; // Your logout icon
// import { SiAuthy } from "react-icons/si"; // Your logo icon
// import { logoutAction } from "../../redux/slice/authSlice";

// // Helper function to conditionally apply classes
// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function PrivateNavbar() {
//   //Dispatch
//   const dispatch = useDispatch();

//   //Logout handler
//   const logoutHandler = () => {
//     dispatch(logoutAction());
//     //remove the user from storage
//     localStorage.removeItem("userInfo");
//   };

//   return (
//     <Disclosure as="nav" className="bg-white shadow-lg py-2 md:py-3 fixed w-full top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 justify-between items-center">
//               {/* Corrected: Removed justify-center and w-full from this div */}
//               <div className="flex items-center"> {/* Adjusted width for mobile centering of logo, reset for desktop */}
//                 <div className="-ml-2 mr-2 flex items-center md:hidden">
//                   {/* Mobile menu button */}
//                   <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200">
//                     <span className="absolute -inset-0.5" />
//                     <span className="sr-only">Open main menu</span>
//                     {open ? (
//                       <XMarkIcon className="block h-8 w-8 text-indigo-600" aria-hidden="true" />
//                     ) : (
//                       <Bars3Icon className="block h-8 w-8 text-gray-600" aria-hidden="true" />
//                     )}
//                   </Disclosure.Button>
//                 </div>
//                 <div className="flex flex-shrink-0 items-center">
//                   {/* Logo */}
//                   <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
//                     <SiAuthy className="h-10 w-auto text-green-500 transform hover:scale-110 transition-transform duration-220" />
//                     <span className="text-gray-800 text-xl md:text-2xl tracking-tight">OTZAR</span>
//                   </Link>
//                 </div>
//                 {/* Desktop navigation links are now grouped more tightly */}
//                 <div className="hidden md:ml-6 md:flex md:space-x-8">
//                   <Link
//                     to="/dashboard"
//                     className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-indigo-500 transition-all duration-250 ease-in-out"
//                   >
//                     Dashboard
//                   </Link>
//                   <Link
//                     to="/add-transaction"
//                     className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-indigo-500 transition-all duration-250 ease-in-out"
//                   >
//                     Add Transaction
//                   </Link>
//                   {/* <Link
//                     to="/chatBot"
//                     className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-indigo-500 transition-all duration-250 ease-in-out"
//                   >
//                     Chatbot
//                   </Link> */}
//                   <Link
//                     to="/add-category"
//                     className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-indigo-500 transition-all duration-250 ease-in-out"
//                   >
//                     Add Category
//                   </Link>
//                   <Link
//                     to="/categories"
//                     className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-indigo-500 transition-all duration-250 ease-in-out"
//                   >
//                     Categories
//                   </Link>
//                   <Link
//                     to="/profile"
//                     className="inline-flex items-center px-1 pt-1 text-base font-semibold text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-indigo-500 transition-all duration-250 ease-in-out"
//                   >
//                     Profile
//                   </Link>
//                 </div>
//               </div>

//               {/* Desktop Logout Button */}
//               <div className="flex items-center ml-auto">
//                 <div className="flex-shrink-0">
//                   <button
//                     onClick={logoutHandler}
//                     type="button"
//                     className="relative ml-2 inline-flex items-center gap-x-1.5 rounded-lg bg-red-600 px-5 py-2.5 text-base font-semibold text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-all duration-250 ease-in-out transform hover:-translate-y-0.5"
//                   >
//                     <IoLogOutOutline className="h-5 w-5" aria-hidden="true" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Navs private links - ENHANCED STYLING */}
//           <Disclosure.Panel className="md:hidden origin-top-right transition-all duration-300 ease-out">
//             <div className="space-y-2 px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 shadow-inner">
//               {/* Home Link (Main Nav link) */}
//               <Link to="/HeroSection">
//                 <Disclosure.Button
//                   as="a"
//                   className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
//                 >
//                  OTZAR
//                 </Disclosure.Button>
//               </Link>
//               {/* Other Mobile Navigation Links */}
//               <Link to="/add-transaction">
//                 <Disclosure.Button
//                   as="a"
//                   className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
//                 >
//                   Add Transaction
//                 </Disclosure.Button>
             
//               </Link>
//               <Link to="/add-category">
//                 <Disclosure.Button
//                   as="a"
//                   className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
//                 >
//                   Add Category
//                 </Disclosure.Button>
//               </Link>
//               <Link to="/categories">
//                 <Disclosure.Button
//                   as="a"
//                   className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
//                 >
//                   Categories
//                 </Disclosure.Button>
//               </Link>
//               <Link to="/profile">
//                 <Disclosure.Button
//                   as="a"
//                   className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
//                 >
//                   Profile
//                 </Disclosure.Button>
//               </Link>
//               <Link to="/dashboard">
//                 <Disclosure.Button
//                   as="a"
//                   className="block w-full text-left py-3 pl-3 pr-4 text-lg font-semibold text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
//                 >
//                   My Dashboard
//                 </Disclosure.Button>
//               </Link>

//               {/* Mobile Logout Button - Highly visible and separated */}
//               <div className="border-t border-gray-200 mt-4 pt-4">
//                 <Disclosure.Button
//                   as="button"
//                   onClick={logoutHandler}
//                   className="block w-full text-center py-3 px-3 text-lg font-semibold text-white rounded-lg shadow-md bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
//                 >
//                   <IoLogOutOutline className="h-6 w-6" aria-hidden="true" />
//                   <span>Sign out</span>
//                 </Disclosure.Button>
//               </div>
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }




