export const GET_TEAMS_QUERY = `query {
  user {
    team(filter: {
      archived: {
        equals: false
      }
    }) {
      items {
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
