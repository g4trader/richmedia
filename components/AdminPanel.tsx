import React, { useState, useRef } from 'react';
import { generateMarketingCopy } from '../services/geminiService';
import { OfferData, BannerState } from '../types';
import { Sparkles, Plus, Loader2, Download, Upload, FileJson } from 'lucide-react';

interface AdminPanelProps {
  offers: OfferData[];
  onAddOffer: (offer: OfferData) => void;
  onUpdateOffers: (offers: OfferData[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ offers, onAddOffer, onUpdateOffers }) => {
  const [courseName, setCourseName] = useState('');
  const [state, setState] = useState<BannerState>(BannerState.IDLE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!courseName.trim()) return;

    setState(BannerState.GENERATING);
    try {
      const generatedData = await generateMarketingCopy(courseName);
      
      const newOffer: OfferData = {
        id: Date.now().toString(),
        course: courseName,
        headline: generatedData.headline || 'Curso de Excelência',
        subtitle: generatedData.subtitle || 'Inscreva-se hoje mesmo',
        discount: generatedData.discount || 'Condições Especiais',
        ctaText: generatedData.ctaText || 'Saiba Mais',
        colorFrom: generatedData.colorFrom || 'from-indigo-900',
        colorTo: generatedData.colorTo || 'to-indigo-600',
        image: `https://picsum.photos/400/250?seed=${Date.now()}`
      };

      onAddOffer(newOffer);
      setCourseName('');
      setState(BannerState.SUCCESS);
      
      setTimeout(() => setState(BannerState.IDLE), 2000);

    } catch (e) {
      setState(BannerState.ERROR);
      setTimeout(() => setState(BannerState.IDLE), 3000);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(offers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vestibular-campaigns.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedOffers = JSON.parse(text) as OfferData[];
          if (Array.isArray(importedOffers)) {
            onUpdateOffers(importedOffers);
            alert('Campanhas carregadas com sucesso!');
          }
        }
      } catch (err) {
        alert('Erro ao ler arquivo JSON.');
      }
    };
    reader.readAsText(fileObj);
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto">
      
      {/* AI Generator Section */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-2 mb-4 text-gray-800">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg">AI Campaign Generator</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter a course name (e.g. 'Arquitetura', 'Psicologia')..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            disabled={state === BannerState.GENERATING}
          />
          
          <button
            onClick={handleGenerate}
            disabled={state === BannerState.GENERATING || !courseName.trim()}
            className={`
              flex items-center justify-center px-6 py-2 rounded-lg font-semibold text-white transition-all whitespace-nowrap
              ${state === BannerState.GENERATING 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 active:scale-95'}
            `}
          >
            {state === BannerState.GENERATING ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Campaign
              </>
            )}
          </button>
        </div>

        {state === BannerState.SUCCESS && (
          <p className="text-green-600 text-sm mt-2">Campaign generated and added to carousel successfully!</p>
        )}
        {state === BannerState.ERROR && (
          <p className="text-red-600 text-sm mt-2">Failed to generate campaign. Check your API Key.</p>
        )}
      </div>

      {/* Data Management Section */}
      <div>
        <div className="flex items-center space-x-2 mb-3 text-gray-800">
          <FileJson className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Data Management</h3>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Config (JSON)
          </button>
          
          <button 
            onClick={handleImportClick}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Config
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Save your AI-generated campaigns to a JSON file to share or restore later.
        </p>
      </div>
    </div>
  );
};