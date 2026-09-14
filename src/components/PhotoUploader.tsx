import React, { useRef } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, AlertCircle, CheckCircle2, Zap, ShieldCheck, Heart, User } from 'lucide-react';

interface PhotoUploaderProps {
  selectedImage: string | null;
  isDemo: boolean;
  targetType: 'self' | 'friend';
  friendName: string;
  onTargetTypeChange: (target: 'self' | 'friend') => void;
  onFriendNameChange: (name: string) => void;
  onImageSelected: (base64: string, mimeType: string) => void;
  onSelectDemo: () => void;
  onClearImage: () => void;
  onStartScan: () => void;
  isScanning: boolean;
  creditsRemaining: number | null;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  selectedImage,
  isDemo,
  targetType,
  friendName,
  onTargetTypeChange,
  onFriendNameChange,
  onImageSelected,
  onSelectDemo,
  onClearImage,
  onStartScan,
  isScanning,
  creditsRemaining,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type || 'image/jpeg';
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onImageSelected(result, mimeType);
      }
    };

    reader.readAsDataURL(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Target Selector: Myself vs A Friend */}
      <div className="bg-[#151515] p-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onTargetTypeChange('self')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            targetType === 'self'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Hype Myself</span>
        </button>

        <button
          type="button"
          onClick={() => onTargetTypeChange('friend')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            targetType === 'friend'
              ? 'bg-gradient-to-r from-pink-500 to-yellow-400 text-black shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Compliment a Friend</span>
        </button>
      </div>

      {/* Friend Name Input if Friend Mode is selected */}
      {targetType === 'friend' && (
        <div className="bg-[#151515] border border-pink-500/30 rounded-xl p-3.5 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
              <span>Friend's Name / Nickname</span>
            </label>
            <span className="text-[9px] font-mono text-gray-500 uppercase">
              Email &amp; IG Ready
            </span>
          </div>
          <input
            type="text"
            placeholder="e.g. Jordan, Maya, or Bestie..."
            value={friendName}
            onChange={(e) => onFriendNameChange(e.target.value)}
            className="w-full bg-black/60 border border-white/10 focus:border-pink-400 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none font-sans"
          />
          <p className="text-[10px] text-gray-400 font-sans leading-tight">
            Upload your friend's photo. We'll generate a personalized tribute you can instantly send via <strong>Email</strong> or <strong>Instagram</strong>!
          </p>
        </div>
      )}

      {/* Native HTML5 Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        capture="user"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedImage ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Take Selfie Card */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 sm:p-6 bg-[#151515] border border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all">
                <Camera className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200 block">
                  {targetType === 'friend' ? 'Snap Friend' : 'Take Selfie'}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Use camera</span>
              </div>
            </button>

            {/* Upload Image Card */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 sm:p-6 bg-[#151515] border border-white/10 hover:border-pink-500/50 rounded-2xl transition-all cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-pink-500/10 transition-all">
                <Upload className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200 block">
                  {targetType === 'friend' ? 'Upload Friend Pic' : 'Upload Image'}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">JPG / PNG / WebP</span>
              </div>
            </button>
          </div>

          {/* Demo Model Option Banner / Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-pink-950/40 border border-cyan-500/30 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Instant Test Drive
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                0 Credits Used
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Test drive the thermal vibe engine with our verified demo model before uploading your own photo.
            </p>

            <button
              onClick={onSelectDemo}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Use Demo Model (Instant Test)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 bg-[#151515] p-5 border border-white/10 rounded-2xl">
          <div className="relative group max-w-xs w-full aspect-square rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-black">
            <img
              src={selectedImage}
              alt="Scan Target"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-between p-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {isDemo
                  ? 'DEMO TARGET LOADED'
                  : targetType === 'friend'
                  ? `FRIEND (${friendName || 'BESTIE'}) LOCKED`
                  : 'TARGET LOCKED'}
              </span>
              <button
                onClick={onClearImage}
                disabled={isScanning}
                className="text-[10px] font-mono text-gray-300 hover:text-white underline cursor-pointer bg-black/50 px-2 py-0.5 rounded"
              >
                Change
              </button>
            </div>

            {isDemo && (
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-yellow-400/90 text-black text-[9px] font-black uppercase font-mono tracking-wider flex items-center gap-1 shadow-md">
                <Zap className="w-2.5 h-2.5 fill-black" />
                <span>DEMO MODEL (FREE)</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <button
              onClick={onStartScan}
              disabled={isScanning || (!isDemo && creditsRemaining === 0)}
              className={`w-full py-4 px-6 rounded-xl font-black uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isScanning
                  ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                  : !isDemo && creditsRemaining === 0
                  ? 'bg-zinc-800 text-red-400 border border-red-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 hover:brightness-110 text-black shadow-lg shadow-cyan-500/20 active:scale-98'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>ANALYZING AURA SPECTRUM...</span>
                </>
              ) : !isDemo && creditsRemaining === 0 ? (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>DAILY LIMIT REACHED (25/25) — RESETS TOMORROW</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isDemo
                      ? 'SIMULATE DEMO HYPE SCAN & PRINT'
                      : targetType === 'friend'
                      ? `GENERATE COMPLIMENT FOR ${friendName ? friendName.toUpperCase() : 'FRIEND'}`
                      : 'RUN HYPE SCAN & PRINT RECEIPT'}
                  </span>
                </>
              )}
            </button>

            {isDemo && (
              <p className="text-[10px] font-mono text-cyan-400/80 text-center">
                ⚡ Demo scan uses 0 credits and validates instant thermal simulation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};



