export const GET_CONFIGURATION_QUERY = `query(
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
            configuration{
              buildCommand
              openAPISpec
              directory
            }
          }
        }
      }
    }
  }
}`;

export const CREATE_CONFIGURATION = `mutation CREATE_CONFIGURATION(
  $userId:ID!
  $teamName: String!
  $namePlusTeamName:String!
  $buildCommand:String!
  $openAPISpec:String!
  $directory:String!
  $teamNameAsPredicate:StringPredicate!
  $projectNameAsPredicate:StringPredicate!
) {
  userUpdate(filter: {
    id: $userId
  }
  data:{
    team: {
      update: {
        filter:{
          name:$teamName
        }
        data:{
          project: {
            update: {
              filter: {
                namePlusTeamName: $namePlusTeamName
              }
              data:{
                configuration:{
                  create:{
                    buildCommand:$buildCommand
                    openAPISpec:$openAPISpec
                    directory:$directory
                  }
                }
              }
            }
          }
        }
      }
    }
  }) {
    id
    team(filter:{
      name:$teamNameAsPredicate
    }) {
      items{
        name
        id
        project(filter:{
          name:$projectNameAsPredicate
        }) {
          items {
            name
            configuration {
                buildCommand
                directory
                openAPISpec
            }
          }
        }
      }
    }
  }
}`;

export const UPDATE_CONFIGURATION = `mutation UPDATE_CONFIGURATION(
  $userId:ID!
  $teamName: String!
  $namePlusTeamName:String!
  $buildCommand:String!
  $openAPISpec:String!
  $directory:String!
  $teamNameAsPredicate:StringPredicate!
  $projectNameAsPredicate:StringPredicate!
) {
  userUpdate(filter: {
    id: $userId
  }
  data:{
    team: {
      update: {
        filter:{
          name:$teamName
        }
        data:{
          project: {
            update: {
              filter: {
                namePlusTeamName: $namePlusTeamName
              }
              data:{
                configuration:{
                  update:{
                    buildCommand:$buildCommand
                    openAPISpec:$openAPISpec
                    directory:$directory
                  }
                }
              }
            }
          }
        }
      }
    }
  }) {
    id
    team(filter:{
      name:$teamNameAsPredicate
    }) {
      items{
        name
        id
        project(filter:{
          name:$projectNameAsPredicate
        }) {
          items {
            name
            configuration {
                buildCommand
                directory
                openAPISpec
            }
          }
        }
      }
    }
  }
}`;
