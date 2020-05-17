import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
// https://github.com/palmerhq/cypress-image-snapshot#options
addMatchImageSnapshotCommand({
  failureThreshold: 0.7, // threshold for entire image
  failureThresholdType: 'percent', // percent of image or number of pixels);
})
require('cypress-react-unit-test/support')
