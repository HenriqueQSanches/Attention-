import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

type Props = {
  seed: string;
  size?: number;
  options?: Record<string, unknown>;
};

export function Assistant({ seed, size = 72, options }: Props) {
  const uri = useMemo(
    () => createAvatar(bottts, { seed, radius: 16, ...options }).toDataUri(),
    [seed, options],
  );
  return (
    <img
      src={uri}
      width={size}
      height={size}
      alt="Arauto"
      style={{ display: "block" }}
    />
  );
}
