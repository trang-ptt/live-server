import { Injectable } from '@nestjs/common';
import { myaxios } from 'src/utils/request';
import { IApiV1Clients, IApiV1Streams } from './interfaces';
import { LOCALHOST_URL } from 'src/constants';
import { SRS_CONFIG } from 'src/config/secret';

@Injectable()
export class SrsService {
  common = {
    getApiV1ClientDetail: (clientId: string) =>
      myaxios.get(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/clients/${clientId}`,
      ),
    getApiV1Clients: ({ start, count }: { start: number; count: number }) =>
      myaxios.get<IApiV1Clients>(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/clients?start=${start}&count=${count}`,
      ),
    getApiV1Streams: ({ start, count }: { start: number; count: number }) =>
      myaxios.get<IApiV1Streams>(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/streams?start=${start}&count=${count}`,
      ),
    deleteApiV1Clients: (clientId: string) =>
      myaxios.delete(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/clients/${clientId}`,
      ),
  };
}
