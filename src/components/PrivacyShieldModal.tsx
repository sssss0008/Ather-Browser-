import React from 'react';
import { PrivacyStats } from '../types/browser';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Cookie, 
  Wifi, 
  Check, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PrivacyStats;
  onUpdateStats: (newStats: Partial<PrivacyStats>) => void;
  activeDomain: string;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  activeDomain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Aether Zero-Trust Privacy Shield</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">Protecting identity on {activeDomain}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time metrics grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Trackers</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{stats.trackersBlockedTotal}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Ads Blocked</span>
            <span className="text-xl font-bold font-mono text-blue-400">{stats.adsBlockedTotal}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Fingerprints</span>
            <span className="text-xl font-bold font-mono text-purple-400">{stats.fingerprintsDefended}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">HTTPS Forced</span>
            <span className="text-xl font-bold font-mono text-amber-400">{stats.httpsUpgrades}</span>
          </div>
        </div>

        {/* Shield Protection Toggles */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-72">
          {/* Third Party Cookies */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <Cookie className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Third-Party Cookie Isolation</div>
                <div className="text-[11px] text-slate-400">Partitions site cookies into isolated ephemeral jars</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={stats.thirdPartyCookiesBlocked}
              onChange={(e) => onUpdateStats({ thirdPartyCookiesBlocked: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Fingerprint Protection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <EyeOff className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Canvas & Audio Fingerprint Defense</div>
                <div className="text-[11px] text-slate-400">Injects sub-perceptual cryptographic jitter into readbacks</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={stats.fingerprintProtection}
              onChange={(e) => onUpdateStats({ fingerprintProtection: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* WebRTC Leak Shield */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <Wifi className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">WebRTC Local IP Cloak</div>
                <div className="text-[11px] text-slate-400">Masks internal LAN subnets from remote STUN/TURN servers</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={stats.webrtcLeakShield}
              onChange={(e) => onUpdateStats({ webrtcLeakShield: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Aether Zero-Knowledge Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
