"use client";
import { useState } from "react";

function useRegisterPlayer() {
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);

  const handleJoinLobby = () => {
    if (userName.length <= 3) {
      setUserNameError(true);
      return;
    }
    setIsRegistrationSuccessful(true);
  };

  const handleUserNameChange = (name: string) => {
    setUserName(name);
    setUserNameError(false);
  };

  return {
    handleJoinLobby,
    handleUserNameChange,
    userNameError,
    userName,
    isRegistrationSuccessful,
  };
}

export default useRegisterPlayer;
