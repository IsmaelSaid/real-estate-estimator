"use client";

import { DashboardNavigation } from "@/app/components/dashboard/DashboardNavigation.tsx";
import { Mutation } from "@prisma/client";
import { DisplayMutations } from "@/app/components/dashboard/DisplayMutations.tsx";
import { useEffect, useState } from "react";
import { Charts } from "@/app/components/dashboard/Charts.tsx";
import _ from "lodash";
import { CircularProgress } from "@mui/material";

/**
 * DashboardComponent */
export function DashboardComponent() {
  const [data, setData] = useState([] as Mutation[]);
  const [activeTab, setActiveTab] = useState("raw_data");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await fetch(`api/mutations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch mutations");
    }
    const currData: Mutation[] = await res.json();

    const sortedData = _.chain(currData)
      .uniqBy("id_mutation")
      .sortBy("valeur_fonciere")
      .value();
    setData(sortedData);
    setIsLoading(false);
  };

  const menu = [
    {
      id: "raw_data",
      label: "Raw data",
      component: <DisplayMutations data={data} />,
    },
    {
      id: "charts",
      label: "Chart",
      component: <Charts data={data} />,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      className={
        "w-full h-full white pt-20 pl-64 mx-auto bg-gradient-to-b from-white from-80% to-gray-200"
      }
    >
      <DashboardNavigation
        activeTab={activeTab}
        onTabChange={(tab: string) => setActiveTab(tab)}
      />
      <div className={"Container mx-3 h-full"}>
        {isLoading ? (
          <div className={"flex h-full justify-center items-center"}>
            <CircularProgress color={"inherit"} />
          </div>
        ) : (
          menu.find((item) => item.id === activeTab)?.component
        )}
      </div>
    </div>
  );
}
