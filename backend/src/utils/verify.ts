export type VerificationResult = {
  plate_number: string;
  state_code: string;
  plate_class: 'Private' | 'Commercial' | 'Government' | 'Diplomatic' | 'Police';
  registration_status: 'Active' | 'Expired' | 'Suspended';
  vehicle_model: string;
  registration_date: string; // ISO date
  source: 'simulated';
};

const plateClasses = ['Private', 'Commercial', 'Government', 'Diplomatic', 'Police'] as const;
const regStatuses = ['Active', 'Expired', 'Suspended'] as const;
const vehicleModels = [
  'Toyota Corolla',
  'Honda Civic',
  'Toyota Camry',
  'Hyundai Elantra',
  'Kia Rio',
  'Nissan Altima',
  'Ford Focus',
  'Mazda 3'
];

const knownStateCodes = new Set([
  'ABJ','LAG','RIV','KAN','ENU','KAD','OGN','ABIA','AKW','BAY','BEN','BOR','CRO','DEL','EBO','EDO','EKT','GMB','IMO','JIG','KBY','KNO','KST','KWR','NAS','NIG','OND','OSU','PLT','TAR','YOB','ZAM'
]);

function hashStringToNumber(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function simulatePlateLookup(plate: string): VerificationResult {
  const norm = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const seed = hashStringToNumber(norm);
  const stateCode = knownStateCodes.has(norm.slice(0, 3)) ? norm.slice(0, 3) : Array.from(knownStateCodes)[seed % knownStateCodes.size];
  const plateClass = plateClasses[seed % plateClasses.length];
  const regStatus = regStatuses[seed % regStatuses.length];
  const model = vehicleModels[seed % vehicleModels.length];
  const daysAgo = (seed % 3650) + 30; // 1 month to 10 years
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return {
    plate_number: norm,
    state_code: stateCode,
    plate_class: plateClass,
    registration_status: regStatus,
    vehicle_model: model,
    registration_date: date,
    source: 'simulated'
  };
}
