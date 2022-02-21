import { createContext, useContext, useEffect, useState } from "react";
import { getProfilesForCompany } from "../../../services/profile";

const TeamContext = createContext();
const useTeamContext = () => useContext(TeamContext);
const TeamContextProvider = ({ children }) => {
  const [allMembers, setAllMembers] = useState([]);
  const fetchDataTeam = async () => {
    try {
      const listProfilesForCompany = await getProfilesForCompany();
      console.log("listProfilesForCompany",listProfilesForCompany.data);
      setAllMembers(listProfilesForCompany.data);
    } catch (error) {
      return;
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDataTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <TeamContext.Provider value={{ allMembers, setAllMembers, fetchDataTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export { TeamContextProvider, TeamContext, useTeamContext };
