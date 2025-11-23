import React from 'react';
import { CompanyData } from '../types';
import { MUNICIPALITY_NAMES } from '../constants';

interface FormProps {
  data: CompanyData;
  onChange: (data: CompanyData) => void;
  year: number;
  onYearChange: (year: number) => void;
  className?: string;
}

export const Form: React.FC<FormProps> = ({ data, onChange, year, onYearChange, className = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Año</label>
        <input
          type="number"
          name="year"
          id="year"
          min="2024"
          max="2050"
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value) || new Date().getFullYear())}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Empresa</label>
        <input
          type="text"
          name="name"
          id="name"
          value={data.name || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          placeholder="Ej. Turismo Canarias S.L."
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="cif" className="block text-sm font-medium text-gray-700">CIF / DNI</label>
        <input
          type="text"
          name="cif"
          id="cif"
          value={data.cif || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          placeholder="Ej. B12345678"
          autoComplete="off"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Domicilio Centro de Trabajo</label>
        <input
          type="text"
          name="address"
          id="address"
          value={data.address || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          placeholder="Ej. C/ Mayor, 10"
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="locality" className="block text-sm font-medium text-gray-700">Localidad (Municipio)</label>
        <select
          name="locality"
          id="locality"
          value={data.locality || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white"
        >
          <option value="">Seleccione un municipio...</option>
          {MUNICIPALITY_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="agreement" className="block text-sm font-medium text-gray-700">Convenio de aplicación</label>
        <input
          type="text"
          name="agreement"
          id="agreement"
          value={data.agreement || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          placeholder="Ej. Hostelería"
          autoComplete="off"
        />
      </div>
    </div>
  );
};