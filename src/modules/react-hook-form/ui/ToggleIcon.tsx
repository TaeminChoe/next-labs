import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  state: boolean;
}

export default function ToggleIcon({ state, ...svgProps }: Props) {
  if (state) {
    return (
      <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        <rect width="48" height="24" rx="12" fill="currentColor" />
        <circle cx="36" cy="12" r="10" fill="white" />
      </svg>
    );
  } else {
    return (
      <svg
        width="48"
        height="24"
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        <rect width="48" height="24" rx="12" fill="#F2F2F7" />
        <circle cx="12" cy="12" r="10" fill="#E5E5EA" />
      </svg>
    );
  }
}
