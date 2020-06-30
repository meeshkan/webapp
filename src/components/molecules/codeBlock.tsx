import React from "react";
import darkTheme from "../molecules/codeTheme";
import Highlight, { defaultProps } from "prism-react-renderer";
import { useColorMode } from "@chakra-ui/core";

const highlightStyle = {
  padding: 16,
  fontSize: 16,
  overflow: "auto",
  lineHeight: "1.5",
  fontFamily: "Menlo,monospace",
  maxHeight: 300,
  borderRadius: "4px",
};

const CodeBlock = ({ className, children }) => {
  const language = className && className.replace(/language-/, "");
  const { colorMode } = useColorMode();
  return (
    <Highlight
      {...defaultProps}
      // @ts-expect-error
      theme={darkTheme}
      code={children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            ...highlightStyle,
            border: `1px solid mode.${colorMode}.icon`,
          }}
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
