import React, { createContext, useContext, useState, useEffect } from "react";
import { IJournalingData } from "../types";
import { getJournalingData } from "../data/journalingData";
import { useApp } from "./AppContext";
import { generateDateRange } from "../lib/utils";

type JournalingDataActions = {
  add: (newData: IJournalingData) => void;
  remove: (dataToRemove: IJournalingData) => void;
  reindex: () => void;
};

type JournalingDataContextType = {
  journalingData: IJournalingData[];
} & JournalingDataActions;

const JournalingDataContext = createContext<
  JournalingDataContextType | undefined
>(undefined);

export const useJournalingData = (): JournalingDataContextType => {
  const context = useContext(JournalingDataContext);
  if (!context) {
    throw new Error(
      "useJournalingData must be used within a JournalingDataProvider"
    );
  }
  return context;
};

type JournalingDataProps = {
  children: React.ReactNode;
};

export const JournalingDataProvider: React.FC<JournalingDataProps> = ({
  children,
}) => {
  const [journalingData, setJournalingData] = useState<IJournalingData[]>([]);
  const app = useApp();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getJournalingData(
        app,
        generateDateRange("2023-08-01", "2023-08-20") // FIXME
      );
      setJournalingData(data);
    };

    fetchData();
  }, []);

  const add = (newData: IJournalingData) => {
    setJournalingData((prevData) => [...prevData, newData]);
  };

  const remove = (dataToRemove: IJournalingData) => {
    setJournalingData((prevData) =>
      prevData.filter((data) => data !== dataToRemove)
    );
  };

  const reindex = async () => {
    const data = await getJournalingData(
      app,
      generateDateRange("2023-08-15", "2023-08-20")
    );
    setJournalingData(data);
  };

  return (
    <JournalingDataContext.Provider
      value={{ journalingData, add, remove, reindex }}
    >
      {children}
    </JournalingDataContext.Provider>
  );
};
