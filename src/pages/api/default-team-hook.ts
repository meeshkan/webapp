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
import { confirmOrCreateUser, NegativeConfirmOrCreateUserOutcome, UNDEFINED_ERROR as CU_UNDEFINED_ERROR } from "../../utils/user";
import { NegativeSessionFetchOutcome, NOT_LOGGED_IN, UNDEFINED_ERROR } from "./session";

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
      UNDEFINED_ERROR
    ),
    // todo - add type safety for the query
    TE.chain(({ user: { team: { count } } }) =>
      count === 0 ? TE.left(USER_HAS_NO_TEAMS()) : TE.right(constVoid())
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
      UNDEFINED_ERROR
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
          UNDEFINED_ERROR
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
            UNDEFINED_ERROR
          )
        ),
        TE.chain((res) =>
          res.ok
            ? TE.tryCatch(() => res.json(), UNDEFINED_ERROR)
            : TE.left(UNDEFINED_ERROR(res))
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
            UNDEFINED_ERROR
          )
        ),
        TE.chain((_) => TE.right(constVoid()))
      )
  )();

interface USER_HAS_NO_TEAMS {
  type: "USER_HAS_NO_TEAMS";
}
type NegativeDefaultTeamHookOutcome =
  | NegativeSessionFetchOutcome
  | NegativeConfirmOrCreateUserOutcome
  | USER_HAS_NO_TEAMS;

const USER_HAS_NO_TEAMS = (): NegativeDefaultTeamHookOutcome => ({
  type: "USER_HAS_NO_TEAMS",
});
const userType = t.type({ id: t.string });
type UserType = t.TypeOf<typeof userType>;

export default safeApi(
  (req, res) =>
    pipe(
      TE.tryCatch(() => auth0().getSession(req), UNDEFINED_ERROR),
      TE.chain(_TE.fromNullable(NOT_LOGGED_IN())),
      TE.chain((session) =>
        pipe(
          _TE.tryToEitherCatch(
            () => confirmOrCreateUser("id", userType)(session),
            CU_UNDEFINED_ERROR
          ),
          TE.chain(({ id }) => TE.right({ userId: id, ...session }))
        )
      ),
      TE.chain(
        pipe(
          _RTE.tryToEitherCatch<
            ISession & { userId: string },
            NegativeDefaultTeamHookOutcome,
            UserType
          >(confirmOrCreateUser("id", userType), UNDEFINED_ERROR),
          RTE.chain((_) =>
            _RTE.tryToEitherCatch(doesUserHaveTeams, UNDEFINED_ERROR)
          ),
          RTE.fold(
            (e) =>
              pipe(
                _RTE.tryToEitherCatch(createTeamFromUserName, UNDEFINED_ERROR),
                RTE.chain((teamId) =>
                  _RTE.tryToEitherCatch(
                    uploadPhotoForTeam(teamId),
                    UNDEFINED_ERROR
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
