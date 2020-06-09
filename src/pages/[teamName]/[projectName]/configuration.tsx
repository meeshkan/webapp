import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Input,
  LightMode,
  Link,
  Stack,
  Switch,
  Tooltip,
  useColorMode,
  useToast,
  useToastOptions,
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton
} from "@chakra-ui/core";
import * as E from "fp-ts/lib/Either";
import { constant, constNull, constVoid, flow } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { Lens } from "monocle-ts";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Card from "../../../components/molecules/card";
import { withError } from "../../../components/molecules/error";
import { ItemLink, stringToUrl } from "../../../components/molecules/navLink";
import * as _E from "../../../fp-ts/Either";
import {
  CREATE_CONFIGURATION,
  UPDATE_CONFIGURATION,
  GET_CONFIGURATION_QUERY
} from "../../../gql/pages/[teamName]/[projectName]/configuration";
import {
  LensTaskEither,
  lensTaskEitherHead,
  optionalHead
} from "../../../monocle-ts";
import ReactGA from "react-ga";
import {
  defaultGQLErrorHandler,
  GET_SERVER_SIDE_PROPS_ERROR,
  INCORRECT_TYPE_SAFETY,
  INVALID_TOKEN_ERROR,
  LENS_ACCESSOR_ERROR,
  NOT_LOGGED_IN,
  PROJECT_DOES_NOT_EXIST,
  TEAM_DOES_NOT_EXIST,
  UNDEFINED_ERROR,
  UNKNOWN_GRAPHQL_ERROR
} from "../../../utils/error";
import { eightBaseClient, upsertHack } from "../../../utils/graphql";
import { hookNeedingFetch, Loading } from "../../../utils/hookNeedingFetch";
import { SEPARATOR } from "../../../utils/separator";
import { confirmOrCreateUser, getUserIdFromIdOrEnv } from "../../../utils/user";
import { withSession } from "../../api/session";
import { getSlackOAuthState } from "../../../utils/oauth";

type NegativeConfigurationFetchOutcome =
  | NOT_LOGGED_IN
  | TEAM_DOES_NOT_EXIST
  | PROJECT_DOES_NOT_EXIST
  | INVALID_TOKEN_ERROR
  | UNKNOWN_GRAPHQL_ERROR
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY;

const Configuration = t.type({
  buildCommand: t.union([t.null, t.string]),
  openAPISpec: t.union([t.null, t.string]),
  directory: t.union([t.null, t.string])
});

type IConfiguration = t.TypeOf<typeof Configuration>;

type IConfigurationProps = {
  session: ISession;
  configuration?: IConfiguration;
  teamName: string;
  projectName: string;
  id: string;
  slackOauthState: string;
};

const Project = t.type({
  name: t.string,
  configuration: t.union([t.null, Configuration])
});

type IProject = t.TypeOf<typeof Project>;

const Team = t.type({
  image: t.type({
    downloadUrl: t.string
  }),
  name: t.string,
  project: t.type({
    items: t.array(Project)
  })
});

type ITeam = t.TypeOf<typeof Team>;

const queryTp = t.type({
  user: t.type({
    team: t.type({
      items: t.array(Team)
    })
  })
});

