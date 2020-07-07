import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Text,
  Heading,
  UnorderedList,
  ListItem,
  useColorMode,
  Link,
  Code,
} from "@chakra-ui/core";

const HeadingComponent = (props) => {
  const { colorMode } = useColorMode();
  return (
    <Heading
      {...props}
      as="h2"
      fontSize="lg"
      mt={8}
      mb={4}
      fontWeight={900}
      color={`mode.${colorMode}.title`}
    >
      {props.children}
    </Heading>
  );
};

const LinkComponent = (props) => {
  return (
    <Link
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      textDecor="underline"
      fontWeight={500}
    />
  );
};

const Renderers: ReactMarkdown.Renderers = {
  paragraph: (props) => (
    <Text as="p" mt={4} fontWeight={500} lineHeight="tall" {...props}>
      {props.children}
    </Text>
  ),
  heading: HeadingComponent,
  list: (props) => (
    <UnorderedList spacing={2} mb={4} {...props}>
      {props.children}
    </UnorderedList>
  ),
  listItem: (props) => <ListItem {...props}>{props.children}</ListItem>,
  link: LinkComponent,
  inlineCode: (props) => (
    <Code
      mt={4}
      fontWeight={600}
      lineHeight="tall"
      backgroundColor="transparent"
      {...props}
    >
      `{props.children}`
    </Code>
  ),
};

export default Renderers;
