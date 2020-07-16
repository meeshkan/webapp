export const UPDATE_PLAN_MUTATION = `mutation UPDATE_TEAM_PLAN(
  $userId: ID!
  $teamName: String!
  $newPlan: String!
) {
  userUpdate(
    filter: { id: $userId }
    data: {
      team: {
        update: { filter: { name: $teamName }, data: { plan: $newPlan } }
      }
    }
  ) {
    team(filter: { name: { equals: $teamName } }) {
      items {
        id
        name
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
