import React, { useState, useRef } from 'react';
import { generateMarketingCopy } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import { OfferData, BannerState } from '../types';
import { Sparkles, Plus, Loader2, Download, Upload, FileJson, Image as ImageIcon, Copy } from 'lucide-react';

interface AdminPanelProps {
  offers: OfferData[];
  onAddOffer: (offer: OfferData) => void;
  onUpdateOffers: (offers: OfferData[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ offers, onAddOffer, onUpdateOffers }) => {
  const [courseName, setCourseName] = useState('');
  const [state, setState] = useState<BannerState>(BannerState.IDLE);
  const [imgGenState, setImgGenState] = useState<Record<string, boolean>>({});
  const [promptGenLoading, setPromptGenLoading] = useState<Record<string, boolean>>({});
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
        // Default placeholder, user can generate better one later
        image: `https://placehold.co/400x600/transparent/FFFFFF/png?text=${courseName}`
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

  const handleCopyPrompt = async (course: string, id: string) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return alert("API Key missing");

    setPromptGenLoading(prev => ({...prev, [id]: true}));

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a highly detailed image generation prompt (optimized for Midjourney v6 or DALL-E 3) for a commercial studio photo of a Brazilian university student studying "${course}".
        
        Requirements:
        - Subject: Young adult, happy, confident, holding an object related to ${course}.
        - Style: High-end commercial advertising photography, sharp focus.
        - Background: Plain solid white background (important for easy cutout).
        - Lighting: Professional studio lighting, softbox.
        - Shot: Full body or 3/4 body shot, standing.
        
        Output ONLY the prompt text in English, no other words.`
      });

      const prompt = response.text;
      if (prompt) {
        await navigator.clipboard.writeText(prompt);
        alert("Prompt copiado! Cole no ChatGPT, Midjourney ou DALL-E.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar prompt.");
    } finally {
      setPromptGenLoading(prev => ({...prev, [id]: false}));
    }
  };

  const handleGenerateImage = async (offerId: string, course: string) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        alert("API Key missing");
        return;
    }
    
    setImgGenState(prev => ({...prev, [offerId]: true}));
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        // Updated to supported model version
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Professional studio photo of a happy brazilian university student studying ${course}, holding a related item, isolated on white background, full body shot, commercial photography, 8k resolution`,
            config: {
                numberOfImages: 1,
                aspectRatio: '9:16',
                outputMimeType: 'image/png'
            }
        });

        const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
        
        if (base64Image) {
            const imageUrl = `data:image/png;base64,${base64Image}`;
            const updatedOffers = offers.map(o => 
                o.id === offerId ? { ...o, image: imageUrl } : o
            );
            onUpdateOffers(updatedOffers);
        } else {
            alert("Could not generate image.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao gerar imagem. Tente usar o botão 'Prompt' e gerar externamente.");
    } finally {
        setImgGenState(prev => ({...prev, [offerId]: false}));
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
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto w-full">
      
      {/* AI Generator Section */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-2 mb-4 text-gray-800">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-lg">Nova Campanha (Copywriting)</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Nome do curso (ex: Arquitetura, Psicologia)..."
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
                Gerando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Criar Oferta
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Campaigns List with Image Gen */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <h3 className="font-bold text-lg text-gray-800 mb-3">Campanhas Ativas</h3>
        <div className="space-y-3">
            {offers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                        <span className="font-bold text-gray-700">{offer.course}</span>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{offer.headline}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                          onClick={() => handleCopyPrompt(offer.course, offer.id)}
                          disabled={promptGenLoading[offer.id]}
                          className="text-xs flex items-center px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors border border-gray-300"
                          title="Copiar prompt para usar no ChatGPT/Midjourney"
                      >
                          {promptGenLoading[offer.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3 mr-1" />}
                          Prompt
                      </button>
                      <button 
                          onClick={() => handleGenerateImage(offer.id, offer.course)}
                          disabled={imgGenState[offer.id]}
                          className="text-xs flex items-center px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                      >
                          {imgGenState[offer.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                          Gerar Foto
                      </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Data Management Section */}
      <div>
        <div className="flex items-center space-x-2 mb-3 text-gray-800">
          <FileJson className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Gestão de Dados</h3>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Salvar JSON
          </button>
          
          <button 
            onClick={handleImportClick}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Carregar JSON
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};