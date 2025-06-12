import { Fragment } from "react";
import { Disclosure } from "@headlessui/react"; // Removed Menu, Transition, BellIcon, PlusIcon, FaBlog as they are not used
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SiAuthy } from "react-icons/si";
import { RiLoginCircleLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center"> {/* Added items-center for vertical alignment */}
              <div className="flex items-center">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"> {/* Changed focus ring to purple */}
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  {/* Logo */}
                  <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors duration-200"> {/* Added Link to logo, styled hover */}
                    <SiAuthy className="h-8 w-auto text-teal-500" /> {/* Changed logo color to teal */}
                    <span className="text-gray-800 text-xl md:text-2xl tracking-tight">OTZAR</span> {/* Added OTZAR text */}
                  </Link>
                </div>
                {/* Desktop navigation links */}
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center border-b-2 border-transparent hover:border-purple-500 px-1 pt-1 text-sm font-medium text-gray-700 hover:text-purple-700 transition-all duration-250 ease-in-out" // Adjusted colors and hover
                  >
                    Home
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link
                    to="/register"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors duration-200" // Changed register button color
                  >
                    <FaRegUser className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="relative ml-2 inline-flex items-center gap-x-1.5 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors duration-200" // Changed login button color
                  >
                    <RiLoginCircleLine
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link to="/">
                <Disclosure.Button
                  as="a"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-300 hover:bg-gray-50 hover:text-purple-700 sm:pl-5 sm:pr-6 transition-colors duration-200" // Adjusted colors and hover
                >
                  Home
                </Disclosure.Button>
              </Link>
              <Link to="/register">
                <Disclosure.Button
                  as="a"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-300 hover:bg-gray-50 hover:text-purple-700 sm:pl-5 sm:pr-6 transition-colors duration-200" // Adjusted colors and hover
                >
                  Register
                </Disclosure.Button>
              </Link>
              <Link to="/login">
                <Disclosure.Button
                  as="a"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-300 hover:bg-gray-50 hover:text-purple-700 sm:pl-5 sm:pr-6 transition-colors duration-200" // Adjusted colors and hover
                >
                  Login
                </Disclosure.Button>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}import { Fragment } from "react";
import { Disclosure } from "@headlessui/react"; // Removed Menu, Transition, BellIcon, PlusIcon, FaBlog as they are not used
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SiAuthy } from "react-icons/si";
import { RiLoginCircleLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center"> {/* Added items-center for vertical alignment */}
              <div className="flex items-center">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"> {/* Changed focus ring to purple */}
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  {/* Logo */}
                  <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors duration-200"> {/* Added Link to logo, styled hover */}
                    <SiAuthy className="h-8 w-auto text-teal-500" /> {/* Changed logo color to teal */}
                    <span className="text-gray-800 text-xl md:text-2xl tracking-tight">OTZAR</span> {/* Added OTZAR text */}
                  </Link>
                </div>
                {/* Desktop navigation links */}
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center border-b-2 border-transparent hover:border-purple-500 px-1 pt-1 text-sm font-medium text-gray-700 hover:text-purple-700 transition-all duration-250 ease-in-out" // Adjusted colors and hover
                  >
                    Home
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link
                    to="/register"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors duration-200" // Changed register button color
                  >
                    <FaRegUser className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="relative ml-2 inline-flex items-center gap-x-1.5 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors duration-200" // Changed login button color
                  >
                    <RiLoginCircleLine
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <Link to="/">
                <Disclosure.Button
                  as="a"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-300 hover:bg-gray-50 hover:text-purple-700 sm:pl-5 sm:pr-6 transition-colors duration-200" // Adjusted colors and hover
                >
                  Home
                </Disclosure.Button>
              </Link>
              <Link to="/register">
                <Disclosure.Button
                  as="a"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-300 hover:bg-gray-50 hover:text-purple-700 sm:pl-5 sm:pr-6 transition-colors duration-200" // Adjusted colors and hover
                >
                  Register
                </Disclosure.Button>
              </Link>
              <Link to="/login">
                <Disclosure.Button
                  as="a"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-purple-300 hover:bg-gray-50 hover:text-purple-700 sm:pl-5 sm:pr-6 transition-colors duration-200" // Adjusted colors and hover
                >
                  Login
                </Disclosure.Button>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}




// import { Fragment } from "react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { SiAuthy } from "react-icons/si";
// import { RiLoginCircleLine } from "react-icons/ri";
// import { FaRegUser } from "react-icons/fa";
// import { PlusIcon } from "@heroicons/react/20/solid";
// import { Link } from "react-router-dom";
// import { FaBlog } from "react-icons/fa";

// export default function PublicNavbar() {
//   return (
//     <Disclosure as="nav" className="bg-white shadow">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 justify-between">
//               <div className="flex">
//                 <div className="-ml-2 mr-2 flex items-center md:hidden">
//                   {/* Mobile menu button */}
//                   <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
//                     <span className="absolute -inset-0.5" />
//                     <span className="sr-only">Open main menu</span>
//                     {open ? (
//                       <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                     ) : (
//                       <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                     )}
//                   </Disclosure.Button>
//                 </div>
//                 <div className="flex flex-shrink-0 items-center">
//                   {/* Logo */}
//                   <SiAuthy className="h-8 w-auto text-green-500" />
//                 </div>
//                 <div className="hidden md:ml-6 md:flex md:space-x-8">
//                   <Link
//                     to="/"
//                     className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
//                   >
//                   OTZAR
//                   </Link>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <div className="flex-shrink-0">
//                   <Link
//                     to="/register"
//                     className="relative inline-flex items-center gap-x-1.5 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
//                   >
//                     <FaRegUser className="-ml-0.5 h-5 w-5" aria-hidden="true" />
//                     Register
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="relative ml-2 inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 animate-bounce"
//                   >
//                     <RiLoginCircleLine
//                       className="-ml-0.5 h-5 w-5"
//                       aria-hidden="true"
//                     />
//                     Login
//                   </Link>
//                 </div>
//                 <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
//                   <button
//                     type="button"
//                     className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                   >
//                     <span className="absolute -inset-1.5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Disclosure.Panel className="md:hidden">
//             <div className="space-y-1 pb-3 pt-2">
//               <Link to="/">
//                 <Disclosure.Button
//                   as="button"
//                   className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
//                 >
//                   MasyncTracker
//                 </Disclosure.Button>
//               </Link>

//               <Link to="/register">
//                 <Disclosure.Button
//                   as="button"
//                   className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
//                 >
//                   Register
//                 </Disclosure.Button>
//               </Link>
//               <Link to="/login">
//                 <Disclosure.Button
//                   as="button"
//                   className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
//                 >
//                   Login
//                 </Disclosure.Button>
//               </Link>
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }
