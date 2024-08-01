"use client";

import AppBarComponent from "@/app/components/AppBarComponent.tsx";
import { Button } from "semantic-ui-react";

export default function Home() {
  return (
    <main className="h-full">
      <AppBarComponent />
      <div
        className={
          "w-full h-full pt-16 mx-auto flex justify-center items-center"
        }
      >
        <div className={" flex flex-col"}>
          <h1 className="mb-4 text-4xl font-extrabold  text-gray-900 md:text-5xl lg:text-8xl text-center">
            EZ Housing price prediction
          </h1>
          <p className=" text-center mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Quickly and easily get insights on housing prices in your area
          </p>
          <div className={"flex justify-center"}>
            <Button
              color={"black"}
              onClick={() => {
                // redirect the user
                window.location.href = "/prediction";
              }}
            >
              Start
            </Button>
          </div>
        </div>
      </div>{" "}
    </main>
  );
}
