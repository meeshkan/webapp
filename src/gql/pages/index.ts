export const CREATE_TEAM_MUTATION = `mutation CREATE_TEAM(
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
        name
        image {
          downloadUrl
        }
        inviteLink
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