type QueryTp = t.TypeOf<typeof queryTp>;
const getConfiguration = (teamName: string, projectName: string) => (
  session: ISession
): TE.TaskEither<NegativeConfigurationFetchOutcome, IConfiguration> =>
  pipe(
    TE.tryCatch<NegativeConfigurationFetchOutcome, any>(
      () =>
        eightBaseClient(session).request(GET_CONFIGURATION_QUERY, {
          teamName,
          projectName
        }),
      defaultGQLErrorHandler("getConfiguration query")
    ),
    TE.chainEitherK<NegativeConfigurationFetchOutcome, any, QueryTp>(
      flow(
        queryTp.decode,
        E.mapLeft(
          (errors): NegativeConfigurationFetchOutcome => ({
            type: "INCORRECT_TYPE_SAFETY",
            msg: "Could not decode team name query",
            errors
          })
        )
      )
    ),
    LensTaskEither.fromPath<NegativeConfigurationFetchOutcome, QueryTp>()([
      "user",
      "team",
      "items"
    ])
      .compose(
        lensTaskEitherHead<NegativeConfigurationFetchOutcome, ITeam>(
          TE.left({
            type: "TEAM_DOES_NOT_EXIST",
            msg: `Could not find team for: ${teamName} ${projectName}`
          })
        )
      )
      .compose(
        LensTaskEither.fromPath<NegativeConfigurationFetchOutcome, ITeam>()([
          "project",
          "items"
        ])
      )
      .compose(
        lensTaskEitherHead<NegativeConfigurationFetchOutcome, IProject>(
          TE.left({
            type: "PROJECT_DOES_NOT_EXIST",
            msg: `Could not find project for: ${teamName} ${projectName}`
          })
        )
      )
      .compose(
        LensTaskEither.fromProp<NegativeConfigurationFetchOutcome, IProject>()(
          "configuration"
        )
      ).get,
    TE.chain(configuration =>
      TE.right(
        configuration || {
          openAPISpec: null,
          buildCommand: null,
          directory: null
        }
      )
    )
  );

const userType = t.type({ id: t.string });

export const getServerSideProps = ({
  params: { teamName, projectName },
  req
}): Promise<{
  props: E.Either<GET_SERVER_SIDE_PROPS_ERROR, IConfigurationProps>;
}> =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chain(({ id }) =>
      flow(
        getConfiguration(teamName, projectName),
        TE.chain(configuration => TE.right({ configuration, id }))
      )
    ),
    RTE.chain(p =>
      pipe(
        getSlackOAuthState<NegativeConfigurationFetchOutcome>(
          teamName,
          projectName
        ),
        RTE.fromReaderEither,
        RTE.chain(slackOauthState => RTE.right({ slackOauthState, ...p }))
      )
    ),
    RTE.chain(p => session =>
      TE.right({
        ...p,
        session,
        teamName,
        projectName
      })
    ),
    withSession<NegativeConfigurationFetchOutcome, IConfigurationProps>(
      req,
      "configuration.tsx getServerSideProps"
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
    equals: t.string
  }),
  projectNameAsPredicate: t.type({
    equals: t.string
  })
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
  configuration: Configuration
});

type UpdatedConfigurationProject = t.TypeOf<typeof updatedConfigurationProject>;

const updatedConfigurationTeam = t.type({
  name: t.string,
  id: t.string,
  project: t.type({
    items: t.array(updatedConfigurationProject)
  })
});

type UpdatedConfigurationTeam = t.TypeOf<typeof updatedConfigurationTeam>;

const updatedConfigurationType = t.type({
  userUpdate: t.type({
    id: t.string,
    team: t.type({
      items: t.array(updatedConfigurationTeam)
    })
  })
});

type UpdatedConfigurationType = t.TypeOf<typeof updatedConfigurationType>;

type NegativeUpdateConfigurationOutcome =
  | UNDEFINED_ERROR
  | INCORRECT_TYPE_SAFETY
  | LENS_ACCESSOR_ERROR;

