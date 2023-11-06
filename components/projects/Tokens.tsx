import React from "react";
import Token from "./token";

type Props = {};

const Tokens = (props: Props) => {
  const dummy = ["1", "2", "3", "4", "5", "6"];
  return (
    <div className="grid grid-cols-4 gap-6 mt-4">
      {dummy?.map((item) => (
        <Token key={item} id={item} />
      ))}
    </div>
  );
};

export default Tokens;
