import Image from "next/image";

type Props = {
  title: string;
  imgSrc: string;
  imgAlt: string;
};

const TemplateSection = ({ title, imgSrc, imgAlt }: Props) => {
  return (
    <div
      className={`${
        title === "Functions" ? "col-span-6" : "col-span-5"
      } flex flex-col`}
    >
      <div className="flex items-center gap-2">
        <h1>{title}</h1>
        <Image src="/info.svg" alt={imgAlt} width={18} height={18} />
      </div>
      <div className="mt-4">
        <div className="relative">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={500}
            height={400}
            className="w-full h-[410px]"
          />
          <div
            className={`absolute ${
              title === "Functions"
                ? "left-0 bottom-0"
                : "left-0 top-0 h-full"
            }  w-full`}
          >
            <div
              className="flex flex-col items-center justify-center p-5 gap-2 h-full"
              style={{
                background: "rgba(12, 12, 12, 0.20)",
                backdropFilter: "blur(4px)",
              }}
            >
              <button
                type="button"
                className="bg-[#0E76FD] font-[300] text-white px-12 py-3"
              >
                Unlock
              </button>
              <p className="text-[14px] text-neutral-300">
                Unlock the full function list with premium
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSection;
