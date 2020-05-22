export const UPDATE_SLACK_INFO_MUTATION = `mutation(
  $userId:ID!
  $slackSyncCheckSum:String!
  $slackSyncNonce:String!
  $teamName:String!
  $namePlusTeamName:String!
) {
  userUpdate(
    filter: 
    	{id: $userId},
    force:true
    data:
    	{team: 
        {update: 
          {filter: {name: $teamName}
            data: 
            	{project: 
              	{update: 
                  {filter: 
                    {namePlusTeamName: $namePlusTeamName},
                  data: 
                    {slackWebhook: 
                      {create: 
                        {slackSyncCheckSum: $slackSyncCheckSum, slackSyncNonce: $slackSyncNonce}}}
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
