import { component$ } from "@builder.io/qwik";
import { twMerge } from "tailwind-merge";
import { type IconProps, iconDefaultProps as defaultProps } from "./types";

type Props = Partial<IconProps>;
export const Dropdown = component$<Props>((props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? defaultProps.width}
      height={props.height ?? defaultProps.height}
      viewBox="0 0 24 24"
      class={twMerge(props.class, defaultProps.class)}
    >
      <path
        fill={props.fill ?? defaultProps.fill}
        d="m11.808 14.77l-3.715-4.458A.8.8 0 0 1 8.708 9h6.584a.8.8 0 0 1 .614 1.312l-3.714 4.458a.25.25 0 0 1-.384 0"
      />
    </svg>
  );
});
