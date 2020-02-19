'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mirrorStatus = mirrorStatus;
function mirrorStatus(status, esStatus) {
  if (!esStatus) {
    status.red('UI Settings requires the elasticsearch plugin');
    return;
  }

  const copyEsStatus = () => {
    const state = esStatus.state;

    const statusMessage = state === 'green' ? 'Ready' : `Elasticsearch plugin is ${state}`;
    status[state](statusMessage);
  };

  copyEsStatus();
  esStatus.on('change', copyEsStatus);
}
