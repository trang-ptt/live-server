import { execSync } from 'child_process';
import { SRS_CONFIG } from 'src/config/secret';

export const dockerRunSRS = (init = true) => {
  if (!init) return;
  try {
    execSync(`docker stop ${SRS_CONFIG.docker.container}`);
  } catch (error) {
    console.log(error);
  }

  try {
    const srsCmd = `docker run -d --rm \
    --name ${SRS_CONFIG.docker.container} \
    --env CANDIDATE=${SRS_CONFIG.CANDIDATE} \
    -p ${SRS_CONFIG.docker.port[1935]}:1935 \
    -p ${SRS_CONFIG.docker.port[8080]}:8080 \
    -p ${SRS_CONFIG.docker.port[1985]}:1985 \
    -p ${SRS_CONFIG.docker.port[8000]}:8000/udp \
    -v ${SRS_CONFIG.docker.volume}/conf:/usr/local/srs/conf/ \
    -v ${SRS_CONFIG.docker.volume}/objs:/usr/local/srs/objs/ \
    ${SRS_CONFIG.docker.image} objs/srs \
    -c conf/rtc2rtmp.conf`;

    execSync(srsCmd);
  } catch (error) {
    console.log(error);
  }
};
