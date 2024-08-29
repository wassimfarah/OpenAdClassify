import axios, { AxiosRequestConfig, Method } from 'axios';

// Define a type for the API request parameters
interface ApiRequestParams {
  method: Method;
  url: string;
  data?: any; // Optional, for POST/PUT requests
  config?: AxiosRequestConfig; // Optional, for custom Axios configurations
  useCredentials?: boolean; // Optional, to set withCredentials
}

// Create the apiRequest function
export const apiRequest = async ({
  method,
  url,
  data,
  config,
  useCredentials = false,
}: ApiRequestParams) => {
  // Create a default configuration object
  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    data,
    withCredentials: useCredentials, // Set withCredentials based on the parameter
    ...config, // Merge with custom configuration if provided
  };

  try {
    // Make the API request
    const response = await axios(axiosConfig);
    return response.data; // Return the response data
  } catch (error) {
    // Handle and throw error as needed
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
    throw new Error('An unknown error occurred');
  }
};
