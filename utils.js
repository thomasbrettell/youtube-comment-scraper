import os from 'os';

export const isM2 = () => {
  const cpus = os.cpus();
  for (let i = 0; i < cpus.length; i++) {
    if (cpus[i].model.includes('M2')) return true;
  }
};
