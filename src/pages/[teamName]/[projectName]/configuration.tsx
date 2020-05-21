import React, { useState } from "react";
import {
  Box,
  useColorMode,
  Grid,
  Stack,
  FormControl,
  Input,
  FormLabel,
  Button,
  Icon,
  Tooltip,
  Flex,
  Switch,
  LightMode,
  Link,
  useToastOptions,
  useToast,
} from "@chakra-ui/core";
import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as _E from "../../../fp-ts/Either";
import * as _RTE from "../../../fp-ts/ReaderTaskEither";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import Card from "../../../components/molecules/card";
import { ItemLink, stringToUrl } from "../../../components/molecules/navLink";
import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { useForm, Controller } from "react-hook-form";
import ErrorComponent from "../../../components/molecules/error";
import {
  defaultGQLErrorHandler,
  INCORRECT_TYPE_SAFETY,
  NOT_LOGGED_IN,
  TEAM_DOES_NOT_EXIST,
  PROJECT_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  INVALID_TOKEN_ERROR,
  GET_SERVER_SIDE_PROPS_ERROR,
  LENS_ACCESSOR_ERROR,
} from "../../../utils/error";
import { retrieveSession } from "../../api/session";
import { flow, constNull, constVoid, constant } from "fp-ts/lib/function";
import { Lens } from "monocle-ts";
import { confirmOrCreateUser } from "../../../utils/user";
import { Loading, hookNeedingFetch } from "../../../utils/hookNeedingFetch";
import { useRouter } from "next/router";
import { optionalHead } from "../../../monocle-ts";
import { SEPARATOR } from "../../../utils/separator";
import { thunk } from "../../../fp-ts/function";

type NegativeConfigurationFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY;

const Configuration = t.type({
  buildCommand: t.union([t.null, t.string]),
  openAPISpec: t.union([t.null, t.string]),
  directory: t.union([t.null, t.string]),
});

type IConfiguration = t.TypeOf<typeof Configuration>;

type IConfigurationProps = {
  session: ISession;
  configuration?: IConfiguration;
  teamName: string;
  projectName: string;
  id: string;
};

const Project = t.type({
  name: t.string,
  configuration: t.union([t.null, Configuration]),
});

type IProject = t.TypeOf<typeof Project>;

const Team = t.type({
  image: t.type({
    downloadUrl: t.string,
  }),
  name: t.string,
  project: t.type({
    items: t.array(Project),
  }),
});

type ITeam = t.TypeOf<typeof Team>;

const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team),
    }),
  }),
});

type QueryTp = t.TypeOf<typeof queryTp>;
const getConfiguration = (teamName: string, projectName: string) => async (
  session: ISession
): Promise<E.Either<NegativeConfigurationFetchOutcome, IConfiguration>> =>
  pipe(
    TE.tryCatch<NegativeConfigurationFetchOutcome, any>(
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(
          `query(
            $teamName: String!
            $projectName:String!
          ) {
            user {
              team(filter:{
                name: {
                  equals: $teamName
                }
              }) {
                items{
                  image {
                    downloadUrl
                  }
                  name
                  project(filter:{
                    name: {
                      equals: $projectName
                    }
                  }) {
                    items {
                      name
                      configuration{
                        buildCommand
                        openAPISpec
                        directory
                      }
                    }
                  }
                }
              }
            }
          }`,
          { teamName, projectName }
        ),
      (error): NegativeConfigurationFetchOutcome =>
        defaultGQLErrorHandler("getConfiguration query")(error)
    ),
    TE.chainEitherK<NegativeConfigurationFetchOutcome, any, QueryTp>(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeConfigurationFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode team name query",
            errors,
          })
        )
      )
    ),
    TE.chainEitherK<NegativeConfigurationFetchOutcome, QueryTp, IConfiguration>(
      flow(
        Lens.fromPath<QueryTp>()(["user", "team", "items"]).get,
        A.head,
        E.fromOption(
          (): NegativeConfigurationFetchOutcome => ({
            type: "TEAM_DOES_NOT_EXIST",
            msg: `Could not find team for: ${teamName} ${projectName}`,
          })
        ),
        E.chain((team) =>
          pipe(
            team,
            Lens.fromPath<ITeam>()(["project", "items"]).get,
            A.head,
            E.fromOption(
              (): NegativeConfigurationFetchOutcome => ({
                type: "PROJECT_DOES_NOT_EXIST",
                msg: `Could not find project for: ${teamName} ${projectName}`,
              })
            ),
            E.chain((project) =>
              pipe(
                project,
                Lens.fromPath<IProject>()(["configuration"]).get,
                O.fromNullable,
                O.getOrElse<IConfiguration>(() => ({
                  buildCommand: null,
                  openAPISpec: null,
                  directory: null,
                })),
                (configuration) => E.right(configuration)
              )
            )
          )
        )
      )
    )
  )();

