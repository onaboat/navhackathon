import { OnCronjobHandler } from '@metamask/snaps-types';
import { panel, text, heading, copyable, divider } from '@metamask/snaps-ui';
import { dataProposal } from '../../site/src/utils/displayData';

let previousData: any[] = [];

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  console.log(request);
  switch (request.method) {
    case 'checkForNewData': {
      const result = await dataProposal(previousData);
      const { data } = result;
      console.log(JSON.stringify(data));
      console.log(JSON.stringify(previousData));
      
      // Fetch the hasDataChanged flag from the server
      const response = await fetch('http://localhost:3000/data-changed');
      const hasDataChanged = await response.json();

      if (hasDataChanged) {
        // The data has changed
        console.log('returnResults', data);
        // Update the previous data
        previousData = data;
        console.log('previousData', previousData);
        const firstResult = data[0];
        const { id, title, body, state } = firstResult;
        // const start = new Date(firstResult.start * 1000).toLocaleString();
        const end = new Date(firstResult.end * 1000).toLocaleString();

        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`New proposal: `),
              heading(`${title}`),
              text(`Body: ${body}`),
              divider(),
              text(`State: ${state}`),
              // text(`Start: ${start}`),
              text(`End: ${end}`),
              divider(),
              copyable(
                `https://snapshot.org/#/onaboatatsea.eth/proposal/${id}`,
              ),
            ]),
          },
        });
      }
      console.log('No new data.');
      break;
    }
    default:
      throw new Error('Method not found.');
  }
};

// export const onCronjob: OnCronjobHandler = async ({ request }) => {
//   console.log(request);
//   switch (request.method) {
//     case 'checkForNewData':
//       // eslint-disable-next-line consistent-return
//       return fetchData().then((returnResults) => {
//         // If fetch failed, returnResults would be null
//         if (returnResults) {
//           // Convert the data objects to strings for comparison
//           console.log(JSON.stringify(returnResults));
//           console.log(JSON.stringify(previousData));
//           if (JSON.stringify(returnResults) !== JSON.stringify(previousData)) {
//             // The data has changed
//             console.log('returnResults', returnResults);
//             // Update the previous data
//             previousData = returnResults;
//             console.log('previousData', previousData);
//             const firstResult = returnResults[0];
//             const { id, title, body, state } = firstResult;
//             // const start = new Date(firstResult.start * 1000).toLocaleString();
//             const end = new Date(firstResult.end * 1000).toLocaleString();

//             return snap.request({
//               method: 'snap_dialog',
//               params: {
//                 type: 'alert',
//                 content: panel([
//                   text(`New proposal: `),
//                   heading(`${title}`),
//                   text(`Body: ${body}`),
//                   divider(),
//                   text(`State: ${state}`),
//                   // text(`Start: ${start}`),
//                   text(`End: ${end}`),
//                   divider(),
//                   copyable(
//                     `https://snapshot.org/#/onaboatatsea.eth/proposal/${id}`,
//                   ),
//                 ]),
//               },
//             });
//           }
//           console.log('No new data.');
//         } else {
//           console.log('Fetch failed.');
//         }
//       });
//     default:
//       throw new Error('Method not found.');
//   }
// };

// export const onRpcRequest: OnRpcRequestHandler = ({ request }) => {
//   switch (request.method) {
//     case 'hello':
//       return fetchData().then((returnResults) => {
//         const firstResult = returnResults[0];
//         const { id, title, body, state } = firstResult;
//         // const start = new Date(firstResult.start * 1000).toLocaleString();
//         const end = new Date(firstResult.end * 1000).toLocaleString();

//         return snap.request({
//           method: 'snap_dialog',
//           params: {
//             type: 'alert',
//             content: panel([
//               text(`New proposal: `),
//               heading(`${title}`),
//               text(`Body: ${body}`),
//               divider(),
//               text(`State: ${state}`),
//               // text(`Start: ${start}`),
//               text(`End: ${end}`),
//               divider(),
//               copyable(
//                 `https://snapshot.org/#/onaboatatsea.eth/proposal/${id}`,
//               ),
//             ]),
//           },
//         });
//       });
//     default:
//       throw new Error('Method not found.');
//   }
// };
