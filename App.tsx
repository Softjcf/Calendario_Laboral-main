import React, { useState, useMemo } from 'react';
import { Form } from './components/Form';
import { Calendar } from './components/Calendar';
import { Legend } from './components/Legend';
import { Button } from './components/Button';
import { CompanyData, Holiday, HolidayType } from './types';
import { getCommonHolidays, getIslandHolidays, getMunicipalities } from './constants';
import { generatePDF } from './services/pdfService';
import { Printer, Download, RotateCcw } from 'lucide-react';
import watermark from './src/assets/Logotiposbc.PNG';

const App: React.FC = () => {
  const [year, setYear] = useState<number>(2026);
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    cif: '',
    address: '',
    locality: '',
    agreement: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Combine holidays based on selection
  const activeHolidays = useMemo(() => {
    const municipalities = getMunicipalities(year);
    const localMun = municipalities.find(m => m.name === formData.locality);
    
    let localHolidays: Holiday[] = [];
    let islandHolidays: Holiday[] = [];

    if (localMun) {
        localHolidays = localMun.holidays.map(h => ({
            ...h,
            type: HolidayType.LOCAL
        }));
        
        // Fetch island holidays for the municipality's island
        islandHolidays = getIslandHolidays(year, localMun.island);
    }

    return [
      ...getCommonHolidays(year),
      ...islandHolidays,
      ...localHolidays
    ];
  }, [formData.locality, year]);

  const handlePrint = async () => {
    setIsGenerating(true);
    // Brief timeout to allow UI to update
    setTimeout(async () => {
      await generatePDF('calendar-container', `Calendario_Laboral_${formData.name || 'Empresa'}_${year}`);
      setIsGenerating(false);
    }, 100);
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todos los datos del formulario?')) {
      setFormData({
        name: '',
        cif: '',
        address: '',
        locality: '',
        agreement: ''
      });
      setYear(2026);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="max-w-[230mm] w-full space-y-6">
        
        {/* Header / Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm no-print w-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Generador de Calendario Laboral</h1>
            <p className="text-gray-500 text-sm">Comunidad Autónoma de Canarias</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
             <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" /> Imprimir
             </Button>
             <Button onClick={handlePrint} disabled={isGenerating}>
                <Download className="w-4 h-4 mr-2" /> 
                {isGenerating ? 'Generando PDF...' : 'Descargar PDF'}
             </Button>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm no-print border border-gray-200 w-full">
           <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-semibold text-gray-700">Configuración del Calendario</h2>
               <Button 
                 variant="outline" 
                 onClick={handleClear} 
                 className="py-1 px-3 text-xs h-8 text-red-600 border-red-200 hover:bg-red-50" 
                 title="Borrar datos del formulario"
               >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Limpiar
               </Button>
           </div>
           <Form 
             data={formData} 
             onChange={setFormData} 
             year={year}
             onYearChange={setYear}
           />
        </div>

        {/* Calendar Preview Area (This is what gets printed) */}
        <div 
          id="calendar-container" 
          className="bg-white shadow-lg mx-auto flex flex-col relative box-border overflow-hidden"
          style={{ width: '210mm', height: '297mm', padding: '8mm 12mm' }}
        >
          
          {/* Calendar Header with Company Info */}
          <div className="border-b-2 border-blue-800 pb-2 mb-2 shrink-0">
             <div className="flex justify-between items-end mb-1">
                <h1 className="text-3xl font-extrabold text-blue-900 uppercase tracking-tight leading-none">Calendario {year}</h1>
                <div className="text-right leading-none">
                    <h2 className="text-xl font-bold text-blue-800">Canarias</h2>
                </div>
             </div>
             
             {/* Compact Grid: 2 Columns. Improved legibility: Black text for values, larger font */}
             <div className="grid grid-cols-2 gap-x-8 gap-y-0 text-sm text-blue-900">
                {/* Row 1 */}
                <div className="flex border-b border-blue-300 py-2 items-end">
                    <span className="font-bold w-24 text-blue-800 text-sm">Empresa:</span>
                    <span className="flex-1 font-bold text-black text-base">{formData.name}</span>
                </div>
                <div className="flex border-b border-blue-300 py-2 items-end">
                    <span className="font-bold w-24 text-blue-800 text-sm">CIF / DNI:</span>
                    <span className="flex-1 font-bold text-black text-base">{formData.cif}</span>
                </div>

                {/* Row 2 */}
                <div className="flex border-b border-blue-300 py-2 items-end">
                    <span className="font-bold w-24 text-blue-800 text-sm">C. Trabajo:</span>
                    <span className="flex-1 font-bold text-black text-base">{formData.address}</span>
                </div>
                <div className="flex border-b border-blue-300 py-2 items-end">
                    <span className="font-bold w-24 text-blue-800 text-sm">Localidad:</span>
                    <span className="flex-1 font-bold text-black text-base">{formData.locality}</span>
                </div>

                {/* Row 3 (Full Width) */}
                <div className="flex border-b border-blue-300 py-2 col-span-2 items-end">
                    <span className="font-bold w-24 text-blue-800 text-sm">Convenio:</span>
                    <span className="flex-1 font-bold text-black text-base">{formData.agreement}</span>
                </div>
             </div>
          </div>

          {/* Grid of Months - Compact */}
          <div className="flex-none">
            <Calendar year={year} holidays={activeHolidays} />
          </div>

          {/* Legend - Expanded Space */}
          <div className="flex-grow flex flex-col justify-start pt-2">
            <Legend holidays={activeHolidays} />
          </div>
          
          {/* Signatures */}
          <div className="mt-auto grid grid-cols-2 gap-16 pb-2 break-inside-avoid text-blue-900 shrink-0">
            <div className="border-t border-blue-900 pt-2 text-center">
              <p className="font-bold text-[10px] uppercase mb-1">Por la Empresa</p>
              <div className="h-16 flex items-center justify-center bg-gray-50/30 rounded"> 
                  <span className="text-[8px] text-blue-200 no-print">Espacio para sello</span>
              </div> 
              <p className="text-[9px] text-blue-700 opacity-70 mt-1">(Firma y Sello)</p>
            </div>
            <div className="border-t border-blue-900 pt-2 text-center">
              <p className="font-bold text-[10px] uppercase mb-1">Representantes de los Trabajadores</p>
              <div className="h-16 flex items-center justify-center bg-gray-50/30 rounded">
                   <span className="text-[8px] text-blue-200 no-print">Espacio para sello</span>
              </div>
              <p className="text-[9px] text-blue-700 opacity-70 mt-1">(Firma y Sello)</p>
            </div>
          </div>

          <div className="absolute bottom-1 left-0 w-full text-center text-[7px] text-blue-300 no-print">
            Festivos calculados para {year} según normativa de la CA de Canarias.
          </div>

          {/* Marca de agua */}
          <img
            src={watermark}
            alt="Marca de agua"
            className="pointer-events-none select-none"
            style={{
              position: 'absolute',
              top: '2mm',
              left: '60%',
              transform: 'translateX(-50%)',
              width: '80mm',
              opacity: 0.15,
              zIndex: 0
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default App;