const userType = t.type({ id: t.string });
type UserType = t.TypeOf<typeof userType>;

export const getServerSideProps = ({
  params: { teamName, projectName },
  req,
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, IConfigurationProps>;
}> =>
  pipe(
    retrieveSession(req, "configuration.tsx getServerSideProps"),
    TE.chain(
      pipe(
        _RTE.tryToEitherCatch<
          ISession,
          NegativeConfigurationFetchOutcome,
          UserType
        >(
          confirmOrCreateUser("id", userType),
          (error): NegativeConfigurationFetchOutcome => ({
            type: "UNDEFINED_ERROR",
            msg:
              "Unanticipated confirm or create user error in configuration.tsx",
            error,
          })
        ),
        RTE.chain<
          ISession,
          NegativeConfigurationFetchOutcome,
          UserType,
          { id: string; configuration: IConfiguration }
        >(({ id }) =>
          _RTE.tryToEitherCatch<
            ISession,
            NegativeConfigurationFetchOutcome,
            { id: string; configuration: IConfiguration }
          >(
            flow(
              getConfiguration(teamName, projectName),
              constant,
              TE.chain((configuration) => TE.right({ configuration, id })),
              thunk
            ),
            (error): NegativeConfigurationFetchOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Unanticipated getTeam error",
              error,
            })
          )
        ),
        _RTE.chainEitherKWithAsk<
          ISession,
          NegativeConfigurationFetchOutcome,
          { id: string; configuration: IConfiguration },
          IConfigurationProps
        >(({ id, configuration }) => (session) =>
          E.right<NegativeConfigurationFetchOutcome, IConfigurationProps>({
            session,
            id,
            configuration,
            teamName,
            projectName,
          })
        )
      )
    )
  )().then(_E.eitherSanitizedWithGenericError);

const updateConfigurationVariables = t.type({
  teamName: t.string,
  userId: t.string,
  namePlusTeamName: t.string,
  buildCommand: t.string,
  openAPISpec: t.string,
  directory: t.string,
  teamNameAsPredicate: t.type({
    equals: t.string,
  }),
  projectNameAsPredicate: t.type({
    equals: t.string,
  }),
});
type UpdateConfigurationVariables = t.TypeOf<
  typeof updateConfigurationVariables
> & {
  toast: (props: useToastOptions) => void;
  setConfiguration: React.Dispatch<
    React.SetStateAction<
      E.Either<
        Loading,
        E.Either<NegativeConfigurationFetchOutcome, IConfiguration>
      >
    >
  >;
};

const updatedConfigurationProject = t.type({
  name: t.string,
  configuration: Configuration,
});

type UpdatedConfigurationProject = t.TypeOf<typeof updatedConfigurationProject>;

const updatedConfigurationTeam = t.type({
  name: t.string,
  id: t.string,
  project: t.type({
    items: t.array(updatedConfigurationProject),
  }),
});

type UpdatedConfigurationTeam = t.TypeOf<typeof updatedConfigurationTeam>;

const updatedConfigurationType = t.type({
  userUpdate: t.type({
    id: t.string,
    team: t.type({
      items: t.array(updatedConfigurationTeam),
    }),
  }),
});

type UpdatedConfigurationType = t.TypeOf<typeof updatedConfigurationType>;

type NegativeUpdateConfigurationOutcome =
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY
  | LENS_ACCESSOR_ERROR;

const mk_LENS_ACCESSOR_ERROR = (): NegativeUpdateConfigurationOutcome => ({
  type: "LENS_ACCESSOR_ERROR",
  msg: "Could not access required properties on returned value",
});

