import React, { useState } from "react";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Button,
  Grid,
  Heading,
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
  UseToastOptions,
  Avatar,
} from "@chakra-ui/core";
import { AddIcon, FallbackIcon } from "../theme/icons";
import { mixpanelize } from "../utils/mixpanel-client";
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
import * as _RTE from "../fp-ts/ReaderTaskEither";
import {
  GET_SERVER_SIDE_PROPS_ERROR,
  UNDEFINED_ERROR,
  INCORRECT_TYPE_SAFETY,
} from "../utils/error";
import { getTeams, ITeam, useTeams, Team } from "../utils/teams";
import { confirmOrCreateUser, getUserIdFromIdOrEnv } from "../utils/user";
import { withSession } from "./api/session";
import { useForm } from "react-hook-form";
import { constNull, flow, constant } from "fp-ts/lib/function";
import { CREATE_TEAM_MUTATION } from "../gql/pages";
import { eightBaseClient } from "../utils/graphql";

type NegativeCreateTeamOutcome = UNDEFINED_ERROR | INCORRECT_TYPE_SAFETY;
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
};

interface createTeamVariables {
  userId: string;
  teamName: string;
  closeModal: () => void;
  router: NextRouter;
  toast: (props: UseToastOptions) => void;
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
    _RTE.seq2([confirmOrCreateUser("id", userType), getTeams]),
    RTE.chain(([{ id }, teams]) => (session) =>
      TE.right({ session, id, teams })
    ),
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
        useForm: useForm(),
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
                session={session}
                key={index}
                link={`/${team.name}`}
                linkLabel={`Links to ${team.name}'s dashboard`}
              >
                <Stack spacing={4} direction="row">
                  <Avatar
                    h={10}
                    w={10}
                    src={team.image && team.image.downloadUrl}
                    icon={<FallbackIcon color={`mode.${colorMode}.icon`} />}
                    bg={`mode.${colorMode}.background`}
                    showBorder={true}
                    borderRadius="sm"
                    name=""
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
                      {`${team.project.items.length} project${
                        team.project.items.length === 1 ? "" : "s"
                      }`}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}

            {/* Create a team | BUTTON */}
            <Button
              variant="ghost"
              onClick={mixpanelize(
                session,
                "Intent to create a team",
                {
                  to: "https://app.meeshkan.com/{newTeam}",
                  from: "https://app.meeshkan.com",
                  c2a: "Create a team",
                },
                onOpen
              )}
              pos="unset"
              letterSpacing="wide"
              border="1px solid"
              borderColor={`mode.${colorMode}.tertiary`}
              p={4}
              minH="72px"
              justifyContent="start"
              color={`mode.${colorMode}.text`}
              _hover={{
                color: `mode.${colorMode}.title`,
                backgroundColor: `mode.${colorMode}.card`,
                borderColor: "transparent",
              }}
            >
              <AddIcon boxSize={10} mr={2} stroke="2px" />
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
            <ModalOverlay>
              <ModalContent
                borderRadius="sm"
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
                  borderRadius="sm"
                  size="sm"
                  mt={2}
                  mr={0}
                  color={`mode.${colorMode}.text`}
                />
                <Box
                  as="form"
                  onSubmit={handleSubmit(
                    mixpanelize(
                      session,
                      "Create a team",
                      {
                        to: "https://app.meeshkan.com/{newTeam}",
                        from: "https://app.meeshkan.com",
                        c2a: "Create team",
                      },
                      onSubmit
                    )
                  )}
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
                        borderRadius="sm"
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
                          colorScheme="blue"
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
            </ModalOverlay>
          </Modal>
        </>
      )
    )
);
