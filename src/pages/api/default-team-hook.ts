import auth0 from "../../utils/auth0";
import { GraphQLClient } from "graphql-request";
import { confirmOrCreateUser } from "../../utils/user";
import fetch from "isomorphic-unfetch";

const doesUserHaveTeams = async (idToken): Promise<boolean> => {
  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    }
  );

  const query = `query {
        user {
            team {
                count
            }
        }
    }`;

  const {
    user: {
      team: { count },
    },
  } = await _8baseGraphQLClient.request(query);
  return count > 0;
};

const createTeamFromUserName = async (idToken, userId, teamName): Promise<number> => {
  const mutation = `mutation(
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
  }`;

  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    }
  );

  const {
    userUpdate: {
      team: {
        items: [{ id }],
      },
    },
  } = await _8baseGraphQLClient.request(mutation, { teamName, userId });
  return id;
};

const uploadPhotoForTeam = async (idToken, userId, teamId, photoUrl) => {
  const query = `{
    fileUploadInfo {
      policy
      signature
      apiKey
      path
    }
  }`;

  const _8baseGraphQLClient = new GraphQLClient(
    process.env.EIGHT_BASE_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    }
  );

  const {
    fileUploadInfo: {
        policy,
        signature,
        apiKey,
        path
    }
  } = await _8baseGraphQLClient.request(query);

  // from https://www.filestack.com/docs/concepts/uploading/
  // curl -X POST -d url="https://assets.filestackapi.com/watermark.png" "https://www.filestackapi.com/api/store/S3?key=MY_API_KEY"
  const params = new URLSearchParams();
  params.append("url", photoUrl);
  const uploadToFilestack = await fetch(`https://www.filestackapi.com/api/store/S3?key=${apiKey}&policy=${policy}&signature=${signature}&path=${path}`, {
      method: 'post',
      body: params
  });
  if (!uploadToFilestack.ok) {
      // well, we tried...
      throw Error('Upload to Filestack failed');
  }
  const responseFromFilestack = await uploadToFilestack.json();

  await _8baseGraphQLClient.request(`mutation(
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
  }`, {
      teamId,
      userId,
      fileId: responseFromFilestack.url.split('/').slice(-1),
      filename: responseFromFilestack.filename
  });
  
};

export default async function defaultWorkspaceHook(req, res) {
  try {
    const session = await auth0.getSession(req);
    if (!session) {
      res.status(403);
      res.send("No active session");
    }

    // the code parameter is what we will exchange with github
    // the state parameter is the user id
    const {
      user: { idToken, email, nickname, picture },
    } = session;

    const { id } = await confirmOrCreateUser("id", idToken, email);
    const userHasTeams = await doesUserHaveTeams(idToken);
    if (userHasTeams) {
      res.writeHead(301, {
        Location: "/",
      });
      return;
    }

    // if not, we try to create a new team on behalf of the user
    // with their username as the team name
    try {
      const teamId = await createTeamFromUserName(idToken, id, nickname);
      try {
        await uploadPhotoForTeam(idToken, id, teamId, picture);
      } catch (e) {
        // Assuming that this should be logged/fixed
        // but does not need any additional business logic,
        // please let me know if I'm wrong!
        console.error(e);
      }
    } catch (e) {
      // currently waiting on a spec for how to handle this
    }

    res.writeHead(301, {
        Location: "/",
    });

    res.end();
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
