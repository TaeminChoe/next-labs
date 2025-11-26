import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  children: string;
  language?: string;
}

export default function CodeBlock({
  children,
  language = "tsx",
}: CodeBlockProps) {
  return (
    <Highlight
      theme={themes.oneDark}
      code={children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} rounded-md p-4 text-sm overflow-x-auto`}
          style={{ ...style, backgroundColor: "#282C34" }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
