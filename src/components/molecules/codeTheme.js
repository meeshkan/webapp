var theme = {
  plain: {
    color: "#f5f7fa",
    backgroundColor: "#1f2933",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#7b8188",
        fontStyle: "italic",
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#a8b7f0",
      },
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ["property", "tag", "boolean", "number", "constant"],
      style: {
        color: "#fdc702",
      },
    },
    {
      types: ["symbol", "deleted"],
      style: {
        color: "#dc1853",
      },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: {
        color: "#fee899",
      },
    },
    {
      types: ["entity", "url", "string"],
      style: {
        color: "#f0759a",
      },
    },
    {
      types: ["atrule", "attr-value", "keyword", "string"],
      style: {
        color: "#A8F0E1",
      },
    },
    {
      types: ["function", "class-name"],
      style: {
        color: "#526ee0",
        fontStyle: "italic",
      },
    },
    {
      types: ["regex", "important", "variable"],
      style: {
        color: "#33ccae",
        fontStyle: "italic",
      },
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold",
      },
    },
  ],
};

export default theme;
