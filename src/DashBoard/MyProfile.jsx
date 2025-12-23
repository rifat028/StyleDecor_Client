import React, { use } from "react";
import { AuthContext } from "../Authentication/AuthContext";

const MyProfile = () => {
  const { user } = use(AuthContext);
  return (
    <div>
      <h1>this is my profile</h1>
    </div>
  );
};

export default MyProfile;
