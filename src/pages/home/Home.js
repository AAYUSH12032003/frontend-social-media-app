import React, { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import { Outlet } from "react-router";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../../redux/slices/appConfigSlice";

function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    // becoz of this useEffect function whwnever disptach is changed the whole page re renders itself and the function getMyInfo is called.
    dispatch(getMyInfo());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="outlet" style={{ marginTop: "60px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Home;
