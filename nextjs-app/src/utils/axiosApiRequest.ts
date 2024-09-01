import axios, { AxiosRequestConfig, Method } from 'axios';

const BACKEND_REFRESH_URL = process.env.NEXT_PUBLIC_BACKEND_URL_REFRESH_TOKEN;

// Create an Axios instance
const apiClient = axios.create({
  withCredentials: true, // Ensure cookies are sent with every request
});

// Add a response interceptor
apiClient.interceptors.response.use(
  response => response, // Return the response if it is successful
  async error => {
    if (error.response?.status === 403) {
      //console.log("Token expired, attempting to refresh...");

      try {
        // Attempt to refresh the token using the refresh endpoint
        const refreshResponse = await axios.post(BACKEND_REFRESH_URL, {}, { withCredentials: true });

        if (refreshResponse.data.statusCode === 200) {
          //  console.log("Token refreshed successfully");

          // Retry the original request
          const originalRequest = error.config;

          // Set withCredentials to ensure cookies are sent with the retried request
          originalRequest.withCredentials = true;

          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If the refresh fails, reject the request with an error
       // console.log("Failed to refresh token, user must re-login");
        return Promise.reject(new Error('Need to re-login'));
      }
    }

    // If the error is not a 403, or if refresh fails, reject the error
    return Promise.reject(error);
  }
);

// Define a type for the API request parameters
interface ApiRequestParams {
  method: Method;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  useCredentials?: boolean;
  headers?: Record<string, string>; 

}

// Create the apiRequest function using the Axios instance
export const apiRequest = async ({
  method,
  url,
  data,
  config,
  headers = {}, 
  useCredentials = false,
}: ApiRequestParams) => {
  // Create a default configuration object
  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    data,
    withCredentials: useCredentials, // Set to true if credentials are required
    headers,
    ...config,
  };

  try {
    // Make the API request using the Axios instance
    const response = await apiClient(axiosConfig);
    return response.data; // Return the response data
  } catch (error) {
    // Handle and throw error as needed
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
    throw new Error('An unknown error occurred');
  }
};
