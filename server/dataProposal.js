const fetch = require('node-fetch');

const dataProposal = async (previousData = []) => {
  const response = await fetch('https://hub.snapshot.org/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Proposals {
          proposals(first: 1, 
            where: {space_in: ["onaboatatsea.eth"] 
              }) {
            id
            title
            body
            start
            end
            state
          }
        }
      `,
      variables: {},
    }),
  });

  const result = await response.json();
  const newData = result.data.proposals;

  let hasDataChanged;
  if (previousData.length === 0) {
    // This is the first load
    hasDataChanged = true;
  } else if (newData.length > 0 && previousData.length > 0 && newData[0].id !== previousData[0].id) {
    // The id of the first item has changed
    hasDataChanged = true;
  } else {
    hasDataChanged = false;
  }

  return { data: newData, hasDataChanged };
};

module.exports = dataProposal;
