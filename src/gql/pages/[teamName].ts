export const GET_TEAM_QUERY = `query($teamName: String!) {
  user {
    team(filter:{
      name: {
        equals: $teamName
      }
    }) {
      items{
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
