import axios from "axios";


// Login API
export const Loginservice = async (object) => {
  try {
    console.log("Payload Sent to API:", object); // Debugging step
    const response = await axios.post(`/auth/login`, object, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error;
  }
};


// Register API
// export const RegisterOnApp = async (object) => {
//   try {
//     const response = await axios.post(`/auth/signup`, object);
//     return response;
//   } catch (error) {
//     console.error("Signup API Error:", error);
//     throw error; // Rethrow to handle it in calling code
//   }
// };
