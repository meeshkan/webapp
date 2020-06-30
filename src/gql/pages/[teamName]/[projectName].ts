export const GET_PROJECT_QUERY = `query(
  $teamName: String!
  $projectName:String!
) {
  user {
    team(filter:{
      name: {
        equals: $teamName
      }
    }) {
      items{
        image {
          downloadUrl
        }
        name
        project(filter:{
          name: {
            equals: $projectName
          }
        }) {
          items {
            name
            configuration { id }
            tests {
              items {
                id
                location
                status
                createdAt
                commitHash
                testType
              }
            }
          }
        }
      }
    }
  }
}`;
