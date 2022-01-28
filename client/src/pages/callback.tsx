import { useEffect } from "react";

export const Callback = () => {
  useEffect(() => {
    window.close();
  });

  return <div>waiting...</div>;
};
