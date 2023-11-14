import { NavbarWrapper } from "@/components/navbar/navbar";
import Tokens from "@/components/projects/Tokens";
import Title from "@/components/title";

type Props = {};

const Projects = (props: Props) => {
  return (
    <NavbarWrapper pageTitle={<div></div>}>
      <div className="py-4 px-5 w-full h-full flex flex-col gap-4 bg-[#2121219f]">
        <Title title="Tokens" icon iconName="nft" />
        <Tokens />
      </div>
    </NavbarWrapper>
  );
};

export default Projects;
