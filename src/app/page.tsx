"use client";

import AppBarComponent from "@/app/components/AppBarComponent.tsx";
import { Button } from "semantic-ui-react";
import Image from "next/image";
import background from "../../public/bg.png";
import { motion } from "framer-motion";


export default function Home() {
  return (
    <><Image
      src={background}
      alt="Background"
      layout="fill"
      objectFit="fit"
      quality={100}
      style={{ zIndex: -1 }} /><main className="h-full">
        <AppBarComponent />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          id="home"
          className="w-full h-full pt-20 mx-auto flex justify-center items-center"
          style={{ position: "relative" }}
        >
          <div className="flex flex-col bg-white bg-opacity-75 p-8 rounded-lg">
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-8xl text-center">
              EZ Housing price prediction
            </h1>
            <p className="text-center mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              Quickly and easily get insights on housing prices in your area
            </p>
            <div className="flex justify-center">
              <Button
                color="black"
                onClick={() => {
                  window.location.href = "/prediction";
                }}
              >
                Start
              </Button>
            </div>
          </div>
        </motion.div>
      </main></>
  );
}