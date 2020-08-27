export const GET_TEST_QUERY = `query(
  $teamName: String!
  $projectName:String!
  $testID:ID!
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
            tests(filter:{
              id: {
                equals:$testID
              }
            }) {
              items{
                commitHash
                status
                location
                log
                testType
                project {
                  repository {
                    owner
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;
