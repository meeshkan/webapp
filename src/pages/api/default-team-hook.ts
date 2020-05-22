import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import { constNull, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import { NextApiRequest, NextApiResponse } from "next";
import {
  ASSOCIATE_PHOTO_WITH_TEAM,
  CREATE_TEAM_FROM_USER_NAME,
  GET_TEAM_COUNT,
} from "../../gql/pages/api/default-team-hook";
import {
  defaultGQLErrorHandler,
  INVALID_TOKEN_ERROR,
  USER_HAS_TEAMS,
} from "../../utils/error";
import { eightBaseClient, withClient } from "../../utils/graphql";
import { logchain } from "../../utils/safeApi";
import {
  confirmOrCreateUser,
  NegativeConfirmOrCreateUserOutcome,
} from "../../utils/user";
import { NegativeSessionFetchOutcome, withSession } from "./session";

const assertUserHasNoTeams = <Session extends ISession>(
  session: Session
): TE.TaskEither<NegativeDefaultTeamHookOutcome, void> =>
  pipe(
    TE.tryCatch(
      () => eightBaseClient(session).request(GET_TEAM_COUNT),
      defaultGQLErrorHandler("getTeamName")
    ),
    // todo - add type safety for the query
    TE.chain(({ user: { team: { count } } }) =>
      count > 0
        ? TE.left<NegativeDefaultTeamHookOutcome>({
            type: "USER_HAS_TEAMS",
            msg: "User already has teams",
          })
        : TE.right(constVoid())
    )
  );

const createTeamFromUserName = (userId: string) => (
  session: ISession
): TE.TaskEither<NegativeDefaultTeamHookOutcome, string> =>
  pipe(
    TE.tryCatch(
      () =>
        eightBaseClient(session).request(CREATE_TEAM_FROM_USER_NAME, {
          teamName: session.user.nickname,
          userId,
        }),
      defaultGQLErrorHandler("mutation to insert default team")
    ),
    // todo - add type safety for the query
    TE.chain(({ userUpdate: { team: { items: [{ id }] } } }) => TE.right(id))
  );

const uploadPhotoForTeam = (userId: string, teamId: string) => (
  session: ISession
): TE.TaskEither<NegativeDefaultTeamHookOutcome, void> =>
  pipe(
    (client: GraphQLClient) =>
      TE.tryCatch(
        () =>
          client.request(`{
      fileUploadInfo {
        policy
        signature
        apiKey
        path
      }
    }`),
        defaultGQLErrorHandler("query to get file upload information")
      ),
    // todo, add type safety to GQL request
    RTE.chain(
      ({ fileUploadInfo: { policy, signature, apiKey, path } }) => (_) =>
        TE.tryCatch(
          () =>
            fetch(
              `https://www.filestackapi.com/api/store/S3?key=${apiKey}&policy=${policy}&signature=${signature}&path=${path}`,
              {
                method: "post",
                body: new URLSearchParams({
                  url:
                    session.user.picture ||
                    `https://api.adorable.io/avatars/300/${signature}.png`,
                }),
              }
            ),
          (error): NegativeDefaultTeamHookOutcome => ({
            type: "UNDEFINED_ERROR",
            msg: "Call to filestack failed",
            error,
          })
        )
    ),
    RTE.chain((res) => (_) =>
      res.ok
        ? TE.tryCatch(
            () => res.json(),
            (error) => ({
              type: "UNDEFINED_ERROR",
              msg: "Conversion of JSON from filestack failed",
              error,
            })
          )
        : TE.left({
            type: "REST_ENDPOINT_ERROR",
            msg: `Could not call filestack endpoint: ${res.status} ${res.statusText}`,
          })
    ),
    // add type safety for json
    RTE.chain(({ url, filename }) => (client) =>
      TE.tryCatch(
        () =>
          client.request(ASSOCIATE_PHOTO_WITH_TEAM, {
            teamId,
            userId,
            fileId: url.split("/").slice(-1)[0],
            filename,
          }),
        defaultGQLErrorHandler("file upload graphql mutation")
      )
    ),
    RTE.chain((_) => RTE.right(constVoid())),
    withClient(session)
  );

type NegativeDefaultTeamHookOutcome =
  | NegativeSessionFetchOutcome
  | NegativeConfirmOrCreateUserOutcome
  | USER_HAS_TEAMS
  | INVALID_TOKEN_ERROR;

const userType = t.type({ id: t.string });

export default (req: NextApiRequest, res: NextApiResponse) =>
  pipe(
    confirmOrCreateUser("id", userType),
    RTE.chainFirst((_) => assertUserHasNoTeams),
    RTE.chain(({ id }) =>
      pipe(
        createTeamFromUserName(id),
        RTE.chain((teamId) => uploadPhotoForTeam(id, teamId))
      )
    ),
    // if user has teams, we want it to return the right outcome
    // so that we don't redirect to 404
    RTE.orElse((err) =>
      err.type === "USER_HAS_TEAMS" ? RTE.right(constNull()) : RTE.left(err)
    ),
    // for all left outcomes, log what happens, as it's probably bad
    RTE.mapLeft(logchain),
    RTE.fold(
      () => RTE.right("/404"),
      () => RTE.right("/")
    ),
    RTE.chain((Location) =>
      pipe(
        res.writeHead(301, {
          Location,
        }),
        (_) => RTE.right(res.end())
      )
    ),
    withSession(req, "default-team-hook.ts default export")
  )();
