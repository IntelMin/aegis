import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CollectionProps = {
  id: number,
  name: string,
}