const updateConfiguration = ({
  toast,
  setConfiguration,
  ...updateConfigurationVariables
}: UpdateConfigurationVariables) => (
  session: ISession
): TE.TaskEither<NegativeUpdateConfigurationOutcome, void> =>
  TE.bracket<NegativeUpdateConfigurationOutcome, void, void>(
    () =>
      Promise.resolve(
        E.right<NegativeUpdateConfigurationOutcome, void>(constNull())
      ),
    () =>
      pipe(
        TE.tryCatch(
          () =>
            new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
              headers: {
                authorization: `Bearer ${session.idToken}`,
              },
            }).request(
              `mutation CREATE_CONFIGURATION(
              $userId:ID!,
              $teamName: String!,
              $namePlusTeamName:String!,
              $buildCommand:String!,
              $openAPISpec:String!,
              $directory:String!,
              $teamNameAsPredicate:StringPredicate!
              $projectNameAsPredicate:StringPredicate!) {
                    userUpdate(filter: {
                      id: $userId
                    }
                    force: true
                    data:{
                      team: {
                        update: {
                          filter:{
                            name:$teamName
                          }
                          data:{
                            project: {
                              update: {
                                filter: {
                                  namePlusTeamName: $namePlusTeamName
                                }
                                data:{
                                  configuration:{
                                    create:{
                                      buildCommand:$buildCommand
                                      openAPISpec:$openAPISpec
                                      directory:$directory
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }) {
                      id
                      team(filter:{
                        name:$teamNameAsPredicate
                      }) {
                        items{
                          name
                          id
                          project(filter:{
                            name:$projectNameAsPredicate
                          }) {
                            items {
                              name
                              configuration {
                                  buildCommand
                                  directory
                                  openAPISpec
                              }
                            }
                          }
                        }
                      }
                    }
                  }`,
              updateConfigurationVariables
            ),
          (error): NegativeUpdateConfigurationOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Could not make import project mutation",
            error,
          })
        ),
        TE.chainEitherK(
          flow(
            updatedConfigurationType.decode,
            E.mapLeft(
              (errors): NegativeUpdateConfigurationOutcome => ({
                type: "INCORRECT_TYPE_SAFETY",
                msg:
                  "Teams list from gql endpoint does not match type definition",
                errors,
              })
            )
          )
        ),
        TE.chain(
          flow(
            Lens.fromPath<UpdatedConfigurationType>()([
              "userUpdate",
              "team",
              "items",
            ])
              .composeOptional(optionalHead())
              .composeLens(
                Lens.fromPath<UpdatedConfigurationTeam>()(["project", "items"])
              )
              .composeOptional(optionalHead())
              .composeLens(
                Lens.fromPath<UpdatedConfigurationProject>()(["configuration"])
              ).getOption,
            O.chainFirst((congurationUpdate) =>
              O.some(setConfiguration(E.right(E.right(congurationUpdate))))
            ),
            O.fold(
              () => TE.left(mk_LENS_ACCESSOR_ERROR()),
              () => TE.right(constNull())
            )
          )
        ),
        TE.chain((_) => TE.right(constNull())),
        TE.mapLeft((l) =>
          pipe(
            toast({
              title: "Oh no!",
              description:
                "We could not update your configuration. Please try again soon!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            }),
            constant(l)
          )
        )
      ),
    (_, e) => () => Promise.resolve(E.right(constVoid()))
  );

const items = ["Build settings", "Slack integration"];

