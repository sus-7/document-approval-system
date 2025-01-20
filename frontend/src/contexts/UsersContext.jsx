import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [approver, setApprover] = useState(null);
  const [assistants, setAssistants] = useState([]);
  const [usersChanged, setUsersChanged] = useState(0);
  const refreshUsers = () => {
    setUsersChanged(usersChanged + 1);
  };
  const fetchApprover = async () => {
    try {
      const getApproverUrl =
        import.meta.env.VITE_API_URL + "/assistant/get-approver";
      const response = await axios.get(getApproverUrl, {
        withCredentials: true,
      });
      console.log("response", response);
      if (response.status === 200) {
        setApprover(response.data.approver);
        console.log("Approver fetched successfully", approver);
      }
    } catch (error) {
      console.log("UsersContext service :: fetchApprover :: error : ", error);
    }
  };
  useEffect(() => {
    fetchApprover();
  }, [usersChanged]);

  const fetchAssistants = async () => {
    try {
      const getAssistantsUrl =
        import.meta.env.VITE_API_URL + "/assistant/get-created-assistants";
      const response = await axios.get(getAssistantsUrl, {
        withCredentials: true,
      });
      console.log("response", response);
      if (response.status === 200) {
        setAssistants(response.data.assistants);
        console.log(
          "Assistants fetched successfully (res)",
          response.data.assistants
        );
        console.log(
          "Assistants fetched successfully (assistants state)",
          assistants
        );
      }
    } catch (error) {
      console.log("UsersContext service :: fetchAssistants :: error : ", error);
    }
  };
  useEffect(() => {
    fetchAssistants();
  }, [usersChanged]);
  return (
    <UsersContext.Provider
      value={{
        approver,
        setApprover,
        assistants,
        setAssistants,
        refreshUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
