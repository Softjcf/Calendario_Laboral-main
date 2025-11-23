import { Holiday, HolidayType, Municipality, Island } from './types';
import { addDays, format } from 'date-fns';

// Helper to calculate Easter Sunday (Meeus/Jones/Butcher's algorithm)
const getEasterDate = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n0 = (h + l - 7 * m + 114);
  const month = Math.floor(n0 / 31) - 1; // 0-indexed month
  const day = (n0 % 31) + 1;
  return new Date(year, month, day);
};

// National and Regional Holidays Logic
export const getCommonHolidays = (year: number): Holiday[] => {
  if (year === 2026) {
    return [
      { date: '2026-01-01', name: 'Año Nuevo', type: HolidayType.NATIONAL },
      { date: '2026-01-06', name: 'Epifanía del Señor', type: HolidayType.NATIONAL },
      { date: '2026-04-02', name: 'Jueves Santo', type: HolidayType.REGIONAL },
      { date: '2026-04-03', name: 'Viernes Santo', type: HolidayType.NATIONAL },
      { date: '2026-05-01', name: 'Fiesta del Trabajo', type: HolidayType.NATIONAL },
      { date: '2026-05-30', name: 'Día de Canarias', type: HolidayType.REGIONAL },
      { date: '2026-08-15', name: 'Asunción de la Virgen', type: HolidayType.NATIONAL },
      { date: '2026-10-12', name: 'Fiesta Nacional de España', type: HolidayType.NATIONAL },
      { date: '2026-11-02', name: 'Todos los Santos (Traslado)', type: HolidayType.NATIONAL }, // 1st is Sunday
      { date: '2026-12-08', name: 'Inmaculada Concepción', type: HolidayType.NATIONAL },
      { date: '2026-12-25', name: 'Natividad del Señor', type: HolidayType.NATIONAL },
    ];
  }

  // 2025 and others (Generic fallback using Easter)
  const easter = getEasterDate(year);
  const goodFriday = addDays(easter, -2);
  const maundyThursday = addDays(easter, -3);

  const holidays: Holiday[] = [
    { date: `${year}-01-01`, name: 'Año Nuevo', type: HolidayType.NATIONAL },
    { date: `${year}-01-06`, name: 'Epifanía del Señor', type: HolidayType.NATIONAL },
    { date: format(maundyThursday, 'yyyy-MM-dd'), name: 'Jueves Santo', type: HolidayType.REGIONAL },
    { date: format(goodFriday, 'yyyy-MM-dd'), name: 'Viernes Santo', type: HolidayType.NATIONAL },
    { date: `${year}-05-01`, name: 'Fiesta del Trabajo', type: HolidayType.NATIONAL },
    { date: `${year}-05-30`, name: 'Día de Canarias', type: HolidayType.REGIONAL },
    { date: `${year}-08-15`, name: 'Asunción de la Virgen', type: HolidayType.NATIONAL },
    { date: `${year}-10-12`, name: 'Fiesta Nacional de España', type: HolidayType.NATIONAL },
    { date: `${year}-11-01`, name: 'Todos los Santos', type: HolidayType.NATIONAL },
    { date: `${year}-12-06`, name: 'Día de la Constitución', type: HolidayType.NATIONAL },
    { date: `${year}-12-08`, name: 'Inmaculada Concepción', type: HolidayType.NATIONAL },
    { date: `${year}-12-25`, name: 'Natividad del Señor', type: HolidayType.NATIONAL },
  ];

  // Adjustment for specific years if needed (like 2025 substitutions if any, though 2025 list looked standard)
  return holidays;
};