const mk_LENS_ACCESSOR_ERROR = (): NegativeUpdateConfigurationOutcome => ({
  type: "LENS_ACCESSOR_ERROR",
  msg: "Could not access required properties on returned value"
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
            upsertHack(
              session,
              CREATE_CONFIGURATION,
              UPDATE_CONFIGURATION,
              updateConfigurationVariables
            ),
          (error): NegativeUpdateConfigurationOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Could not make import project mutation",
            error
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
                errors
              })
            )
          )
        ),
        TE.chain(
          flow(
            Lens.fromPath<UpdatedConfigurationType>()([
              "userUpdate",
              "team",
              "items"
            ])
              .composeOptional(optionalHead())
              .composeLens(
                Lens.fromPath<UpdatedConfigurationTeam>()(["project", "items"])
              )
              .composeOptional(optionalHead())
              .composeLens(
                Lens.fromPath<UpdatedConfigurationProject>()(["configuration"])
              ).getOption,
            O.chainFirst(congurationUpdate =>
              O.some(setConfiguration(E.right(E.right(congurationUpdate))))
            ),
            O.fold(
              () => TE.left(mk_LENS_ACCESSOR_ERROR()),
              () => TE.right(constNull())
            )
          )
        ),
        TE.chain(_ =>
          TE.right(
            ReactGA.event({
              category: "Projects",
              action: "Configure",
              label: "configuration.tsx"
            })
          )
        ),
        // TODO: is there an equivalent of mapLeft that is kinda like
        // chainFirst?
        TE.mapLeft(
          l =>
            ({
              _: toast({
                title: "Oh no!",
                description:
                  "We could not update your configuration. Please try again soon!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right"
              }),
              __: l
            }.__)
        )
      ),
    (_, e) => () => Promise.resolve(E.right(constVoid()))
  );

const items = ["Build settings", "Slack integration"];

const ConfigurationPage = withError<
  NegativeConfigurationFetchOutcome,
  IConfigurationProps
>(
  "Meeshkan is temporarily offline. We are aware of the problem and are working hard to resolve it. Please check back soon!",
  ({
    session,
    configuration,
    teamName,
    projectName,
    slackOauthState,
    id
  }: IConfigurationProps) =>
    pipe(
      {
        useColorMode: useColorMode(),
        toast: useToast(),
        useForm: useForm({
          ...(configuration ? { defaultValues: configuration } : {})
        }),
        useGetConfiguration: hookNeedingFetch(
          getConfiguration(teamName, projectName)(session)
        ),
        useNotifications: useState(false),
        useAlert: useState(true)
      },
      p => ({
        ...p,
        onSubmit: (values: IConfiguration) =>
          updateConfiguration({
            toast: p.toast,
            setConfiguration: p.useGetConfiguration[2],
            ...values,
            teamName,
            projectNameAsPredicate: {
              equals: projectName
            },
            teamNameAsPredicate: {
              equals: teamName
            },
            userId: getUserIdFromIdOrEnv(id),
            namePlusTeamName: `${projectName}${SEPARATOR}${teamName}`
          })(session)().then(constNull),
        configuration:
          E.isRight(p.useGetConfiguration[0]) &&
          E.isRight(p.useGetConfiguration[0].right)
            ? p.useGetConfiguration[0].right.right
            : configuration
            ? configuration
            : { openAPISpec: null, buildCommand: null, directory: null }
      }),
      ({
        useColorMode: { colorMode },
        useForm: { handleSubmit, formState, register },
        useNotifications: [notifications, setNotificaitons],
        useAlert: [alert, showAlert],
        onSubmit
      }) => (
        <Grid
          templateColumns={[
            "repeat(auto-fit, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)"
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
            <Alert
              display={alert ? "flex" : "none"}
              status="warning"
              alignItems="flex-start"
              rounded="sm"
            >
              <AlertIcon mt={0.75} />
              <Box>
                <AlertDescription
                  color={colorMode === "light" ? "yellow.900" : "yellow.50"}
                >
                  Testing with production data can lead to irreparable data
                  loss. Be sure to check your credentials before saving.
                </AlertDescription>
              </Box>
              <CloseButton
                onClick={() => showAlert(false)}
                color={`mode.${colorMode}.text`}
                pos="absolute"
                top="8px"
                right="8px"
              />
            </Alert>
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
                  Global notifications {notifications == true ? "on" : "off"}
                </FormLabel>
                <Switch
                  isChecked={notifications}
                  onChange={() => setNotificaitons(!notifications)}
                />
              </Flex>
              <Link
                color={colorMode === "light" ? "blue.500" : "blue.200"}
                href={`https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_OAUTH_APP_CLIENT_ID}&scope=incoming-webhook&state=${slackOauthState}&redirect_uri=${process.env.SLACK_OAUTH_REDIRECT_URI}`}
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
);

export default ConfigurationPage;
