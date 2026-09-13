// Sourced list prices checked 2026-09-13. Infrastructure illustration only.
export const RATES = Object.freeze({sol: [4, 20], astra: [10, 50], luna: [0.2, 1.2], l4: 0.8});
export function estimateCosts({volume, input, output, hours, replicas}) {
  const bounds = {volume:[1000,1000000],input:[1,10000],output:[1,10000],hours:[1,744],replicas:[1,16]};
  const values = {volume,input,output,hours,replicas};
  for (const [key,[min,max]] of Object.entries(bounds)) {
    if (!Number.isInteger(values[key]) || values[key]<min || values[key]>max) throw new RangeError(`Check ${key}`);
  }
  return Object.fromEntries([
    ...['sol','astra','luna'].map(key=>[key,volume*(input*RATES[key][0]+output*RATES[key][1])/1000000]),
    ['open',RATES.l4*hours*replicas]
  ]);
}
