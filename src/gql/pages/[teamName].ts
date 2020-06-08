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
