export const GET_TEAM_COUNT = `query {
  user {
      team {
          count
      }
  }
}`;

export const CREATE_TEAM_FROM_USER_NAME = `mutation(
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
      }
    }
  }
}`;

export const ASSOCIATE_PHOTO_WITH_TEAM = `mutation(
  $userId:ID!
  $teamId:ID!
  $fileId:String!
  $filename:String!
) {
  userUpdate(
    filter: {
      id:$userId
    }
    data:{
      team: {
        update:{
          filter:{
            id:$teamId
          }
          data:{
            image:{
              create:{
                fileId:$fileId
                filename:$filename
              }
            }
          }
        }
      }
    }
  ) {
    id
  }
}`;
