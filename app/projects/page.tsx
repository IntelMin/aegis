import Tokens from "@/components/projects/Tokens";
import Title from "@/components/title";
import React from "react";

type Props = {};

const Projects = (props: Props) => {
  return (
    <div className="py-4 px-5 w-full h-full flex flex-col gap-4 bg-[#2121219f]">
      <Title title="Tokens" icon iconName="nft" />
      <Tokens />
    </div>
  );
};

export default Projects;
