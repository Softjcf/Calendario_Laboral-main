export interface Holiday {
  date: string; // ISO format YYYY-MM-DD
  name: string;
  type: HolidayType;
}

export enum HolidayType {
  NATIONAL = 'national',
  REGIONAL = 'regional', // Common to all Canary Islands
  ISLAND = 'island',     // Specific to the island
  LOCAL = 'local'        // Specific to the municipality
}

export type Island = 'Tenerife' | 'Gran Canaria' | 'Lanzarote' | 'Fuerteventura' | 'La Palma' | 'La Gomera' | 'El Hierro' | 'La Graciosa';

export interface Municipality {
  name: string;
  island: Island;
  holidays: { date: string; name: string }[];
}

export interface CompanyData {
  name: string;
  cif: string;
  address: string;
  locality: string;
  agreement: string;
}