export const GET_TEAMS_QUERY = `query {
  user {
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
