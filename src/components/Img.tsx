import type { StrictOmit } from "../types/util";
import { type ComponentProps, memo } from "react";
import Image from "react-bootstrap/Image";

function Img({ priority = false, ...props }: Props) {
  return (
    <Image
      {...props}
      bsPrefix="img"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      // fetchPriority="high"
    />
  );
};

export default memo(Img);

type Props = {
  priority?: boolean;
} & StrictOmit<
  ComponentProps<typeof Image>,
  "loading" | "decoding" | "fetchPriority" | "bsPrefix"
>;
