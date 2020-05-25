export const GITHUB_INFO_QUERY_OR_MUTATION = `id
  githubInfo {
      githubSyncChecksum
      githubSyncNonce
  }`;

export const GITHUB_VIEWER_QUERY = `query {
  viewer {
    id
  }
}`;
export const CREATE_GITHUB_INFO_MUTATION = `mutation(
  $userId:ID!
  $githubSyncChecksum:String!
  $githubSyncNonce:String!
) {
  userUpdate(
    filter: {
      id:$userId
    }
    data:{
      githubInfo: {
        create: {
          githubSyncChecksum:$githubSyncChecksum
          githubSyncNonce:$githubSyncNonce
        }
      }
    }
  ) {
    id
  }
}`;
export const UPDATE_GITHUB_INFO_MUTATION = `mutation(
  $userId:ID!
  $githubSyncChecksum:String!
  $githubSyncNonce:String!
) {
  userUpdate(
    filter: {
      id:$userId
    }
    data:{
      githubInfo: {
        update: {
          githubSyncChecksum:$githubSyncChecksum
          githubSyncNonce:$githubSyncNonce
        }
      }
    }
  ) {
    id
  }
}`;