export const getIslandHolidays = (year: number, island: Island): Holiday[] => {
  // Based on 2026 PDF
  const holidays2026: Record<Island, { date: string, name: string }> = {
    'El Hierro': { date: '2026-09-24', name: 'Ntra. Sra. de los Reyes' },
    'Fuerteventura': { date: '2026-09-18', name: 'Ntra. Sra. de la Peña' },
    'Gran Canaria': { date: '2026-09-08', name: 'Ntra. Sra. del Pino' },
    'La Gomera': { date: '2026-10-05', name: 'Ntra. Sra. de Guadalupe' },
    'La Palma': { date: '2026-08-05', name: 'Ntra. Sra. de Las Nieves' },
    'Lanzarote': { date: '2026-09-15', name: 'Ntra. Sra. de Los Volcanes' },
    'La Graciosa': { date: '2026-09-15', name: 'Ntra. Sra. de Los Volcanes' },
    'Tenerife': { date: '2026-02-02', name: 'Virgen de la Candelaria' },
  };

  if (year === 2026) {
    const h = holidays2026[island];
    if (h) return [{ ...h, type: HolidayType.ISLAND }];
    return [];
  }

  // Project for other years (simplified)
  // Note: These are typically fixed dates, except if they fall on Sunday they might move.
  // For now, we project the day/month.
  const baseHolidays: Record<Island, { month: number, day: number, name: string }> = {
    'El Hierro': { month: 8, day: 24, name: 'Ntra. Sra. de los Reyes' }, // Sep is month 8 (0-indexed)
    'Fuerteventura': { month: 8, day: 18, name: 'Ntra. Sra. de la Peña' },
    'Gran Canaria': { month: 8, day: 8, name: 'Ntra. Sra. del Pino' },
    'La Gomera': { month: 9, day: 5, name: 'Ntra. Sra. de Guadalupe' }, // Oct is 9
    'La Palma': { month: 7, day: 5, name: 'Ntra. Sra. de Las Nieves' }, // Aug is 7
    'Lanzarote': { month: 8, day: 15, name: 'Ntra. Sra. de Los Volcanes' },
    'La Graciosa': { month: 8, day: 15, name: 'Ntra. Sra. de Los Volcanes' },
    'Tenerife': { month: 1, day: 2, name: 'Virgen de la Candelaria' }, // Feb is 1
  };

  const h = baseHolidays[island];
  if (h) {
    // Simple projection
    const date = new Date(year, h.month, h.day);
    return [{ date: format(date, 'yyyy-MM-dd'), name: h.name, type: HolidayType.ISLAND }];
  }
  return [];
};

