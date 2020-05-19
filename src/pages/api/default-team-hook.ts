import { ISession } from "@auth0/nextjs-auth0/dist/session/session";
import * as E from "fp-ts/lib/Either";
import { constVoid } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import { GraphQLClient } from "graphql-request";
import * as t from "io-ts";
import fetch from "isomorphic-unfetch";
import * as _RTE from "../../fp-ts/ReaderTaskEither";
import * as _TE from "../../fp-ts/TaskEither";
import auth0 from "../../utils/auth0";
import safeApi, { _400ErrorHandler } from "../../utils/safeApi";
import {
  confirmOrCreateUser,
  NegativeConfirmOrCreateUserOutcome,
} from "../../utils/user";
import { NegativeSessionFetchOutcome, retrieveSession } from "./session";
import {
  INVALID_TOKEN_ERROR,
  USER_HAS_NO_TEAMS,
  defaultGQLErrorHandler,
} from "../../utils/error";

const doesUserHaveTeams = <Session extends { idToken?: string }>(
  session: Session
): Promise<E.Either<NegativeDefaultTeamHookOutcome, void>> =>
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
      count === 0
        ? TE.left<NegativeDefaultTeamHookOutcome>({
            type: "USER_HAS_NO_TEAMS",
            msg: "Could not find any team for user",
          })
        : TE.right(constVoid())
    )
  )();

const createTeamFromUserName = ({
  idToken,
  user,
  userId,
}: ISession & { userId: string }): Promise<
  E.Either<NegativeDefaultTeamHookOutcome, string>
> =>
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
  )();

const uploadPhotoForTeam = (teamId) => ({
  idToken,
  userId,
  user,
}: ISession & { userId: string }): Promise<
  E.Either<NegativeDefaultTeamHookOutcome, void>
> =>
  pipe(
    new GraphQLClient(process.env.EIGHT_BASE_ENDPOINT, {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    }),
    (client) =>
      pipe(
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
            defaultGQLErrorHandler("query to get file upload information")(
              error
            )
        ),
        // todo, add type safety to GQL request
        TE.chain(({ fileUploadInfo: { policy, signature, apiKey, path } }) =>
          TE.tryCatch(
            () =>
              fetch(
                `https://www.filestackapi.com/api/store/S3?key=${apiKey}&policy=${policy}&signature=${signature}&path=${path}`,
                {
                  method: "post",
                  body: new URLSearchParams({ url: user.picture }),
                }
              ),
            (error): NegativeDefaultTeamHookOutcome => ({
              type: "UNDEFINED_ERROR",
              msg: "Call to filestack failed",
              error,
            })
          )
        ),
        TE.chain((res) =>
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
        TE.chain(({ url, filename }) =>
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
        TE.chain((_) => TE.right(constVoid()))
      )
  )();

type NegativeDefaultTeamHookOutcome =
  | NegativeSessionFetchOutcome
  | NegativeConfirmOrCreateUserOutcome
  | USER_HAS_NO_TEAMS
  | INVALID_TOKEN_ERROR;

const userType = t.type({ id: t.string });
type UserType = t.TypeOf<typeof userType>;

export default safeApi(
  (req, res) =>
    pipe(
      retrieveSession(req, "default-team-hook.ts default export"),
      TE.chain((session) =>
        pipe(
          _TE.tryToEitherCatch(
            () => confirmOrCreateUser("id", userType)(session),
            (error): NegativeDefaultTeamHookOutcome => ({
              type: "UNDEFINED_ERROR",
              msg:
                "Unanticipated confirm or create user error in default team hook",
              error,
            })
          ),
          TE.chain(({ id }) => TE.right({ userId: id, ...session }))
        )
      ),
      TE.chain(
        pipe(
          _RTE.tryToEitherCatch(
            confirmOrCreateUser("id", userType),
            (error): NegativeDefaultTeamHookOutcome => ({
              type: "UNDEFINED_ERROR",
              msg:
                "Unanticipated confirm or create user error in default team hook",
              error,
            })
          ),
          RTE.chain((_) =>
            _RTE.tryToEitherCatch(
              doesUserHaveTeams,
              (error): NegativeDefaultTeamHookOutcome => ({
                type: "UNDEFINED_ERROR",
                msg:
                  "Unanticipated confirm or create user error in doesUserHaveTeams",
                error,
              })
            )
          ),
          RTE.fold(
            (e) =>
              pipe(
                _RTE.tryToEitherCatch(
                  createTeamFromUserName,
                  (error): NegativeDefaultTeamHookOutcome => ({
                    type: "UNDEFINED_ERROR",
                    msg:
                      "Unanticipated confirm or create user error in createTeamFromUserName",
                    error,
                  })
                ),
                RTE.chain((teamId) =>
                  _RTE.tryToEitherCatch(
                    uploadPhotoForTeam(teamId),
                    (error): NegativeDefaultTeamHookOutcome => ({
                      type: "UNDEFINED_ERROR",
                      msg:
                        "Unanticipated confirm or create user error in uploadPhotoForTeam",
                      error,
                    })
                  )
                ),
                RTE.chain((_) => RTE.right(constVoid()))
              ),
            () => RTE.right(constVoid())
          )
        )
      ),
      TE.chain((_) =>
        TE.right(
          res.writeHead(301, {
            Location: "/",
          })
        )
      ),
      TE.chain((_) => TE.right(constVoid()))
    ),
  _400ErrorHandler
);
