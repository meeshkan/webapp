export const CREATE_PROJECT_MUTATION = `mutation CREATE_PROJECT($userId:ID!, $teamName:String!, $repositoryName: String!, $owner: String!, $namePlusTeam: String!, $nodePlusTeam: String!, $nodeID: String!) {
  userUpdate(filter: {
    id: $userId
  },
  data:{
    team: {
      update: {
        filter:{
          name:$teamName
        }
        data:{
          project: {
            create: {
              name: $repositoryName
              namePlusTeamName: $namePlusTeam
              repository: {
                create:{
                  owner: $owner
                  name: $repositoryName
                  nodeId: $nodeID
                  nodeIdPlusTeamId:$nodePlusTeam
                }
              }
            }
          }
        }
      }
    }
  }) {
    id
    team {
      items{
        id
        inviteLink
        name
        image {
          downloadUrl
        }
        users {
          items {
            email
            status
            avatar {
              downloadUrl
            }
          }
        }
        project {
          items {
            name
            repository {
              nodeId
            }
            configuration {
              id
            }
          }
        }
      }
    }
  }
}`;
