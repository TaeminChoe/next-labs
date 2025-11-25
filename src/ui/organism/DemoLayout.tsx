import { useState, ReactNode } from "react";
import CodeBlock from "../molecule/CodeBlock";

interface DemoLayoutProps {
  children: ReactNode;
  demoCode: string;
  language?: string;
  title?: string;
  description?: string;
  height?: string; // 선택: 높이 지정
}

export default function DemoLayout({
  children,
  demoCode,
  language = "tsx",
  title,
  description,
  height = "700px", // 기본 높이
}: DemoLayoutProps) {
  const [tab, setTab] = useState<"result" | "code">("result");

  return (
    <div className="space-y-4 border rounded shadow-sm p-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {description && <p className="text-gray-600">{description}</p>}

      <div className="flex border-b mt-2">
        <button
          className={`px-4 py-2 cursor-pointer ${
            tab === "result" ? "font-bold border-b-2" : "text-gray-500"
          }`}
          onClick={() => setTab("result")}
        >
          결과물
        </button>
        <button
          className={`px-4 py-2 cursor-pointer ${
            tab === "code" ? "font-bold border-b-2" : "text-gray-500"
          }`}
          onClick={() => setTab("code")}
        >
          코드
        </button>
      </div>

      <div className="overflow-auto border rounded" style={{ height }}>
        {tab === "result" && (
          <div className="flex justify-center p-4">{children}</div>
        )}

        {tab === "code" && <CodeBlock language="tsx">{demoCode}</CodeBlock>}
      </div>
    </div>
  );
}
