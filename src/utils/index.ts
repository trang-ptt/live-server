import { spawnSync } from "child_process";
import { networkInterfaces } from "os";

export function getIpAddress() {
  const interfaces =    networkInterfaces();
  const res: string[] = [];
  Object.keys(interfaces).forEach((dev) => {
    const iface = interfaces[dev];
    if (iface) {
      for (let i = 0; i < iface.length; i += 1) {
        const { family, address } = iface[i];
        if (family === 'IPv4') {
          res.push(address);
        }
      }
    }
  });
  return res;
}

export function dockerIsInstalled() {
  const res = spawnSync('docker', ['-v']);
  if (res.status !== 0) {
    return false;
  }
  return true;
}