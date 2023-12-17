import { dockerRunSRS } from './init/docker/SRS';
import { dockerIsInstalled } from './utils';

export function runSRS() {
  const flag = dockerIsInstalled();

  if (flag) {
    dockerRunSRS(true);
    console.log('Docker installed!');
  } else {
    console.log('Docker not installed!');
  }
}
