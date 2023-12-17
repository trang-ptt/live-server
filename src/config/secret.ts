import { LOCALHOST_URL } from 'src/constants';

export const SRS_CONFIG = {
  docker: {
    container: 'live-srs',
    image: 'ossrs/srs:5',
    port: {
      1935: 1935,
      8080: 8080,
      1985: 1985,
      8000: 8000,
    },
    volume: process.env.VOLUME_PATH || '*************',
  },
  CANDIDATE: process.env.CANDIDATE || '*************',
};

export const SERVER_LIVE = {
  PushDomain: `rtmp://${LOCALHOST_URL}` || '**********',
  PullDomain:
    `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port['8080']}` || '**********',
  AppName: 'livestream',
};
