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
        project {
          items {
            name
          }
        }
      }
    }
  }
}`;
