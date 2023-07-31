import axios from "axios";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager";
import store from "../redux/store";
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
//console.log("inside axiosClient");

let baseURL = "http://localhost:4000";
console.log("env is ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  baseURL = process.env.REACT_APP_SERVER_BASE_URL;
}

// console.log(
//   "after setting base url in env file we come inside axiosClient.js at line 18 "
// );

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

//for every api going from front end to back end we are sending access token in header particularly in authorization
axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN); // here we are asking for the access token from local storage by passing key as an argument.
  request.headers["Authorization"] = `Bearer ${accessToken}`; // here we are sending the access token with bearer in the authorization for EVERY REQUEST!!
  store.dispatch(setLoading(true));
  // console.log("inside request interceptor");
  return request; // sending each and every request with access token in their own headers.
});

// both the interceptors are made at the front end part
axiosClient.interceptors.response.use(
  async (respone) => {
    store.dispatch(setLoading(false));
    const data = respone.data; // fetching the data from the server
    if (data.status === "ok") {
      // console.log(
      //   "if status of data is ok then print his , inside axiosClient at line43"
      // );
      return data; //returning the response back to the front end as the interceptor is approving the response(data) to go to front end.
    }

    // if command comes here it means status is not ok.
    const originalRequest = respone.config; // originalRequest is the request made originally by the front end which is giving us error now , it is extracted from response.config
    const statusCode = data.statusCode;
    const error = data.message;

    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );

    if (statusCode === 401 && !originalRequest._retry) {
      // means the access token has expired that's it
      originalRequest._retry = true;

      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`${baseURL}/auth/refresh`); // calling the refresh token url to get the new access token.
      console.log("response from the backend:", response); // this response contians the new access token.

      if (response.data.status === "ok") {
        setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken); // updating the access token present in the local storage with the new access token generated.
        originalRequest.headers[ // passing the new access toekn in the headers of original request made
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;

        console.log("token from backend:", response.data.result.accessToken);

        return axios(originalRequest); // returning the original request after giving it new access token.
      } else {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    // console.log("error occuring inside axiosClient.js!!");
    return Promise.reject(error);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );
    return Promise.reject(error);
  }
);
