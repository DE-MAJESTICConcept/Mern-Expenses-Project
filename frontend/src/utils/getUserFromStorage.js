
export const getUserFromStorage = () => {
  try {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      return userInfo.token; // Assuming your user info object stores the token directly
    }
  } catch (e) {
    console.error("Error parsing user info from local storage", e);
    // You might want to clear localStorage here if it's corrupted
    localStorage.removeItem("userInfo");
  }
  return null; // Return null if no user info or token found
};
