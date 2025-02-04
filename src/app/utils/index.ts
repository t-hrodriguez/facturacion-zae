export const getUtcDifference = (timeZone: string): number => {
  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone }));
  const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const differenceInMinutes = (localTime.getTime() - utcTime.getTime()) / 60000;
  return differenceInMinutes / 60;
};

const timeZones = {
  Tijuana: 'America/Tijuana',
  Hermosillo: 'America/Hermosillo',
  'Ciudad Juárez': 'America/Ciudad_Juarez',
  Acapulco: 'America/Mexico_City',
}


export const TijuanaOffset = getUtcDifference(timeZones.Tijuana);
export const HermosilloOffset = getUtcDifference(timeZones.Hermosillo);
export const CiudadJuarezOffset = getUtcDifference(timeZones['Ciudad Juárez']);
export const AcapulcoOffset = getUtcDifference(timeZones.Acapulco);