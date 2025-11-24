"use client";

interface ModuleItem {
  name: string;
  path: string;
  description: string;
}

const modules: ModuleItem[] = [
  {
    name: "auth-basic",
    path: "/modules/auth-basic",
    description: "가장 기본적인 인증 흐름을 다루는 예제 모듈입니다.",
  },
  {
    name: "table-mrt",
    path: "/modules/table-mrt",
    description: "Material React Table 기반의 테이블 구현 예제입니다.",
  },
  {
    name: "chart-pie",
    path: "/modules/chart-pie",
    description: "Recharts를 활용한 파이 차트 시각화 예제입니다.",
  },
];

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-14 px-6">
      <h1 className="text-3xl font-bold mb-6">Next-Labs Modules</h1>
      <p className="text-gray-600 mb-10">
        Next.js 기반 기능들을 모아둔 실험용 모듈 목록입니다.
        <br />각 항목을 클릭하면 Playground 페이지로 이동합니다.
      </p>

      <div className="space-y-6">
        {modules.map(module => (
          <a
            key={module.name}
            href={module.path}
            className="
              block border border-gray-200 rounded-lg p-5
              hover:bg-gray-50 transition-colors
            "
          >
            <div className="font-semibold text-lg">{module.name}</div>
            <div className="text-gray-500 text-sm mt-1">
              {module.description}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-14 text-gray-400 text-sm">
        ※ 모듈이 추가되면 위 배열(`modules`)에 항목을 추가하세요.
      </div>
    </main>
  );
}
