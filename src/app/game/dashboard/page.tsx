"use client";

import useConnectSocket from "@/app/_hooks/useConnectSocket";

const Dashboard = () => {
  const { socket } = useConnectSocket();

  return (
    <>
      <main></main>
    </>
  );
};

export default Dashboard;
