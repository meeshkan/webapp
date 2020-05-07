import React from "react";
import Link from "next/link";
import {
  Stack,
  Text,
  Grid,
  Image,
  useColorMode,
  Heading,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/core";
import { useFetchUser } from "../../utils/user";
import Card from "../../components/molecules/card";

export default function OrganizationPage({organizationName}) {
  const { colorMode } = useColorMode();
  const { user } = useFetchUser();
  const projects = user.projects.filter(project => project.owner.login === organizationName);
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {projects.map(({ owner: { login, avatarUrl }, name }, index) => (
          <Link key={name} href={`/${organizationName}/${name}`}>
            <a>
          <Card key={index}>
            <Stack spacing={4} isInline>
              <Image
                size={10}
                src={avatarUrl}
                bg="gray.50"
                border="1px solid"
                borderColor={`mode.${colorMode}.icon`}
                rounded="sm"
              />
              <Stack spacing={2}>
                <Text color={`mode.${colorMode}.text`} lineHeight="none">
                  {organizationName}
                </Text>
                <Heading
                  as="h3"
                  lineHeight="none"
                  fontSize="md"
                  fontWeight={900}
                >
                  {name}
                </Heading>
              </Stack>
            </Stack>
          </Card>
          </a>
          </Link>
        ))}
        <ChakraLink
          href="https://github.com/apps/meeshkan/installations/new"
          bg={`mode.${colorMode}.card`}
          p={4}
          rounded="sm"
          color={`mode.${colorMode}.title`}
          _hover={{ color: `mode.${colorMode}.titleHover` }}
        >
          <Stack spacing={4} align="center" isInline>
            <Icon h={10} w={10} name="add" stroke="2px" />
            <Heading as="h3" lineHeight="none" fontSize="md" fontWeight={900}>
              Authorize a repository
            </Heading>
          </Stack>
        </ChakraLink>
      </Grid>
    </>
  );
}
