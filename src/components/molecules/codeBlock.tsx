import React from "react";
import darkTheme from "prism-react-renderer/themes/nightOwl";
import Highlight, { defaultProps } from "prism-react-renderer";

const highlightStyle = {
  padding: 16,
  fontSize: 16,
  overflow: "auto",
  lineHeight: "1.5",
  fontFamily: "Menlo,monospace",
};

const CodeBlock = ({ className, children }) => {
  const theme = darkTheme;
  const language = className && className.replace(/language-/, "");
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{ ...style, borderRadius: "2px", ...highlightStyle }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
