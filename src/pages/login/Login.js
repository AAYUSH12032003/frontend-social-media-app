import React, { useState } from "react";
import "./Login.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, setItem } from "../../utils/localStorageManager";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log("here it is in handleSubmit function");

    try {
      const response = await axiosClient.post("/auth/login", {
        //axioClient is simalar to fetch() . it takes api(from where data is to be extracted) and fields(like email, pw) as parameters to fetch the data from server to front end .
        email, //fetching data from back end wala email to front end i.e iss page ka email.
        password,
      });
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken); // setting the access token to the local storage which requires a key('KEY_ACCESS_TOKEN') as parameter to set the data to local storage.
      navigate("/"); //after setting the data to local storage(above line of code) , navigate to '/' i.e home page.
    } catch (error) {
      console.log("error in handleSubmit function", error); // this is the part of frontend so it will be printed in browser console.
    }
  }

  return (
    <div className="Login">
      <div className="login-box">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" className="submit" />
        </form>
        <p className="subheading">
          Don't have an account?{" "}
          <NavLink className="nav-link " to="/signup">
            Signup
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
