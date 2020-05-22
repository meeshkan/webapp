import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { constant, constNull, constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import { NextApiRequest, NextApiResponse } from "next";
import {
  defaultGQLErrorHandler,
  INVALID_TOKEN_ERROR,
  USER_HAS_TEAMS,
} from "../../utils/error";
import { withClient } from "../../utils/graphql";
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
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${session.idToken}`,
          },
        }).request(`query {
    user {
        team {
            count
        }
    }
}`),
      (error): NegativeDefaultTeamHookOutcome =>
        defaultGQLErrorHandler("getTeamName")(error)
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

const createTeamFromUserName = (userId: string) => ({
  idToken,
  user,
}: ISession): TE.TaskEither<NegativeDefaultTeamHookOutcome, string> =>
  pipe(
    TE.tryCatch(
      () =>
        new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
          headers: {
            authorization: `Bearer ${idToken}`,
          },
        }).request(
          `mutation(
        $userId:ID!
        $teamName:String!
      ) {
        userUpdate(
          filter: {
            id: $userId
          }
          data:{
            team: {
              create: {
                name: $teamName
              }
            }
        }) {
          team(filter: {
            name: {
              equals: $teamName
            }
          }){
            items {
              id
            }
          }
        }
      }`,
          { teamName: user.nickname, userId }
        ),
      (error): NegativeDefaultTeamHookOutcome =>
        defaultGQLErrorHandler("mutation to insert default team")(error)
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
        (error): NegativeDefaultTeamHookOutcome =>
          defaultGQLErrorHandler("query to get file upload information")(error)
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
          client.request(
            `mutation(
      $userId:ID!
      $teamId:ID!
      $fileId:String!
      $filename:String!
    ) {
      userUpdate(
        filter: {
          id:$userId
        }
        data:{
          team: {
            update:{
              filter:{
                id:$teamId
              }
              data:{
                image:{
                  create:{
                    fileId:$fileId
                    filename:$filename
                  }
                }
              }
            }
          }
        }
      ) {
        id
      }
    }`,
            {
              teamId,
              userId,
              fileId: url.split("/").slice(-1)[0],
              filename,
            }
          ),
        (error): NegativeDefaultTeamHookOutcome =>
          defaultGQLErrorHandler("file upload graphql mutation")(error)
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
