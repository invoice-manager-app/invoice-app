import React from "react";

const Avatar = ({ imageHandleChange }) => {
  return (
    <input
      style={{ color: "#fff" }}
      type="file"
      name="file"
      onChange={imageHandleChange}
    />
  );
};

export default Avatar;