const ConfigurationPage = (
  props: E.Either<NegativeConfigurationFetchOutcome, IConfigurationProps>
) =>
  pipe(
    props,
    E.fold(
      () => (
        <ErrorComponent
          errorMessage={
            "Meeshkan is temporarily offline. We are aware of the problem and are working hard to resolve it. For online support, please contact us using the Itercom icon below."
          }
        />
      ),
      ({
        session,
        configuration,
        teamName,
        projectName,
        id,
      }: IConfigurationProps) =>
        pipe(
          {
            useColorMode: useColorMode(),
            toast: useToast(),
            useForm: useForm({
              ...(configuration ? { defaultValues: configuration } : {}),
            }),
            useGetConfiguration: hookNeedingFetch(() =>
              getConfiguration(teamName, projectName)(session)
            ),
            useNotifications: useState(false),
            slackClick: (e) => {
              e.preventDefault();
              useRouter().push(
                `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_OAUTH_APP_CLIENT_ID}&scope=incoming-webhook&state=${session.user.sub}&redirect_uri=${process.env.SLACK_OAUTH_REDIRECT_URI}`
              );
            },
          },
          (p) => ({
            ...p,
            onSubmit: (values: IConfiguration) =>
              updateConfiguration({
                toast: p.toast,
                setConfiguration: p.useGetConfiguration[2],
                ...values,
                teamName,
                projectNameAsPredicate: {
                  equals: projectName,
                },
                teamNameAsPredicate: {
                  equals: teamName,
                },
                userId: id,
                namePlusTeamName: `${projectName}${SEPARATOR}${teamName}`,
              })(session)().then(constNull),
            configuration:
              E.isRight(p.useGetConfiguration[0]) &&
              E.isRight(p.useGetConfiguration[0].right)
                ? p.useGetConfiguration[0].right.right
                : configuration
                ? configuration
                : { openAPISpec: null, buildCommand: null, directory: null },
          }),
          ({
            useColorMode: { colorMode },
            useForm: { handleSubmit, formState, register },
            useNotifications: [notifications, setNotificaitons],
            slackClick,
            onSubmit,
          }) => (
            <Grid
              templateColumns={[
                "repeat(auto-fit, 1fr)",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
              ]}
              gap={20}
            >
              <Box
                bg={`mode.${colorMode}.card`}
                rounded="sm"
                pos="sticky"
                top={136}
                p={4}
                gridArea="1 / 1 / 2 / 2"
              >
                {items.map((link, i) => (
                  <ItemLink key={i} href={stringToUrl(link)}>
                    {link}
                  </ItemLink>
                ))}
              </Box>
              <Stack
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                w="100%"
                spacing={8}
                gridArea="1 / 2 / 4 / 4"
                overflow="auto"
              >
                <Card heading="Build settings" id={`build-settings`}>
                  <FormControl d="flex" alignItems="center" mt={4}>
                    <FormLabel
                      fontWeight={500}
                      color={`mode.${colorMode}.title`}
                      minW="160px"
                      mr={4}
                      p={0}
                    >
                      Root directory
                      <Tooltip
                        hasArrow
                        label="Where is your app located in this repository?"
                        aria-label="Where is your app located in this repository?"
                        placement="right"
                      >
                        <Icon
                          name="info"
                          size="12px"
                          ml={2}
                          color={`mode.${colorMode}.text`}
                        />
                      </Tooltip>
                    </FormLabel>
                    <Input
                      borderColor={`mode.${colorMode}.icon`}
                      color={`mode.${colorMode}.text`}
                      rounded="sm"
                      size="sm"
                      name="directory"
                      ref={register}
                    />
                  </FormControl>

                  <FormControl d="flex" alignItems="center" mt={4}>
                    <FormLabel
                      fontWeight={500}
                      color={`mode.${colorMode}.title`}
                      minW="160px"
                      mr={4}
                      p={0}
                    >
                      Build command
                      <Tooltip
                        hasArrow
                        label="The command(s) your app framework provides for compiling your code."
                        aria-label="The command(s) your app framework provides for compiling your code."
                        placement="right"
                      >
                        <Icon
                          name="info"
                          size="12px"
                          ml={2}
                          color={`mode.${colorMode}.text`}
                        />
                      </Tooltip>
                    </FormLabel>
                    <Input
                      borderColor={`mode.${colorMode}.icon`}
                      color={`mode.${colorMode}.text`}
                      rounded="sm"
                      size="sm"
                      name="buildCommand"
                      ref={register}
                    />
                  </FormControl>

                  <FormControl d="flex" alignItems="center" my={4}>
                    <FormLabel
                      fontWeight={500}
                      color={`mode.${colorMode}.title`}
                      minW="160px"
                      mr={4}
                      p={0}
                    >
                      OpenAPI location
                      <Tooltip
                        hasArrow
                        label="Where is your OpenAPI spec located in this repository?"
                        aria-label="Where is your OpenAPI spec located in this repository?"
                        placement="right"
                      >
                        <Icon
                          name="info"
                          size="12px"
                          ml={2}
                          color={`mode.${colorMode}.text`}
                        />
                      </Tooltip>
                    </FormLabel>
                    <Input
                      borderColor={`mode.${colorMode}.icon`}
                      color={`mode.${colorMode}.text`}
                      rounded="sm"
                      size="sm"
                      name="openAPISpec"
                      ref={register}
                    />
                  </FormControl>

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
                        Save
                      </Button>
                    </LightMode>
                  </Flex>
                </Card>

                <Box h={4} />

                <Card heading="Slack integration" id={`slack-integration`}>
                  <Flex justifyContent="space-between" my={4}>
                    <FormLabel color={`mode.${colorMode}.text`}>
                      Global notifications{" "}
                      {notifications == true ? "on" : "off"}
                    </FormLabel>
                    <Switch
                      isChecked={notifications}
                      onChange={() => setNotificaitons(!notifications)}
                    />
                  </Flex>
                  <Link
                    color={colorMode === "light" ? "blue.500" : "blue.200"}
                    onClick={slackClick}
                    aria-label="Link to slack to authorize posting notifications from Meeshkan"
                    verticalAlign="middle"
                  >
                    <Icon name="slack" mr={2} />
                    Install the slack app here
                  </Link>
                </Card>
              </Stack>
            </Grid>
          )
        )
    )
  );

export default ConfigurationPage;
