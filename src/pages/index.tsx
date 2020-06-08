import React, { useState } from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Button,
  Grid,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { useRouter } from "next/router";
// import ReactGA from "react-ga"; // TODO add create team analytics
import Card from "../components/molecules/card";
import { withError } from "../components/molecules/error";
import * as _E from "../fp-ts/Either";
import { GET_SERVER_SIDE_PROPS_ERROR } from "../utils/error";
import { IOwner, IRepository, NegativeGithubFetchOutcome } from "../utils/gh";
import { InitialLoading, Loading } from "../utils/hookNeedingFetch";
import { SEPARATOR } from "../utils/separator";
import { getTeams, ITeam, useTeams } from "../utils/teams";
import { confirmOrCreateUser } from "../utils/user";
import { withSession } from "./api/session";
import { getGHOAuthState } from "../utils/oauth";

export type ITeamsProps = {
  session: ISession;
  teams: ITeam[];
  id: string;
  ghOauthState: string;
};

const userType = t.type({ id: t.string });
export const getServerSideProps = ({
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, ITeamsProps>;
}> =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chain((p) =>
      pipe(
        getTeams,
        RTE.chain((teams) => RTE.right({ teams, ...p }))
      )
    ),
    RTE.chain((p) =>
      pipe(
        getGHOAuthState,
        RTE.fromReaderEither,
        RTE.chain((ghOauthState) => RTE.right({ ghOauthState, ...p }))
      )
    ),
    RTE.chain((p) => (session) => TE.right({ session, ...p })),
    withSession(req, "index.tsx getServerSideProps")
  )().then(_E.eitherSanitizedWithGenericError);

export default withError<GET_SERVER_SIDE_PROPS_ERROR, ITeamsProps>(
  "Meeshkan is temporarily offline. We are aware of the problem and are working hard to resolve it. Please check back soon!",
  ({ session, teams, id }) =>
    pipe(
      {
        useColorMode: useColorMode(),
        router: useRouter(),
        useDisclosure: useDisclosure(),
        teamsFromClientSideFetch: useTeams(session),
        useOwner: useState<
          E.Either<
            Loading,
            E.Either<NegativeGithubFetchOutcome, O.Option<IOwner>>
          >
        >(E.left(InitialLoading)),
        importProjectIsExecuting: React.useState(false),
        useOwnerRepos: useState<
          E.Either<
            Loading,
            E.Either<
              NegativeGithubFetchOutcome,
              O.Option<NonEmptyArray<IRepository>>
            >
          >
        >(E.left(InitialLoading)),
        toast: useToast(),
      },
      (p) => ({
        ...p,
        allTeams:
          E.isRight(p.teamsFromClientSideFetch[0]) &&
          E.isRight(p.teamsFromClientSideFetch[0].right)
            ? p.teamsFromClientSideFetch[0].right.right
            : teams,
      }),
      ({
        allTeams,
        useColorMode: { colorMode },
        useDisclosure: { onOpen, isOpen, onClose },
      }) => (
        <>
          <Grid
            templateColumns={[
              "repeat(2, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={8}
          >
            {allTeams.map((team, index) => (
              <Card
                key={index}
                link={`/${team.name}/`}
                linkLabel={`Links to ${team.name}'s dashboard`}
              >
                <Stack spacing={4} isInline>
                  <Image
                    size={10}
                    src={
                      team.image
                        ? team.image.downloadUrl
                        : "https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
                    }
                    alt={`${team.name}'s organization image`}
                    bg="gray.50"
                    border="1px solid"
                    borderColor={`mode.${colorMode}.icon`}
                    rounded="sm"
                  />
                  <Stack spacing={2}>
                    <Heading
                      as="h3"
                      lineHeight="none"
                      fontSize="md"
                      fontWeight={900}
                    >
                      {team.name}
                    </Heading>
                    <Text color={`mode.${colorMode}.text`} lineHeight="none">
                      {`${team.project.items.length} projects`}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}

            {/* Create a team | BUTTON */}
            <Button
              onClick={onOpen}
              pos="unset"
              p={4}
              minH="72px"
              justifyContent="start"
              rounded="sm"
              lineHeight="none"
              fontSize="md"
              fontWeight={900}
              bg={`mode.${colorMode}.card`}
              color={`mode.${colorMode}.title`}
              _hover={{ color: `mode.${colorMode}.titleHover` }}
            >
              <Icon h={10} w={10} mr={2} name="add" stroke="2px" />
              Create a team
            </Button>
          </Grid>

          {/* Create a team | MODAL */}
          <Modal
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            scrollBehavior="inside"
            closeOnOverlayClick={true}
            size="lg"
          >
            <ModalOverlay />
            <ModalContent
              rounded="sm"
              backgroundColor={`mode.${colorMode}.card`}
            >
              <ModalHeader
                borderBottom="1px solid"
                borderColor={`mode.${colorMode}.icon`}
                mx={4}
                px={0}
                pt={4}
                pb={2}
                fontWeight={900}
                color={`mode.${colorMode}.title`}
              >
                Create a team
              </ModalHeader>
              <ModalCloseButton
                rounded="sm"
                size="sm"
                mt={2}
                mr={0}
                color={`mode.${colorMode}.text`}
              />
              <ModalBody px={2}>
                <FormControl isRequired>
                  <FormLabel>Team name</FormLabel>
                  <Input />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button>Create</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    )
);
