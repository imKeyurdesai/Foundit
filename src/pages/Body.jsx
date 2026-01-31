import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/firebase";
import Navber from "../components/Navber";
import { Icon } from "@iconify/react";

function Body() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Icon icon="line-md:loading-loop" className="text-4xl mx-auto" />;
  }

  return (
    <div>
      <Navber />
      <Outlet />
    </div>
  );
}

export default Body;
