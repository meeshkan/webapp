export const UPDATE_STRIPE_ID_MUTATION = `mutation UPDATE_TEAM_PLAN(
  $userId: ID!
  $teamName: String!
  $stripeCustomerId: String!
) {
  userUpdate(
    filter: { id: $userId }
    data: {
      team: {
        update: { filter: { name: $teamName }, data: { stripeCustomerId: $stripeCustomerId } }
      }
    }
  ) {
    team(filter: { name: { equals: $teamName } }) {
      items {
        id
        name
        stripeCustomerId
        image {
          downloadUrl
        }
        inviteLink
        plan
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
