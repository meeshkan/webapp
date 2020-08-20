export const GET_TEAM_QUERY = `query($teamName: String!) {
  user {
    team(filter:{
      name: {
        equals: $teamName
      }
    }) {
      items{
        id
        name
        stripeCustomerId
        image {
          downloadUrl
        }
        inviteLink
        plan
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
              owner
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
      items {
        id
        name
        image {
          downloadUrl
        }
        inviteLink
        plan
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
            repository {
              nodeId
              owner
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

export const UPDATE_TEAM_MUTATION = `mutation UPDATE_TEAM($userId: ID!, $teamName: String!, $newTeamName: String!) {
  userUpdate(filter: {id: $userId}, data: {team: {update: {filter: {name: $teamName}, data: {name: $newTeamName}}}}) {
    team(filter: {name: {equals: $newTeamName}}) {
      items {
        id
        name
        image {
          downloadUrl
        }
        inviteLink
        plan
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
              owner
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