// Base Data from 2025 BOC with Island mapping
// Cast to Municipality[] to handle island literal type inference
const MUNICIPALITIES_BASE: Municipality[] = ([
  { name: 'Adeje', island: 'Tenerife', holidays: [{ date: '2025-01-20', name: 'San Sebastián' }, { date: '2025-03-04', name: 'Martes de Carnaval' }] },
  { name: 'Agaete', island: 'Gran Canaria', holidays: [{ date: '2025-08-04', name: 'La Rama (Ntra. Sra. de las Nieves)' }, { date: '2025-08-05', name: 'Ntra. Sra. de las Nieves' }] },
  { name: 'Agüimes', island: 'Gran Canaria', holidays: [{ date: '2025-01-20', name: 'San Sebastián' }, { date: '2025-03-06', name: 'Jueves de Carnaval' }] },
  { name: 'Agulo', island: 'La Gomera', holidays: [{ date: '2025-04-25', name: 'San Marcos Evangelista' }, { date: '2025-09-24', name: 'Ntra. Sra. de las Mercedes' }] },
  { name: 'Alajeró', island: 'La Gomera', holidays: [{ date: '2025-07-16', name: 'Ntra. Sra. del Carmen' }, { date: '2025-09-15', name: 'Ntra. Sra. del Buen Paso' }] },
  { name: 'Antigua', island: 'Fuerteventura', holidays: [{ date: '2025-02-24', name: 'Carnavales' }, { date: '2025-09-08', name: 'Ntra. Sra. de Antigua' }] },
  { name: 'Arafo', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-25', name: 'San Bernardo' }] },
  { name: 'Arico', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-08', name: 'Ntra. Sra. de Abona' }] },
  { name: 'Arona', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-10-06', name: 'Stmo. Cristo de la Salud' }] },
  { name: 'Arrecife', island: 'Lanzarote', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-25', name: 'San Ginés' }] },
  { name: 'Artenara', island: 'Gran Canaria', holidays: [{ date: '2025-06-24', name: 'San Juan' }, { date: '2025-09-01', name: 'Virgen de la Cuevita' }] },
  { name: 'Arucas', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-24', name: 'San Juan Bautista' }] },
  { name: 'Barlovento', island: 'La Palma', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-10-07', name: 'Ntra. Sra. del Rosario' }] },
  { name: 'Betancuria', island: 'Fuerteventura', holidays: [{ date: '2025-01-21', name: 'Santa Inés' }, { date: '2025-07-14', name: 'San Buenaventura' }] },
  { name: 'Breña Alta', island: 'La Palma', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-05-02', name: 'Víspera de la Santa Cruz' }] },
  { name: 'Breña Baja', island: 'La Palma', holidays: [{ date: '2025-03-19', name: 'San José' }, { date: '2025-10-07', name: 'Ntra. Sra. del Rosario' }] },
  { name: 'Buenavista del Norte', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-25', name: 'San Bartolomé' }] },
  { name: 'Candelaria', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-07-26', name: 'Santa Ana' }] },
  { name: 'El Paso', island: 'La Palma', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-05', name: 'Viernes previo a la Festividad del Pino' }] },
  { name: 'El Pinar de El Hierro', island: 'El Hierro', holidays: [{ date: '2025-07-16', name: 'Ntra. Sra. del Carmen' }, { date: '2025-09-12', name: 'Ntra. Sra. de la Paz' }] },
  { name: 'El Rosario', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-04', name: 'Ntra. Sra. de La Esperanza' }] },
  { name: 'El Sauzal', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-03-19', name: 'San José y día del Padre' }] },
  { name: 'El Tanque', island: 'Tenerife', holidays: [{ date: '2025-09-01', name: 'Ntra. Sra. de Buen Viaje' }, { date: '2025-10-20', name: 'Stmo. Cristo del Calvario' }] },
  { name: 'Fasnia', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-18', name: 'Fiestas Patronales' }] },
  { name: 'Firgas', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-16', name: 'San Roque' }] },
  { name: 'Fuencaliente de la Palma', island: 'La Palma', holidays: [{ date: '2025-01-17', name: 'San Antonio Abad' }, { date: '2025-03-04', name: 'Martes de Carnaval' }] },
  { name: 'Gáldar', island: 'Gran Canaria', holidays: [{ date: '2025-05-15', name: 'San Isidro Labrador' }, { date: '2025-07-25', name: 'Santiago Apóstol' }] },
  { name: 'Garachico', island: 'Tenerife', holidays: [{ date: '2025-07-26', name: 'Santa Ana' }, { date: '2025-08-16', name: 'San Roque' }] },
  { name: 'Garafía', island: 'La Palma', holidays: [{ date: '2025-06-13', name: 'San Antonio' }, { date: '2025-08-18', name: 'Ntra. Sra. de la Luz' }] },
  { name: 'Granadilla de Abona', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-13', name: 'San Antonio de Padua' }] },
  { name: 'Guía de Isora', island: 'Tenerife', holidays: [{ date: '2025-06-24', name: 'San Juan Bautista' }, { date: '2025-09-22', name: 'Stmo. Cristo de la Dulce Muerte' }] },
  { name: 'Güímar', island: 'Tenerife', holidays: [{ date: '2025-06-30', name: 'San Pedro Apóstol' }, { date: '2025-09-08', name: 'Ntra. Sra. del Socorro' }] },
  { name: 'Haría', island: 'Lanzarote', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-24', name: 'San Juan' }] },
  { name: 'Hermigua', island: 'La Gomera', holidays: [{ date: '2025-08-08', name: 'Santo Domingo de Guzmán' }, { date: '2025-09-08', name: 'Ntra. Sra. de la Encarnación' }] },
  { name: 'Icod de los Vinos', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-04-25', name: 'San Marcos Evangelista' }] },
  { name: 'Ingenio', island: 'Gran Canaria', holidays: [{ date: '2025-02-03', name: 'San Blas' }, { date: '2025-03-06', name: 'Jueves de Carnaval' }] },
  { name: 'La Aldea de San Nicolás', island: 'Gran Canaria', holidays: [{ date: '2025-09-10', name: 'San Nicolás de Tolentino' }, { date: '2025-09-11', name: 'Día del Charco' }] },
  { name: 'La Frontera', island: 'El Hierro', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-21', name: 'Bajada de la Virgen de Los Reyes' }] },
  { name: 'La Guancha', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-18', name: 'Fiestas Patronales' }] },
  { name: 'La Matanza de Acentejo', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-06', name: 'El Salvador' }] },
  { name: 'La Oliva', island: 'Fuerteventura', holidays: [{ date: '2025-03-18', name: 'Martes de Carnaval' }, { date: '2025-07-16', name: 'Ntra. Sra. del Carmen' }] },
  { name: 'La Orotava', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-26', name: 'Infraoctava del Corpus Christi' }] },
  { name: 'La Victoria de Acentejo', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-25', name: 'Ntra. Sra. de la Encarnación' }] },
  { name: 'Las Palmas de Gran Canaria', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-24', name: 'Fundación de la Ciudad' }] },
  { name: 'Los Llanos de Aridane', island: 'La Palma', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-07-02', name: 'Ntra. Sra. de los Remedios' }] },
  { name: 'Los Realejos', island: 'Tenerife', holidays: [{ date: '2025-01-22', name: 'San Vicente' }, { date: '2025-05-03', name: 'Exaltación de la Santa Cruz' }] },
  { name: 'Los Silos', island: 'Tenerife', holidays: [{ date: '2025-06-24', name: 'San Juan' }, { date: '2025-09-08', name: 'Ntra. Sra. de la Luz' }] },
  { name: 'Mogán', island: 'Gran Canaria', holidays: [{ date: '2025-06-13', name: 'San Antonio' }, { date: '2025-07-16', name: 'Virgen del Carmen' }] },
  { name: 'Moya', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-16', name: 'San Antonio de Padua' }] },
  { name: 'Pájara', island: 'Fuerteventura', holidays: [{ date: '2025-07-02', name: 'Ntra. Sra. de Regla' }, { date: '2025-07-16', name: 'Ntra. Sra. del Carmen' }] },
  { name: 'Puerto de la Cruz', island: 'Tenerife', holidays: [{ date: '2025-07-14', name: 'Gran Poder de Dios' }, { date: '2025-07-15', name: 'Virgen del Carmen' }] },
  { name: 'Puerto del Rosario', island: 'Fuerteventura', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-10-07', name: 'Ntra. Sra. del Rosario' }] },
  { name: 'Puntagorda', island: 'La Palma', holidays: [{ date: '2025-01-15', name: 'San Mauro Abad' }, { date: '2025-03-04', name: 'Martes de Carnaval' }] },
  { name: 'Puntallana', island: 'La Palma', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-24', name: 'San Juan Bautista' }] },
  { name: 'San Andrés y Sauces', island: 'La Palma', holidays: [{ date: '2025-06-13', name: 'San Antonio del Monte' }, { date: '2025-09-08', name: 'Ntra. Sra. de Montserrat' }] },
  { name: 'San Bartolomé de Lanzarote', island: 'Lanzarote', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-25', name: 'San Ginés' }] },
  { name: 'San Bartolomé de Tirajana', island: 'Gran Canaria', holidays: [{ date: '2025-03-28', name: 'Día del Turista' }, { date: '2025-07-25', name: 'Santiago Apóstol' }] },
  { name: 'San Cristóbal de La Laguna', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-15', name: 'Stmo. Cristo de La Laguna' }] },
  { name: 'San Juan de la Rambla', island: 'Tenerife', holidays: [{ date: '2025-06-24', name: 'San Juan Bautista' }, { date: '2025-09-08', name: 'San José' }] },
  { name: 'San Miguel de Abona', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-29', name: 'San Miguel Arcángel' }] },
  { name: 'San Sebastián de la Gomera', island: 'La Gomera', holidays: [{ date: '2025-01-20', name: 'San Sebastián' }, { date: '2025-03-11', name: 'Martes de Carnaval' }] },
  { name: 'Santa Brígida', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-13', name: 'San Antonio de Padua' }] },
  { name: 'Santa Cruz de La Palma', island: 'La Palma', holidays: [{ date: '2025-05-03', name: 'Santa Cruz' }, { date: '2025-06-30', name: 'Bajada del Trono' }] },
  { name: 'Santa Cruz de Tenerife', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-05-02', name: 'Día de la Cruz' }] },
  { name: 'Santa Lucía', island: 'Gran Canaria', holidays: [{ date: '2025-10-24', name: 'San Rafael' }, { date: '2025-12-13', name: 'Santa Lucía' }] },
  { name: 'Santa María de Guía', island: 'Gran Canaria', holidays: [{ date: '2025-03-19', name: 'San José' }, { date: '2025-09-22', name: 'Fiestividad de Las Marías' }] },
  { name: 'Santa Úrsula', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-10-21', name: 'Santa Úrsula' }] },
  { name: 'Santiago del Teide', island: 'Tenerife', holidays: [{ date: '2025-07-16', name: 'Virgen del Carmen' }, { date: '2025-07-25', name: 'Santiago Apóstol' }] },
  { name: 'Tacoronte', island: 'Tenerife', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-11-25', name: 'Santa Catalina' }] },
  { name: 'Tazacorte', island: 'La Palma', holidays: [{ date: '2025-07-16', name: 'Ntra. Sra. del Carmen' }, { date: '2025-09-29', name: 'San Miguel Arcángel' }] },
  { name: 'Tegueste', island: 'Tenerife', holidays: [{ date: '2025-04-25', name: 'San Marcos Evangelista' }, { date: '2025-09-08', name: 'Ntra. Sra. de los Remedios' }] },
  { name: 'Teguise', island: 'Lanzarote', holidays: [{ date: '2025-07-16', name: 'Ntra. Sra. del Carmen' }, { date: '2025-08-05', name: 'Ntra. Sra. de Las Nieves' }] },
  { name: 'Tejeda', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-15', name: 'Virgen del Socorro' }] },
  { name: 'Telde', island: 'Gran Canaria', holidays: [{ date: '2025-06-24', name: 'San Juan Bautista' }, { date: '2025-11-17', name: 'San Gregorio Taumaturgo' }] },
  { name: 'Teror', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-27', name: 'Sagrado Corazón de Jesús' }] },
  { name: 'Tías', island: 'Lanzarote', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-24', name: 'San Juan' }] },
  { name: 'Tijarafe', island: 'La Palma', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-08', name: 'Natividad de la Virgen' }] },
  { name: 'Tinajo', island: 'Lanzarote', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-08-16', name: 'San Roque' }] },
  { name: 'Tuineje', island: 'Fuerteventura', holidays: [{ date: '2025-10-13', name: 'San Miguel Arcángel' }, { date: '2025-11-13', name: 'San Diego' }] },
  { name: 'Valle Gran Rey', island: 'La Gomera', holidays: [{ date: '2025-01-07', name: 'Virgen de Los Reyes' }, { date: '2025-06-24', name: 'San Juan Bautista' }] },
  { name: 'Vallehermoso', island: 'La Gomera', holidays: [{ date: '2025-06-24', name: 'San Juan Bautista' }, { date: '2025-07-23', name: 'Virgen del Carmen' }] },
  { name: 'Valleseco', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-06-09', name: 'Patrón del Municipio' }] },
  { name: 'Valsequillo', island: 'Gran Canaria', holidays: [{ date: '2025-06-24', name: 'San Juan Bautista' }, { date: '2025-09-29', name: 'San Miguel' }] },
  { name: 'Valverde', island: 'El Hierro', holidays: [{ date: '2025-05-15', name: 'San Isidro Labrador' }, { date: '2025-09-24', name: 'Ntra. Sra. de los Reyes' }] },
  { name: 'Vega de San Mateo', island: 'Gran Canaria', holidays: [{ date: '2025-03-04', name: 'Martes de Carnaval' }, { date: '2025-09-22', name: 'Apóstol San Mateo' }] },
  { name: 'Vilaflor de Chasna', island: 'Tenerife', holidays: [{ date: '2025-04-25', name: 'Santo Hermano Pedro' }, { date: '2025-09-01', name: 'San Roque y San Agustín' }] },
  { name: 'Villa de Mazo', island: 'La Palma', holidays: [{ date: '2025-02-03', name: 'San Blas' }, { date: '2025-06-19', name: 'Corpus Christi' }] },
  { name: 'Yaiza', island: 'Lanzarote', holidays: [{ date: '2025-07-07', name: 'San Marcial del Rubicón' }, { date: '2025-09-08', name: 'Ntra. Sra. de los Remedios' }] },
] as Municipality[]).sort((a, b) => a.name.localeCompare(b.name));

export const getMunicipalities = (year: number): Municipality[] => {
  if (year === 2025) return MUNICIPALITIES_BASE;

  // Project dates to the selected year
  // Note: For 2026, we rely on the user inputs for specifics or just projection.
  // Since we don't have the specific 2026 municipality list (only the national/island one),
  // we project the 2025 ones.
  return MUNICIPALITIES_BASE.map(mun => ({
    name: mun.name,
    island: mun.island,
    holidays: mun.holidays.map(h => ({
      name: h.name,
      date: h.date.replace('2025', year.toString())
    }))
  }));
};

export const MUNICIPALITY_NAMES = MUNICIPALITIES_BASE.map(m => m.name);
