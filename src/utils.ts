import { parseString } from 'xml2js';

import { PORTS, SENTRI, READY, STANDARD, DELAY, NA } from './constants';
import { BWT } from './types';

export const parse = (xml: string) => {
  return new Promise((resolve, _) => {
    parseString(xml, { explicitArray: false }, (_, result) => {
      const { border_wait_time }: BWT = JSON.parse(JSON.stringify(result));

      const ports = border_wait_time.port
        .filter((port) => PORTS.includes(port.port_number))
        .sort(
          (a, b) => PORTS.indexOf(a.port_number) - PORTS.indexOf(b.port_number)
        )
        .map((port) => {
          const {
            port_number,
            port_name,
            port_status,
            passenger_vehicle_lanes: vehicle,
            pedestrian_lanes: pedestrian,
          } = port;

          return {
            port_number,
            port_name,
            port_status,
            wait_times: {
              vehicle: {
                sentri: vehicle[SENTRI][DELAY] || NA,
                ready: vehicle[READY][DELAY] || NA,
                standard: vehicle[STANDARD][DELAY] || NA,
              },
              pedestrian: {
                ready: pedestrian[READY][DELAY] || NA,
                standard: pedestrian[STANDARD][DELAY] || NA,
                pedwest: NA,
              },
            },
          };
        });

      resolve({ ports });
    });
  });
};
