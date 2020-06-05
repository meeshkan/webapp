export const GET_TEAMS_QUERY = `query {
  user {
    team {
      items{
        name
        id
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
