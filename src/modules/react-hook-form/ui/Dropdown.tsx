import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { RightArrowIcon } from "../ui";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxMenuHeight?: number;
  wrapperClassName?: string;
  error?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  maxMenuHeight = 200,
  wrapperClassName,
  error,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null); // 버튼 기준점
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const selected = options.find(opt => opt.value === value);

  // 메뉴 위치 계산 (뷰포트 기준)
  const updatePosition = () => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom; // fixed는 뷰포트 기준이므로 scrollY 더하지 않음
    const left = rect.left;
    const width = rect.width;

    // 우측/하단이 뷰포트 밖으로 나가면 살짝 보정 (간단한 예)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const menuMaxH = Math.min(maxMenuHeight, Math.max(100, vh - top - 16));
    const adjustedLeft = Math.min(left, vw - width - 8);

    setMenuStyle({
      position: "fixed",
      top,
      left: adjustedLeft,
      width,
      maxHeight: menuMaxH,
      zIndex: 9999, // 모달보다 위
    });
  };

  // 열릴 때 포지션 설정 + 스크롤/리사이즈 시 재계산
  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const reflow = () => updatePosition();
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, maxMenuHeight]);

  // 바깥 클릭 닫기 (포털 포함)
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!anchorRef.current?.contains(t) && !menuRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={twMerge(clsx(`relative w-full`, wrapperClassName))}>
      {/* 선택 영역 */}
      <button
        ref={anchorRef}
        type="button"
        className={`
          w-full flex justify-between items-center px-4 py-3
          rounded-sm border bg-white
          ${error ? "border-red-300" : "border-zienblack-20"}
          ${disabled ? "text-text cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !disabled && setOpen(p => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={twMerge(
            clsx(
              `font-body2-regular`,
              `${placeholder && !value ? "text-text" : "text-zienblack-100"}`,
              `${disabled ? "text-text" : ""}`
            )
          )}
        >
          {selected ? selected.label : placeholder ?? "Select..."}
        </span>
        <RightArrowIcon
          className={`w-6 h-6 text-text transition-transform ${
            open ? "rotate-[-90deg]" : "rotate-90"
          }`}
        />
      </button>

      {/* 옵션 리스트: 포털로 body에 렌더 */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className={`
              overflow-y-auto rounded-sm bg-white shadow-lg
              space-y-[2px] p-0 mt-1
            `}
            role="listbox"
          >
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`
                  w-full px-4 py-[10px] cursor-pointer hover:bg-zienblack-20
                  ${
                    opt.value === value
                      ? "font-body2-bold"
                      : "font-body2-regular"
                  }
                `}
                role="option"
                aria-selected={opt.value === value}
              >
                <span className="text-[15px]">{opt.label}</span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
