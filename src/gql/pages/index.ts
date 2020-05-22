export const CREATE_PROJECT_MUTATION = `mutation CREATE_PROJECT($userId:ID!, $teamName:String!, $repositoryName: String!, $namePlusTeam: String!, $nodePlusTeam: String!, $nodeID: String!) {
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
        name
        id
        image {
          downloadUrl
        }
        project {
          items {
            name
            repository {
                nodeId
            }
          }
        }
      }
    }
  }
}`;
