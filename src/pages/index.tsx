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
  Flex,
  LightMode,
  Box,
  useToastOptions,
} from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { useRouter, NextRouter } from "next/router";
import ReactGA from "react-ga";
import Card from "../components/molecules/card";
import { withError } from "../components/molecules/error";
import * as _E from "../fp-ts/Either";
import {
  GET_SERVER_SIDE_PROPS_ERROR,
  UNDEFINED_ERROR,
  INCORRECT_TYPE_SAFETY,
} from "../utils/error";
import { getTeams, ITeam, useTeams, Team } from "../utils/teams";
import { confirmOrCreateUser, getUserIdFromIdOrEnv } from "../utils/user";
import { withSession } from "./api/session";
import { getGHOAuthState } from "../utils/oauth";
import { useForm } from "react-hook-form";
import { constNull, flow, constant } from "fp-ts/lib/function";
import { CREATE_TEAM_MUTATION } from "../gql/pages";
import { eightBaseClient } from "../utils/graphql";

type NegativeCreateTeamOutcome = UNDEFINED_ERROR | INCORRECT_TYPE_SAFETY;
type TeamsMutationType = t.TypeOf<typeof teamsMutationType>;
type ITeamCreate = t.TypeOf<typeof TeamCreate>;
const TeamCreate = t.type({
  teamName: t.union([t.null, t.string]),
  userId: t.union([t.null, t.string]),
});

const teamsMutationType = t.type({
  userUpdate: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

export type ITeamsProps = {
  session: ISession;
  teams: ITeam[];
  id: string;
  ghOauthState: string;
};

interface createTeamVariables {
  userId: string;
  teamName: string;
  closeModal: () => void;
  router: NextRouter;
  toast: (props: useToastOptions) => void;
  createTeamIsExecuting: React.Dispatch<React.SetStateAction<boolean>>;
}

const createTeam = ({
  toast,
  closeModal,
  router,
  createTeamIsExecuting,
  ...createTeamVariables
}: createTeamVariables) => (
  session: ISession
): TE.TaskEither<NegativeCreateTeamOutcome, void> =>
    TE.bracket<NegativeCreateTeamOutcome, void, void>(
      () =>
        Promise.resolve(
          E.right<NegativeCreateTeamOutcome, void>(createTeamIsExecuting(true))
        ),
      () =>
        pipe(
          TE.tryCatch(
            () =>
              eightBaseClient(session).request(
                CREATE_TEAM_MUTATION,
                createTeamVariables
              ),
            (error): NegativeCreateTeamOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Could not make create team mutation",
              error,
            })
          ),
          TE.chain((_) => TE.right(constNull())),
          TE.mapLeft((l) =>
            pipe(
              toast({
                title: "Oh no!",
                description:
                  "We could not create your team. Please try again soon!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
              }),
              constant(l)
            )
          )
        ),
      (_, e) => () =>
        router.push(`/${createTeamVariables.teamName}/`).then((_) =>
          E.right(
            {
              _: closeModal(),
              __: createTeamIsExecuting(false),
              ___: ReactGA.event({
                category: "Teams",
                action: "Created",
                label: "index.tsx",
              }),
            }._
          )
        )
    );

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
        createTeamIsExecuting: useState(false),
        toast: useToast(),
        useForm: useForm({
          // ...(configuration ? { defaultValues: configuration } : {}),
        }),
      },
      (p) => ({
        ...p,
        allTeams:
          E.isRight(p.teamsFromClientSideFetch[0]) &&
            E.isRight(p.teamsFromClientSideFetch[0].right)
            ? p.teamsFromClientSideFetch[0].right.right
            : teams,
        onSubmit: (values: ITeamCreate) =>
          createTeam({
            toast: p.toast,
            createTeamIsExecuting: p.createTeamIsExecuting[1],
            closeModal: p.useDisclosure.onClose,
            ...values,
            router: p.router,
            teamName: values.teamName,
            userId: getUserIdFromIdOrEnv(id),
          })(session)().then(constNull),
      }),
      ({
        allTeams,
        useColorMode: { colorMode },
        useDisclosure: { onOpen, isOpen, onClose },
        useForm: { handleSubmit, formState, register },
        onSubmit,
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
                      fallbackSrc="https://media.graphcms.com/yT9VU4rQPKrzu7h7cqJe"
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
                <Box
                  as="form"
                  onSubmit={handleSubmit(onSubmit)}
                  w="100%"
                  overflow="auto"
                >
                  <ModalBody p={4}>
                    <FormControl isRequired>
                      <FormLabel
                        fontWeight={500}
                        color={`mode.${colorMode}.title`}
                      >
                        Team name
                    </FormLabel>
                      <Input
                        borderColor={`mode.${colorMode}.icon`}
                        color={`mode.${colorMode}.text`}
                        rounded="sm"
                        size="sm"
                        name="teamName"
                        ref={register}
                      />
                    </FormControl>
                  </ModalBody>
                  <ModalFooter p={4}>
                    <Flex justifyContent="flex-end">
                      <LightMode>
                        <Button
                          size="sm"
                          px={4}
                          rounded="sm"
                          fontWeight={900}
                          variantColor="blue"
                          type="submit"
                          isLoading={formState.isSubmitting}
                        >
                          Create team
                      </Button>
                      </LightMode>
                    </Flex>
                  </ModalFooter>
                </Box>
              </ModalContent>
            </Modal>
          </>
        )
    )
);
