import React from "react";
import {
  Heading,
  Stack,
  LightMode,
  Button,
  Text,
  useColorMode,
  Link,
  SimpleGrid,
  Image,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import Card from "../molecules/card";
import { GithubIcon } from "../../theme/icons";

const SignIn = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <SimpleGrid columns={2} gap={8} h="80vh">
      {/** ewwwwwwwwwwwwwwwwwwwww null session, figure out a better way to do this... anti-pattern
       * this is the only place we have null because it is the only place a user can't be signed in
       * from the webapp
       */}
      <Card session={null}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text
            textAlign="center"
            mb={0}
            lineHeight="tall"
            fontSize="xl"
            fontWeight={500}
          >
            We save teams valuable development time
          </Text>
          <Image
            alt=""
            maxW="380px"
            src="https://media.graphcms.com/xTqnFOUZRDqeKsSuDiuN"
          />
        </Stack>
      </Card>

      <Card session={null}>
        <Heading
          as="h2"
          color={`mode.${colorMode}.title`}
          textAlign="center"
          my={8}
        >
          Log in or Sign up
        </Heading>
        <Text
          textAlign="center"
          mb={16}
          lineHeight="tall"
          fontSize="xl"
          fontStyle="italic"
          fontWeight={500}
        >
          Meeshkan is an automated GraphQL server testing tool.
          <br />
          <Link href="https://meeshkan.com/" isExternal>
            See here for more information about Meeshkan.
          </Link>
        </Text>
        <Stack
          direction="column"
          justify="center"
          spacing={16}
          maxW="400px"
          mx="auto"
        >
          <Stack direction="column" justify="center">
            <Text
              textAlign="center"
              mb={4}
              lineHeight="tall"
              fontSize="xl"
              fontStyle="italic"
              fontWeight={500}
            >
              Have an account already?
            </Text>
            <Button
              colorScheme="gray"
              onClick={() => router.push("/api/login")}
            >
              <GithubIcon mr={2} />
              Log in
            </Button>
          </Stack>
          <Stack direction="column" justify="center">
            <Text
              textAlign="center"
              mb={4}
              lineHeight="tall"
              fontSize="xl"
              fontStyle="italic"
              fontWeight={500}
            >
              New to Meeshkan?
            </Text>
            <LightMode>
              <Button
                colorScheme="red"
                onClick={() => router.push("/api/login")}
              >
                <GithubIcon mr={2} />
                Sign up
              </Button>
            </LightMode>
          </Stack>
        </Stack>
      </Card>
    </SimpleGrid>
  );
};

export default SignIn;
