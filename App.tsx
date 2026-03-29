import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_CHARACTER, BLANK_CHARACTER, DAGGERHEART_RULES, STATIC_INFO, COMMON_ITEMS, EXAMPLE_EXPERIENCES, CLASS_DOMAINS, WEAPON_RANGES, DOMAIN_RESOURCES, ALL_DOMAIN_CARDS, DomainCardData, DOMAIN_DESCRIPTIONS } from './constants';
import { CharacterProfile, TraitType, RollResult, Weapon, AbilityCard, Experience } from './types';
import { getRulesInsight, subscribeToUsage, sendChatRuleQuery } from './services/geminiService';
import { saveCharacterToDB, getAllCharacters, deleteCharacterFromDB } from './services/db';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icons (Font Awesome Wrappers) ---
const InfoIcon = () => <i className="fa-solid fa-circle-info inline-block opacity-50 hover:opacity-100 transition-opacity cursor-help text-base" />;
const EditIcon = () => <i className="fa-solid fa-pen-to-square text-lg" />;
const FolderIcon = () => <i className="fa-solid fa-folder-open text-lg" />;
const CheckIcon = () => <i className="fa-solid fa-check text-lg" />;
const TrashIcon = () => <i className="fa-solid fa-trash-can text-sm" />;
const PlusIcon = () => <i className="fa-solid fa-plus text-sm" />;
const FilePlusIcon = () => <i className="fa-solid fa-file-circle-plus text-lg" />;
const CloseIcon = () => <i className="fa-solid fa-xmark text-xl" />;
const BackIcon = () => <i className="fa-solid fa-arrow-left text-lg" />;
const SwordIcon = () => <i className="fa-solid fa-khanda text-base" />; 
const SearchIcon = () => <i className="fa-solid fa-magnifying-glass text-sm" />;
const CommentIcon = () => <i className="fa-solid fa-comment-dots text-2xl" />;
const PaperPlaneIcon = () => <i className="fa-solid fa-paper-plane text-sm" />;
const EyeIcon = () => <i className="fa-solid fa-eye text-sm" />;

// Currency Icons
const ChestIcon = () => (
    <svg viewBox="0 0 512 512" fill="currentColor" height="1em" width="1em" className="block text-base mx-auto">
        <path d="M32 160c-17.7 0-32 14.3-32 32V384c0 53 43 96 96 96H416c53 0 96-43 96-96V192c0-17.7-14.3-32-32-32H32zm160 80h32 32 32c8.8 0 16 7.2 16 16v16c0 17.7-14.3 32-32 32H240c-17.7 0-32-14.3-32-32V256c0-8.8 7.2-16 16-16zM64 80C64 53.5 85.5 32 112 32H400c26.5 0 48 21.5 48 48v48H64V80z" />
    </svg>
);
const BagIcon = () => <i className="fa-solid fa-sack-dollar text-base" />;
const HandIcon = () => <i className="fa-solid fa-hand-holding-dollar text-base" />;
const CoinIcon = () => <i className="fa-solid fa-coins text-base" />;


// --- Helpers for Avatars ---
const getAncestryPrompt = (ancestry: string) => {
    const map: Record<string, string> = {
      "Clank": "steampunk robot construct character portrait",
      "Fungril": "mushroom person humanoid fantasy character portrait",
      "Galapa": "turtle humanoid warrior fantasy character portrait",
      "Ribbet": "frog humanoid fantasy character portrait",
      "Simiah": "monkey humanoid fantasy character portrait",
      "Katari": "cat humanoid fantasy character portrait",
      "Dwarf": "dwarf fantasy character portrait",
      "Elf": "elf fantasy character portrait",
      "Faerie": "fairy fantasy character portrait",
      "Giant": "giant fantasy character portrait",
      "Goblin": "goblin fantasy character portrait",
      "Halfling": "halfling fantasy character portrait",
      "Human": "human warrior fantasy character portrait",
      "Orc": "orc fantasy character portrait",
      "Drakona": "dragonborn humanoid fantasy character portrait"
    };
    return map[ancestry] || `${ancestry} fantasy character portrait`;
};
  
const getAvatarUrl = (ancestry: string) => {
    const prompt = encodeURIComponent(getAncestryPrompt(ancestry) + " high quality art station style");
    return `https://image.pollinations.ai/prompt/${prompt}?width=250&height=250&nologo=true`;
};

// --- Helper: Roman Numerals ---
const toRoman = (num: number): string => {
    const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    return roman[num] || num.toString();
};

// --- Helper: Robust ID Generator ---
const generateSimpleId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// --- Smart Avatar Component ---
function SmartAvatar({ ancestry, className, level }: { ancestry: string, className?: string, level?: number }) {
    const url = getAvatarUrl(ancestry);
    const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
    const isLoading = url !== loadedUrl;

    return (
         <div className={`relative shrink-0 ${className} overflow-hidden bg-slate-800`}>
            <motion.img 
                key={url}
                src={url} 
                alt={ancestry}
                className="w-full h-full object-cover"
                onLoad={() => setLoadedUrl(url)}
                onError={() => setLoadedUrl(url)}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            />
            {isLoading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-[2px] z-10">
                    <div className="animate-spin rounded-full h-1/3 w-1/3 border-2 border-t-transparent border-dagger-gold opacity-90"></div>
                </div>
            )}
            
            {level !== undefined && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-dagger-gold/60 px-2 py-0.5 rounded shadow-lg shadow-black z-30 min-w-[1.5rem] text-center">
                    <span className="text-dagger-gold font-serif font-bold text-[10px] leading-none tracking-wider block">
                        {toRoman(level)}
                    </span>
                </div>
            )}
         </div>
    )
}

// --- Markdown Text Renderer ---
const MarkdownText = ({ content }: { content: string }) => {
  if (!content) return null;
  const lines = content.split('\n');
  
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-dagger-gold font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="text-slate-200 italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="text-slate-300 text-sm leading-relaxed space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;
        
        if (trimmed.startsWith('### ')) {
            return <h4 key={i} className="text-dagger-gold font-bold text-base mt-3 mb-1">{parseInline(trimmed.slice(4))}</h4>;
        }
        if (trimmed.startsWith('## ')) {
            return <h3 key={i} className="text-white font-serif font-bold text-lg mt-4 mb-2 border-b border-slate-700 pb-1">{parseInline(trimmed.slice(3))}</h3>;
        }
        if (trimmed.startsWith('# ')) {
             return <h2 key={i} className="text-white font-serif font-bold text-xl mt-5 mb-3">{parseInline(trimmed.slice(2))}</h2>;
        }

        if (trimmed.match(/^[*•-]\s/)) {
             return (
                <div key={i} className="flex items-start gap-2 pl-2">
                  <span className="text-dagger-gold/70 mt-1.5 text-[6px] flex-shrink-0"><i className="fa-solid fa-circle" /></span>
                  <span className="flex-1">{parseInline(trimmed.replace(/^[*•-]\s/, ''))}</span>
                </div>
              );
        }

        if (trimmed.match(/^\d+\.\s/)) {
            const match = trimmed.match(/^(\d+)\.\s/);
            const num = match ? match[1] : '';
            return (
                <div key={i} className="flex items-start gap-2 pl-2">
                    <span className="text-dagger-gold font-bold min-w-[1.2rem] text-right flex-shrink-0">{num}.</span>
                    <span className="flex-1">{parseInline(trimmed.replace(/^\d+\.\s/, ''))}</span>
                </div>
            );
        }

        return <div key={i}>{parseInline(line)}</div>;
      })}
    </div>
  );
};

// --- Draggable Value Component ---
function DraggableValue({ 
    value, 
    onChange, 
    label,
    min = 0,
    max = 9999,
    loop
}: { 
    value: number, 
    onChange: (val: number) => void, 
    label: string,
    min?: number,
    max?: number,
    loop?: number
}) {
    const startY = useRef(0);
    const startVal = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        startY.current = e.clientY;
        startVal.current = value;
        document.body.style.cursor = 'grab';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const delta = e.clientY - startY.current;
        const steps = Math.floor(delta / 30);
        
        const newVal = Math.min(max, Math.max(min, startVal.current + steps));
        if (newVal !== value) onChange(newVal);
    };

    const handleMouseUp = () => {
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        startVal.current = value;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const delta = e.touches[0].clientY - startY.current;
        const steps = Math.floor(delta / 30);
        const newVal = Math.min(max, Math.max(min, startVal.current + steps));
        if (newVal !== value) onChange(newVal);
    };

    const nextVal = loop ? (value + 1) % loop : value + 1;
    const prevVal = loop ? (value - 1 + loop) % loop : value - 1;

    const showNext = loop ? true : nextVal <= max;
    const showPrev = loop ? true : prevVal >= min;

    return (
        <div className="flex flex-col items-center select-none" style={{ touchAction: 'none' }}>
            <label className="text-[13px] text-slate-300 uppercase font-bold mb-1 tracking-wider">{label}</label>
            <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-700 w-full justify-between h-24 relative overflow-hidden group hover:border-slate-500 transition-colors">
                 
                 <button 
                    onClick={() => onChange(Math.max(min, value - 1))} 
                    disabled={!loop && value <= min}
                    className="z-20 w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-minus text-xs" />
                </button>

                <div 
                    className="flex-1 h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing relative"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                >
                    <div className="absolute top-0 w-full h-6 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 w-full h-6 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>

                    <div className="flex flex-col items-center justify-center gap-0 w-full">
                         <div className={`text-lg font-bold text-slate-600 opacity-40 translate-y-1 ${!showNext ? 'invisible' : ''}`}>{nextVal}</div> 
                         <div className="text-4xl font-bold text-slate-100 py-0 z-0 scale-110">{value}</div>
                         <div className={`text-lg font-bold text-slate-600 opacity-40 -translate-y-1 ${!showPrev ? 'invisible' : ''}`}>{prevVal}</div>
                    </div>
                </div>

                <button 
                    onClick={() => onChange(Math.min(max, value + 1))} 
                    disabled={!loop && value >= max}
                    className="z-20 w-12 h-12 flex items-center justify-center text-slate-500 hover:text-white bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-plus text-xs" />
                </button>
            </div>
        </div>
    );
}

// --- Chat Widget Component ---
function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
        {role: 'assistant', text: "Greetings! I am your Daggerheart rules guide. Ask me a question."}
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!query.trim() || loading) return;
        
        const userMsg = query.trim();
        setQuery("");
        setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
        setLoading(true);

        const response = await sendChatRuleQuery(userMsg);
        
        setMessages(prev => [...prev, {role: 'assistant', text: response}]);
        setLoading(false);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="fixed bottom-24 right-6 w-80 h-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-dagger-gold text-sm flex items-center gap-2">
                                <CommentIcon /> Rules Assistant
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><CloseIcon /></button>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 dagger-scroll bg-slate-900/90">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] rounded-lg p-2 text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-dagger-gold text-slate-900 font-medium rounded-tr-none' 
                                            : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none'
                                    }`}>
                                            {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 text-slate-400 text-xs px-3 py-2 rounded-lg rounded-tl-none border border-slate-700 italic animate-pulse">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-2 bg-slate-800 border-t border-slate-700 flex gap-2">
                            <input 
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a rule question..."
                                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-dagger-gold"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading}
                                className="w-12 h-12 flex items-center justify-center bg-dagger-gold hover:bg-yellow-400 text-slate-900 rounded disabled:opacity-50 transition-colors"
                            >
                                <PaperPlaneIcon />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isOpen && (
                <motion.button 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-24 w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-dagger-gold rounded-full shadow-xl flex items-center justify-center z-40"
                    title="Ask Rules Bot"
                >
                    <CommentIcon />
                </motion.button>
            )}
        </>
    );
}

// --- NEW CARD PREVIEW MODAL ---
const CardRevealModal = ({ card, onClose, onAction, actionLabel }: { card: DomainCardData, onClose: () => void, onAction?: () => void, actionLabel?: string }) => {
    const resource = DOMAIN_RESOURCES[card.domain] || { colorBg: 'bg-slate-700', icon: '' };
    
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                // CHANGED: max-w-sm -> max-w-lg (makes it wider)
                className="bg-[#151515] w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/20 relative flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Strip */}
                <div className={`h-3 w-full shrink-0 ${resource.colorBg}`}></div>
                
                {/* Image Section */}
                {/* CHANGED: h-64 -> h-full (fills available space) & object-cover -> object-contain (shows whole image) */}
                <div className="relative w-full flex-1 bg-black min-h-[400px] flex items-center justify-center overflow-hidden">
                    {card.imageUrl ? (
                        <img 
                            src={card.imageUrl} 
                            alt={card.name} 
                            className="w-full h-full object-contain p-1" 
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-700 font-serif text-xl">No Image Summoned</div>
                    )}
                    

                </div>

                {/* Content Footer - Scrollable if text is long, but kept compact */}
                <div className="p-6 bg-[#1a1a1a] relative z-20 border-t border-white/10 shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white leading-none mb-1">{card.name}</h2>
                            <span className="text-xs font-bold uppercase tracking-widest text-dagger-gold">{card.domain} • Lvl {card.level}</span>
                        </div>
                        <div className="text-right">
                             <span className="block text-sm font-bold text-dagger-hope">{card.cost}</span>
                             <span className="block text-[10px] text-slate-500 uppercase">{card.type}</span>
                        </div>
                    </div>

                    <div className="text-sm text-slate-300 leading-relaxed max-h-32 overflow-y-auto dagger-scroll pr-2">
                        {card.description}
                    </div>

                    {onAction && (
                        <button 
                            onClick={onAction}
                            className="mt-5 w-full py-3 bg-dagger-gold hover:bg-yellow-400 text-slate-900 font-bold rounded-lg shadow-lg transition-transform active:scale-95"
                        >
                            {actionLabel || "Select Card"}
                        </button>
                    )}
                </div>
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-50 border border-white/10"
                >
                    <CloseIcon />
                </button>
            </motion.div>
        </div>
    );
}

// --- MODAL COMPONENTS (Refactored for Page Transition Feel) ---

// Fix: Use React.PropsWithChildren to ensure 'children' is correctly typed as optional/included, resolving TS errors where it thinks children are missing.
const ModalWrapper = ({ title, children, onClose }: React.PropsWithChildren<{ title: string, onClose: () => void }>) => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end isolate">
             {/* Backdrop */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
             />
             
             {/* Modal Content - Slide Up like a page */}
             <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Exoape style weighted bezier
                className="relative bg-[#1a1a1a] w-full h-[95vh] rounded-t-3xl border-t border-white/10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
             >
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h2 className="text-2xl font-serif font-bold text-white tracking-wide">{title}</h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 dagger-scroll pb-20">
                    {children}
                </div>
             </motion.div>
        </div>
    );
};

const DeleteConfirmModal = ({ title, message, onConfirm, onClose }: { title: string, message: string, onConfirm: () => void, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
    <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl w-full max-w-sm border border-slate-600 shadow-2xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold">Confirm</button>
      </div>
    </motion.div>
  </div>
);

const NumberStepper = ({ label, value, onChange, min = 0, max = 99 }: { label: string, value: number, onChange: (val: number) => void, min?: number, max?: number }) => (
    <div className="flex flex-col">
        <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">{label}</label>
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden h-10">
            <button 
                onClick={() => onChange(Math.max(min, value - 1))}
                className="w-10 h-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border-r border-slate-700 active:bg-slate-600"
            >
                <i className="fa-solid fa-minus text-xs" />
            </button>
            <div className="flex-1 text-center font-bold text-white text-base">
                {value}
            </div>
            <button 
                onClick={() => onChange(Math.min(max, value + 1))}
                className="w-10 h-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border-l border-slate-700 active:bg-slate-600"
            >
                <i className="fa-solid fa-plus text-xs" />
            </button>
        </div>
    </div>
);

const EditCharacterModal = ({ character, onSave, onClose }: { character: CharacterProfile, onSave: (data: Partial<CharacterProfile>) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState(character);

    const handleChange = (field: keyof CharacterProfile, value: any) => {
        if (field === 'level') {
            value = Math.max(1, Math.min(20, value));
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTraitChange = (index: number, val: number) => {
        const newTraits = [...formData.traits];
        newTraits[index] = { ...newTraits[index], value: val };
        setFormData(prev => ({ ...prev, traits: newTraits }));
    };

    return (
        <ModalWrapper title="Edit Profile" onClose={onClose}>
            <div className="max-w-2xl mx-auto space-y-8 pb-10">
                
                {/* Identity Block */}
                <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                             <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Name</label>
                             <input 
                                type="text" 
                                value={formData.name} 
                                onChange={e => handleChange('name', e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-serif font-bold focus:border-dagger-gold focus:outline-none" 
                             />
                        </div>
                        <div>
                             <NumberStepper label="Level" value={formData.level} onChange={v => handleChange('level', v)} min={1} max={10} />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Class</label>
                            <select value={formData.class} onChange={e => handleChange('class', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-dagger-gold outline-none">
                                {DAGGERHEART_RULES.classes.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Subclass</label>
                            <select value={formData.subclass} onChange={e => handleChange('subclass', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-dagger-gold outline-none">
                                {DAGGERHEART_RULES.classes.find(c => c.name === formData.class)?.subclasses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                             <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Ancestry</label>
                             <div className="flex gap-2">
                                <SmartAvatar ancestry={formData.ancestry} className="w-10 h-10 rounded border border-slate-600 shrink-0" />
                                <select value={formData.ancestry} onChange={e => handleChange('ancestry', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-dagger-gold outline-none">
                                    {DAGGERHEART_RULES.ancestries.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                             </div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                             <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Community</label>
                             <select value={formData.community} onChange={e => handleChange('community', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm focus:border-dagger-gold outline-none">
                                {DAGGERHEART_RULES.communities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                     </div>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Traits - New Layout */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-hand-fist text-slate-500" /> Traits
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.traits.map((t, i) => (
                             <React.Fragment key={t.name}>
                                <NumberStepper 
                                    label={t.name} 
                                    value={t.value} 
                                    onChange={(val) => handleTraitChange(i, val)} 
                                    min={-5}
                                    max={10}
                                />
                             </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-slate-800" />

                {/* Vitals - New Layout */}
                 <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-heart-pulse text-slate-500" /> Vitals
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <NumberStepper label="Max Health" value={formData.maxHp} onChange={v => handleChange('maxHp', v)} min={1} max={20} />
                        <NumberStepper label="Evasion" value={formData.evasion} onChange={v => handleChange('evasion', v)} />
                        <NumberStepper label="Max Armor" value={formData.maxArmor} onChange={v => handleChange('maxArmor', v)} />
                        <NumberStepper label="Max Stress" value={formData.maxStress} onChange={v => handleChange('maxStress', v)} />
                        <NumberStepper label="Max Hope" value={formData.maxHope} onChange={v => handleChange('maxHope', v)} />
                    </div>
                </div>

                 <div className="h-px bg-slate-800" />

                 {/* Thresholds - New Layout (Removed Severe) */}
                 <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved text-slate-500" /> Damage Thresholds
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberStepper label="Minor" value={formData.minorThreshold} onChange={v => handleChange('minorThreshold', v)} />
                        <NumberStepper label="Major" value={formData.majorThreshold} onChange={v => handleChange('majorThreshold', v)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button onClick={onClose} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-3 bg-dagger-gold text-slate-900 font-bold rounded-lg hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all active:scale-95">Save Profile</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

// ... (Other Modals updated similarly - wrapping them in ModalWrapper)

const AddWeaponModal = ({ onSave, onClose }: { onSave: (w: Weapon) => void, onClose: () => void }) => {
    const [weapon, setWeapon] = useState<Partial<Weapon>>({
        name: "", type: "Physical", damage: "d8", range: "Melee", trait: TraitType.Strength, description: ""
    });

    const handleSave = () => {
        if (!weapon.name) return;
        onSave({ ...weapon, id: generateSimpleId() } as Weapon);
    };

    return (
        <ModalWrapper title="Forge Weapon" onClose={onClose}>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <label className="block text-xs text-slate-500 uppercase font-bold mb-2">Quick Template</label>
                    <select 
                        onChange={(e) => {
                            const std = DAGGERHEART_RULES.standardWeapons.find(w => w.name === e.target.value);
                            if (std) {
                                setWeapon({
                                    name: std.name,
                                    type: std.type as "Physical" | "Magic",
                                    damage: std.damage,
                                    range: std.range,
                                    trait: std.trait as TraitType,
                                    description: std.desc
                                });
                            }
                        }}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-slate-300"
                    >
                        <option value="">-- Choose Standard Weapon --</option>
                        {DAGGERHEART_RULES.standardWeapons.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input placeholder="Weapon Name" value={weapon.name} onChange={e => setWeapon({...weapon, name: e.target.value})} className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-700 rounded p-3 text-white" />
                     
                     <select value={weapon.type} onChange={e => setWeapon({...weapon, type: e.target.value as any})} className="bg-slate-900 border border-slate-700 rounded p-3 text-white">
                        <option value="Physical">Physical Damage</option>
                        <option value="Magic">Magic Damage</option>
                     </select>
                     
                     <select value={weapon.trait} onChange={e => setWeapon({...weapon, trait: e.target.value as TraitType})} className="bg-slate-900 border border-slate-700 rounded p-3 text-white">
                        {Object.values(TraitType).map(t => <option key={t} value={t}>{t}</option>)}
                     </select>

                     <input placeholder="Damage (e.g. d10+2)" value={weapon.damage} onChange={e => setWeapon({...weapon, damage: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-3 text-white" />

                     <select value={weapon.range} onChange={e => setWeapon({...weapon, range: e.target.value})} className="bg-slate-900 border border-slate-700 rounded p-3 text-white">
                        {WEAPON_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                     </select>
                </div>
                
                <textarea placeholder="Description, effects, or special abilities..." value={weapon.description} onChange={e => setWeapon({...weapon, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white h-32 resize-none" />

                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={handleSave} className="px-6 py-2 bg-dagger-gold text-slate-900 font-bold rounded hover:bg-yellow-400">Add to Arsenal</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

const AddAbilityModal = ({ character, onSave, onClose, onPreview }: { character: CharacterProfile, onSave: (a: AbilityCard) => void, onClose: () => void, onPreview: (card: DomainCardData) => void }) => {
    const [mode, setMode] = useState<'CHOICE' | 'PRESET' | 'CUSTOM'>('CHOICE');
    const [filterDomain, setFilterDomain] = useState<string>(CLASS_DOMAINS[character.class]?.[0] || DAGGERHEART_RULES.domains[0]);
    const [filterLevel, setFilterLevel] = useState<number>(character.level);
    const [selectedCard, setSelectedCard] = useState<DomainCardData | null>(null);
    const [customAbility, setCustomAbility] = useState<Partial<AbilityCard>>({
        name: "", domain: CLASS_DOMAINS[character.class]?.[0] || "Blade", cost: "1 Hope", description: "", level: 1, active: true, type: "Ability", isPreset: false
    });

    const filteredCards = ALL_DOMAIN_CARDS.filter(c => 
        c.domain === filterDomain && c.level <= filterLevel
    ).sort((a, b) => a.level - b.level);

    const handleSavePreset = () => {
        if (!selectedCard) return;
        onSave({
            id: generateSimpleId(),
            name: selectedCard.name,
            domain: selectedCard.domain,
            level: selectedCard.level,
            cost: selectedCard.cost,
            description: selectedCard.description,
            type: selectedCard.type,
            active: true,
            isPreset: true
        });
    };

    const handleSaveCustom = () => {
        if (!customAbility.name) return;
        onSave({ ...customAbility, id: generateSimpleId(), isPreset: false } as AbilityCard);
    };

    return (
        <ModalWrapper title="Acquire New Ability" onClose={onClose}>
             <div className="max-w-4xl mx-auto h-full flex flex-col">
                {mode === 'CHOICE' && (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 items-center justify-center p-8">
                         <button 
                            onClick={() => setMode('PRESET')}
                            className="flex-1 w-full max-w-sm aspect-square flex flex-col items-center justify-center p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-dagger-gold rounded-2xl transition-all group gap-6"
                         >
                            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-dagger-gold text-4xl group-hover:scale-110 transition-transform shadow-xl">
                                <SearchIcon />
                            </div>
                            <div className="text-center">
                                <h4 className="text-2xl font-serif font-bold text-white mb-2">Domain Cards</h4>
                                <p className="text-slate-400">Select from the official deck based on your Class and Level.</p>
                            </div>
                         </button>

                         <button 
                            onClick={() => setMode('CUSTOM')}
                            className="flex-1 w-full max-w-sm aspect-square flex flex-col items-center justify-center p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 rounded-2xl transition-all group gap-6"
                         >
                            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-sky-400 text-4xl group-hover:scale-110 transition-transform shadow-xl">
                                <EditIcon />
                            </div>
                            <div className="text-center">
                                <h4 className="text-2xl font-serif font-bold text-white mb-2">Homebrew</h4>
                                <p className="text-slate-400">Forge a custom ability or spell with your own rules.</p>
                            </div>
                         </button>
                    </div>
                )}

                {mode === 'PRESET' && (
                    <div className="flex flex-col h-full">
                        <div className="flex gap-4 mb-6">
                             <button onClick={() => setMode('CHOICE')} className="px-4 py-2 bg-slate-800 rounded text-slate-300 hover:text-white"><BackIcon /></button>
                             <div className="flex-1 grid grid-cols-2 gap-4">
                                <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)} className="bg-slate-900 border border-slate-700 rounded p-2 text-white">
                                     <optgroup label="Class Domains">
                                        {CLASS_DOMAINS[character.class]?.map(d => <option key={d} value={d}>{d}</option>)}
                                     </optgroup>
                                     <optgroup label="All Domains">
                                        {DAGGERHEART_RULES.domains.filter(d => !CLASS_DOMAINS[character.class]?.includes(d)).map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                     </optgroup>
                                </select>
                                <select value={filterLevel} onChange={e => setFilterLevel(parseInt(e.target.value))} className="bg-slate-900 border border-slate-700 rounded p-2 text-white">
                                    {Array.from({length: 10}).map((_, i) => (
                                        <option key={i+1} value={i+1}>Level {i+1}</option>
                                    ))}
                                </select>
                             </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                             <div className="overflow-y-auto dagger-scroll bg-slate-900/30 rounded-xl border border-slate-800 p-2 space-y-2">
                                {filteredCards.map(c => (
                                    <div 
                                        key={c.name}
                                        onClick={() => setSelectedCard(c)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedCard?.name === c.name ? 'bg-slate-800 border-dagger-gold shadow-md' : 'bg-transparent border-slate-800 hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-200">{c.name}</span>
                                            <span className="text-xs text-slate-500 uppercase font-bold">{c.type}</span>
                                        </div>
                                    </div>
                                ))}
                             </div>
                             
                             <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 flex flex-col">
                                {selectedCard ? (
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-serif font-bold text-2xl text-white mb-1">{selectedCard.name}</h3>
                                                <div className="flex gap-2">
                                                     <span className={`text-xs px-2 py-0.5 rounded ${DOMAIN_RESOURCES[selectedCard.domain]?.colorBg || 'bg-slate-700'} text-white font-bold`}>{selectedCard.domain}</span>
                                                     <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Lvl {selectedCard.level}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-dagger-gold">{selectedCard.cost}</div>
                                                <div className="text-xs text-slate-500">{selectedCard.type}</div>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto dagger-scroll text-slate-300 leading-relaxed mb-6">
                                            {selectedCard.description}
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => onPreview(selectedCard)}
                                                className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-lg hover:bg-white/10 text-white transition-colors"
                                                title="View Full Card"
                                            >
                                                <EyeIcon />
                                            </button>
                                            <button 
                                                onClick={handleSavePreset}
                                                className="flex-1 py-3 bg-dagger-gold hover:bg-yellow-400 text-slate-900 font-bold rounded-lg shadow-lg"
                                            >
                                                Add Ability
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-slate-600">Select a card to preview</div>
                                )}
                             </div>
                        </div>
                    </div>
                )}
                 
                 {mode === 'CUSTOM' && (
                    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
                        <button onClick={() => setMode('CHOICE')} className="self-start px-4 py-2 mb-4 bg-slate-800 rounded text-slate-300 hover:text-white"><BackIcon /> Back</button>
                        <div className="space-y-4 flex-1">
                             <input placeholder="Ability Name" value={customAbility.name} onChange={e => setCustomAbility({...customAbility, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" />
                             <div className="grid grid-cols-2 gap-4">
                                <select value={customAbility.domain} onChange={e => setCustomAbility({...customAbility, domain: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white">
                                    {DAGGERHEART_RULES.domains.map(d => <option key={d} value={d}>{d}</option>)}
                                 </select>
                                 <input type="number" placeholder="Level" value={customAbility.level} onChange={e => setCustomAbility({...customAbility, level: parseInt(e.target.value)})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <input placeholder="Type (e.g. Spell)" value={customAbility.type} onChange={e => setCustomAbility({...customAbility, type: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" />
                                 <input placeholder="Cost (e.g. 1 Hope)" value={customAbility.cost} onChange={e => setCustomAbility({...customAbility, cost: e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" />
                             </div>
                             <textarea placeholder="Description..." value={customAbility.description} onChange={e => setCustomAbility({...customAbility, description: e.target.value})} className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white resize-none" />
                        </div>
                        <button onClick={handleSaveCustom} className="mt-6 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-lg">Save Custom Ability</button>
                    </div>
                 )}
             </div>
        </ModalWrapper>
    );
};

const AddExperienceModal = ({ onSave, onClose }: { onSave: (e: Experience) => void, onClose: () => void }) => {
    const [exp, setExp] = useState<Partial<Experience>>({
        name: "", value: 2, description: ""
    });

    const handleSave = () => {
        if (!exp.name) return;
        onSave({ ...exp, id: generateSimpleId() } as Experience);
    };

    return (
        <ModalWrapper title="Record Experience" onClose={onClose}>
             <div className="max-w-xl mx-auto space-y-6">
                <input placeholder="Name (e.g. Ex-Soldier)" value={exp.name} onChange={e => setExp({...exp, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white text-lg" />
                
                <div className="flex items-center gap-4">
                    <label className="text-slate-400">Bonus Value:</label>
                    <div className="flex gap-2">
                            {[1, 2, 3].map(v => (
                                <button 
                                key={v}
                                onClick={() => setExp({...exp, value: v})}
                                className={`w-12 h-12 rounded-lg border ${exp.value === v ? 'bg-dagger-hope border-dagger-hope text-black font-bold scale-110' : 'bg-slate-900 border-slate-700 text-slate-400'} transition-all`}
                                >
                                +{v}
                                </button>
                            ))}
                    </div>
                </div>

                <textarea placeholder="Description" value={exp.description} onChange={e => setExp({...exp, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white h-32" />
                
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                        {EXAMPLE_EXPERIENCES.Background.slice(0, 5).map(ex => (
                            <button key={ex} onClick={() => setExp(prev => ({...prev, name: ex}))} className="text-xs px-3 py-1.5 bg-slate-800 rounded-full text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700">{ex}</button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="px-6 py-2 bg-dagger-gold text-slate-900 font-bold rounded hover:bg-yellow-400">Record Experience</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

const AddInventoryModal = ({ onSave, onClose }: { onSave: (item: string) => void, onClose: () => void }) => {
    const [item, setItem] = useState("");

    return (
        <ModalWrapper title="Add Item" onClose={onClose}>
             <div className="max-w-xl mx-auto space-y-6">
                <input placeholder="Item Name" value={item} onChange={e => setItem(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white text-lg" autoFocus />
                
                <div className="space-y-4">
                    {Object.entries(COMMON_ITEMS).map(([cat, items]) => (
                        <div key={cat}>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2 border-b border-slate-800 pb-1">{cat}</p>
                            <div className="flex flex-wrap gap-2">
                                {items.map(i => (
                                    <button key={i} onClick={() => setItem(i)} className="text-sm px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors border border-slate-700/50">{i}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <button onClick={() => onSave(item)} className="px-6 py-2 bg-dagger-gold text-slate-900 font-bold rounded hover:bg-yellow-400">Add Item</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

const GoldExchangeModal = ({ currentGold, onUpdate, onClose }: { currentGold: number, onUpdate: (g: number) => void, onClose: () => void }) => {
    const [totalGold, setTotalGold] = useState(currentGold);
    const chests = Math.floor(totalGold / 1000);
    const bags = Math.floor((totalGold % 1000) / 100);
    const handfuls = Math.floor((totalGold % 100) / 10);
    const coins = totalGold % 10;

    useEffect(() => {
        onUpdate(totalGold);
    }, [totalGold]);

    const handleChange = (diff: number) => {
        const newTotal = totalGold + diff;
        setTotalGold(Math.max(0, newTotal));
    };

    return (
        <ModalWrapper title="Manage Wealth" onClose={onClose}>
            <div className="max-w-2xl mx-auto space-y-8 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                     <DraggableValue value={chests} onChange={(val) => handleChange((val - chests) * 1000)} label="Chests" min={0} max={999} />
                     <DraggableValue value={bags} onChange={(val) => handleChange((val - bags) * 100)} label="Bags" min={-1000} max={1000} loop={10} />
                     <DraggableValue value={handfuls} onChange={(val) => handleChange((val - handfuls) * 10)} label="Handfuls" min={-1000} max={1000} loop={10} />
                     <DraggableValue value={coins} onChange={(val) => handleChange(val - coins)} label="Coins" min={-1000} max={1000} loop={10} />
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-dagger-gold/10 to-transparent rounded-2xl border border-dagger-gold/20">
                    <div className="text-sm text-dagger-gold uppercase tracking-widest mb-2 font-bold opacity-70">Total Value</div>
                    <div className="text-5xl font-serif font-bold text-white drop-shadow-md">{totalGold} <span className="text-2xl text-dagger-gold">Gold</span></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-400">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                        <span className="font-bold text-white block mb-1">Coin (1g)</span>
                        A hot meal, ale, travel rations, small bribe.
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                        <span className="font-bold text-white block mb-1">Handful (10g)</span>
                        Basic supplies, night at an inn, simple tools.
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                        <span className="font-bold text-white block mb-1">Bag (100g)</span>
                        Weapons, armor, horse, fine luxury items.
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                        <span className="font-bold text-white block mb-1">Chest (1000g)</span>
                        Sailing ship, small estate, masterwork relics.
                    </div>
                </div>
                
                <div className="flex justify-center mt-8">
                     <button onClick={onClose} className="px-8 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all border border-slate-600">Close Vault</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default function App() {
  const [character, setCharacter] = useState<CharacterProfile>(INITIAL_CHARACTER);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [showRollDetail, setShowRollDetail] = useState(false);
  const [isSuccessChecked, setIsSuccessChecked] = useState(false);
  
  const [animatingResource, setAnimatingResource] = useState<'hope' | 'stress' | null>(null);
  const hopePanelRef = useRef<HTMLDivElement>(null);
  const stressPanelRef = useRef<HTMLDivElement>(null);

  const [activeModal, setActiveModal] = useState<'NONE' | 'PROFILE' | 'WEAPON' | 'ABILITY' | 'CHAR_SELECT' | 'INFO_MODAL' | 'EXPERIENCE' | 'INVENTORY' | 'GOLD'>('NONE');
  const [infoModalData, setInfoModalData] = useState({ topic: '', content: '', loading: false });
  const [savedCharacters, setSavedCharacters] = useState<CharacterProfile[]>([]);
  
  // NEW: State for showing card details popup
  const [previewCard, setPreviewCard] = useState<DomainCardData | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; } | null>(null);
  const [usageStats, setUsageStats] = useState({ calls: 0, tokens: 0 });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const backdropRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToUsage((stats) => setUsageStats(stats));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const id = await saveCharacterToDB(character);
        setSaveStatus('saved');
        if (!character.id) {
            setCharacter(prev => ({ ...prev, id }));
        }
      } catch (e) {
        console.error("Auto-save failed", e);
        setSaveStatus('idle'); 
      }
    }, 1000); 

    return () => clearTimeout(timer);
  }, [character]);

  const handleRoll = async (traitName: string, modifier: number) => {
    const hopeDie = Math.floor(Math.random() * 12) + 1;
    const fearDie = Math.floor(Math.random() * 12) + 1;
    const total = hopeDie + fearDie + modifier;
    const isCrit = hopeDie === fearDie;
    const withHope = hopeDie >= fearDie;
    
    setRollResult({ hopeDie, fearDie, total, isCrit, withHope, withFear: !withHope });
    setIsSuccessChecked(false);
    setShowRollDetail(true);
  };

  const handleSuccessConfirmation = () => {
    if (!rollResult) return;
    setIsSuccessChecked(true);

    setTimeout(() => {
        setShowRollDetail(false);
        setIsSuccessChecked(false);

        if (rollResult.isCrit) {
             setAnimatingResource('stress');
             setCharacter(prev => ({ ...prev, stress: Math.max(0, prev.stress - 1) }));
             stressPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
             setAnimatingResource('hope');
             setCharacter(prev => ({ ...prev, hope: Math.min(prev.maxHope, prev.hope + 1) }));
             hopePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
            setAnimatingResource(null);
        }, 1500);

    }, 400); 
  };

  const handleAskAI = async (topic: string, context: string) => {
    setInfoModalData({ topic, content: '', loading: true });
    setActiveModal('INFO_MODAL');
    const answer = await getRulesInsight(topic, context);
    setInfoModalData({ topic, content: answer, loading: false });
  };

  const handleStaticInfo = (key: string) => {
    const info = STATIC_INFO[key];
    if (info) {
        setInfoModalData({ topic: info.title, content: info.content, loading: false });
        setActiveModal('INFO_MODAL');
    }
  };

  const loadCharacters = async () => {
    const chars = await getAllCharacters();
    setSavedCharacters(chars);
    setActiveModal('CHAR_SELECT');
  };

  const handleNewCharacter = () => {
      setCharacter({ ...BLANK_CHARACTER });
      setActiveModal('NONE');
  };

  const handleUpdateProfile = (formData: Partial<CharacterProfile>) => {
    setCharacter(prev => {
        const updatedChar = { ...prev, ...formData };
        if (formData.class || formData.level) {
            const validDomains = CLASS_DOMAINS[updatedChar.class] || [];
            const currentLevel = updatedChar.level;

            const validAbilities = updatedChar.abilities.filter(ability => {
                if (ability.isPreset) {
                    if (validDomains.includes(ability.domain)) {
                        return ability.level <= currentLevel;
                    }
                    return false;
                }
                return ability.level <= currentLevel;
            });
            return { ...updatedChar, abilities: validAbilities };
        }
        return updatedChar;
    });
    setActiveModal('NONE');
  };

  const handleAddWeapon = (weapon: Weapon) => {
    setCharacter(prev => ({ ...prev, weapons: [...prev.weapons, weapon] }));
    setActiveModal('NONE');
  };

  const handleAddAbility = (ability: AbilityCard) => {
    setCharacter(prev => ({ ...prev, abilities: [...prev.abilities, ability] }));
    setActiveModal('NONE');
  };

  const handleAddExperience = (exp: Experience) => {
    setCharacter(prev => ({ ...prev, experiences: [...prev.experiences, exp] }));
    setActiveModal('NONE');
  };

  const handleAddInventory = (item: string) => {
    if (item) {
        setCharacter(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
    }
    setActiveModal('NONE');
  };

  const handleUpdateGold = (newGold: number) => {
      setCharacter(prev => ({ ...prev, gold: newGold }));
  };

  const handleDomainClick = (domain: string) => {
    const info = DOMAIN_DESCRIPTIONS[domain];
    if (info) {
        setInfoModalData({ 
            topic: `${domain} Domain`, 
            content: `**Core Theme:**\n${info.description}\n\n**Associated Classes:**\n${info.classes}`, 
            loading: false 
        });
        setActiveModal('INFO_MODAL');
    }
  };

  // --- Deletion Request Handlers ---
  const requestDeleteWeapon = (id: string) => {
    setDeleteModal({
        isOpen: true, title: "Delete Weapon", message: "Are you sure you want to remove this weapon?",
        onConfirm: () => {
            setCharacter(prev => ({ ...prev, weapons: prev.weapons.filter(w => w.id !== id) }));
            setDeleteModal(null);
        }
    });
  };

  const requestDeleteAbility = (id: string) => {
    setDeleteModal({
        isOpen: true, title: "Delete Ability", message: "Are you sure you want to remove this ability?",
        onConfirm: () => {
            setCharacter(prev => ({ ...prev, abilities: prev.abilities.filter(a => a.id !== id) }));
            setDeleteModal(null);
        }
    });
  };

  const requestDeleteExperience = (index: number) => {
    setDeleteModal({
        isOpen: true, title: "Forget Experience", message: "Are you sure you want to remove this experience tag?",
        onConfirm: () => {
            setCharacter(prev => ({ ...prev, experiences: prev.experiences.filter((_, i) => i !== index) }));
            setDeleteModal(null);
        }
    });
  };

  const requestDeleteInventory = (index: number) => {
      setDeleteModal({
        isOpen: true, title: "Remove Item", message: "Are you sure you want to remove this item?",
        onConfirm: () => {
             setCharacter(prev => ({ ...prev, inventory: prev.inventory.filter((_, i) => i !== index) }));
             setDeleteModal(null);
        }
      });
  };

  const requestDeleteSavedChar = (id: string) => {
      setDeleteModal({
          isOpen: true, title: "Delete Character", message: "Permanently delete this character?",
          onConfirm: async () => {
            await deleteCharacterFromDB(id);
            const chars = await getAllCharacters();
            setSavedCharacters(chars);
            setDeleteModal(null);
          }
      });
  };
  
  // Helper to find original card data from an ability (if looking up by name)
  const getFullCardData = (ability: AbilityCard): DomainCardData => {
     // If the ability has image url, it's good
     // If not, find it in ALL_DOMAIN_CARDS
     const found = ALL_DOMAIN_CARDS.find(c => c.name === ability.name && c.domain === ability.domain);
     if (found) return found;
     
     // Fallback if custom
     return {
        name: ability.name,
        domain: ability.domain,
        level: ability.level,
        type: ability.type,
        cost: ability.cost,
        description: ability.description,
        imageUrl: "" // No image for custom by default
     };
  };

  const getResultColor = (res: RollResult) => {
    if (res.isCrit) return 'text-dagger-gold border-dagger-gold';
    if (res.withHope) return 'text-dagger-hope border-dagger-hope';
    return 'text-dagger-fear border-dagger-fear';
  };

  const getResultBg = (res: RollResult) => {
    if (res.isCrit) return 'bg-yellow-500/20';
    if (res.withHope) return 'bg-cyan-500/20';
    return 'bg-purple-500/20';
  };
  
  const chests = Math.floor(character.gold / 1000);
  const bags = Math.floor((character.gold % 1000) / 100);
  const handfuls = Math.floor((character.gold % 100) / 10);
  const coins = character.gold % 10;
  const characterDomains = CLASS_DOMAINS[character.class] || [];

  return (
    <div className="min-h-screen bg-dagger-dark text-slate-200 p-4 md:p-8 font-sans relative pb-24 selection:bg-dagger-gold selection:text-black">
      
      {animatingResource && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-none"
        />
      )}

      {/* --- HEADER --- */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6 relative z-0"
      >
        <div className="flex items-center gap-8">
            <div className="flex flex-col items-center relative group">
                <SmartAvatar 
                    ancestry={character.ancestry}
                    level={character.level}
                    className="w-28 h-28 rounded-full border border-white/10 shadow-2xl z-10 bg-slate-800"
                />
                
                <div className="flex gap-1 -mt-8 z-0 pt-0">
                    {characterDomains.map(domain => {
                        const res = DOMAIN_RESOURCES[domain];
                        if (!res) return null;
                        return (
                            <div 
                                key={domain} 
                                onClick={() => handleDomainClick(domain)}
                                className={`w-10 h-20 flex items-start justify-center shadow-lg ${res.colorBg} cursor-pointer hover:brightness-110 transition-all active:translate-y-0.5`} 
                                style={{ 
                                    clipPath: "polygon(0% 0%, 100% 0%, 100% 60%, 92% 68%, 92% 10%, 90% 96%, 65% 88%, 50% 75%, 35% 88%, 15% 96%, 8% 20%, 8% 68%, 0% 60%)",
                                    paddingTop: "1.2rem"
                                }}
                            >
                                <img src={res.icon} alt={domain} className="w-11 h-11 object-contain drop-shadow-sm filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-2 md:mt-0">
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wide mb-1"
                >
                    {character.name}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 flex items-center gap-2 flex-wrap text-lg"
                >
                    <span className="text-slate-300 font-medium">{character.ancestry} {character.class}</span>
                    <span className="text-slate-600">•</span> 
                    <span className="text-dagger-gold font-serif italic">{character.subclass}</span>
                    <button onClick={() => handleStaticInfo("Class Features")} className="ml-2 hover:text-white transition-colors opacity-50 hover:opacity-100">
                        <InfoIcon />
                    </button>
                </motion.p>
            </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={handleNewCharacter} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all text-sm font-medium backdrop-blur-sm">New</button>
          <button onClick={loadCharacters} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all text-sm font-medium backdrop-blur-sm">Load</button>
          <button onClick={() => setActiveModal('PROFILE')} className="px-5 py-2.5 bg-white text-black hover:bg-slate-200 rounded-full border border-transparent transition-all text-sm font-bold shadow-lg shadow-white/10">Edit Profile</button>
        </div>
      </motion.header>

      {/* --- MAIN GRID --- */}
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
            }
        }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 relative"
      >
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <h2 className="text-2xl font-serif font-bold mb-6 text-white border-b border-white/5 pb-2">Traits</h2>
            <div className="space-y-4 relative z-10">
              {character.traits.map((trait) => (
                <div key={trait.name} className="flex items-center justify-between group/row">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleStaticInfo(trait.name)} className="text-slate-600 hover:text-white transition-colors"><InfoIcon /></button>
                    <span className="font-semibold text-slate-300 w-24 tracking-wide">{trait.name}</span>
                  </div>
                  <button 
                    onClick={() => handleRoll(trait.name, trait.value)}
                    className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 hover:border-dagger-hope/50 transition-all text-lg font-bold text-sky-300 shadow-inner"
                  >
                    {trait.value >= 0 ? `+${trait.value}` : trait.value}
                  </button>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -z-0 group-hover:bg-sky-500/20 transition-all duration-700"></div>
          </motion.div>

          <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="glass-panel rounded-2xl p-6 flex items-center justify-between group">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Evasion</h2>
                <div className="h-0.5 w-8 bg-dagger-gold/50 group-hover:w-full transition-all duration-500"></div>
              </div>
              <div className="text-5xl font-bold text-white drop-shadow-2xl">{character.evasion}</div>
          </motion.div>
        </div>

        {/* CENTER COLUMN */}
        <div className="md:col-span-6 space-y-8">
          
          <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="grid grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-3 text-center relative overflow-hidden flex flex-col items-center h-48 bg-gradient-to-b from-[#1a1a1a] to-transparent">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/50"></div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 mt-2 mb-2">Damage</h3>
              
              <div className="flex gap-2 justify-center w-full mb-1 opacity-60 hover:opacity-100 transition-opacity">
                 {[character.minorThreshold, character.majorThreshold, character.severeThreshold].map((t, i) => (
                     <div key={i} className="flex flex-col items-center">
                        <span className="text-[8px] text-slate-500 uppercase font-bold">{['Min', 'Maj', 'Sev'][i]}</span>
                        <span className="text-[10px] text-slate-300">{t}</span>
                     </div>
                 ))}
              </div>
              
              <div className="flex-grow flex items-center justify-between w-full px-2">
                <button onClick={(e) => { e.stopPropagation(); setCharacter(c => ({...c, hp: Math.max(0, c.hp - 1)})); }} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"><i className="fa-solid fa-minus text-xs" /></button>
                <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] tabular-nums">{character.hp}</div>
                <button onClick={(e) => { e.stopPropagation(); setCharacter(c => ({...c, hp: Math.min(c.maxHp, c.hp + 1)})); }} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"><i className="fa-solid fa-plus text-xs" /></button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-1.5 mb-2 px-1">
                  {Array.from({length: character.maxHp}).map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCharacter(c => ({...c, hp: i + 1 === c.hp ? i : i + 1}))}
                        className={`w-6 h-6 rounded-full transition-all duration-300 ${i < character.hp ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-110' : 'bg-slate-700'}`}
                    />
                  ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-3 text-center relative overflow-hidden flex flex-col items-center h-48 bg-gradient-to-b from-[#1a1a1a] to-transparent">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-slate-400/50"></div>
              <h3 className="text-xs uppercase tracking-widest text-slate-500 mt-2 mb-4">Armor</h3>
              <div className="h-[26px]"></div>
              
              <div className="flex-grow flex items-center justify-between w-full px-2">
                 <button onClick={(e) => { e.stopPropagation(); setCharacter(c => ({...c, armor: Math.max(0, c.armor - 1)})); }} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"><i className="fa-solid fa-minus text-xs" /></button>
                 <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-md tabular-nums">{character.armor}</div>
                 <button onClick={(e) => { e.stopPropagation(); setCharacter(c => ({...c, armor: Math.min(c.maxArmor, c.armor + 1)})); }} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"><i className="fa-solid fa-plus text-xs" /></button>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mb-2 px-1">
                  {Array.from({length: character.maxArmor}).map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCharacter(c => ({...c, armor: i + 1 === c.armor ? i : i + 1}))}
                        className={`w-6 h-6 rounded-full transition-all duration-300 ${i < character.armor ? 'bg-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-110' : 'bg-slate-700'}`}
                    />
                  ))}
              </div>
            </div>

            <div 
                ref={stressPanelRef}
                className={`col-span-2 glass-panel rounded-2xl p-5 flex items-center justify-between px-8 relative overflow-hidden transition-all duration-700 ease-[0.16,1,0.3,1] ${animatingResource === 'stress' ? 'z-[60] scale-105 shadow-2xl bg-purple-900/60 border-purple-400 ring-1 ring-purple-400/50' : ''}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                    <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold">Stress</h3>
                </div>
                <div className="flex gap-3">
                    {Array.from({length: character.maxStress}).map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setCharacter(c => ({...c, stress: i + 1 === c.stress ? i : i + 1}))}
                            className={`w-5 h-5 rotate-45 border border-purple-500/50 transition-all duration-300 ${
                                i < character.stress ? 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] scale-110' : 'bg-transparent'
                            }`}
                        />
                    ))}
                </div>
                <span className="text-2xl font-bold text-purple-400 tabular-nums">{character.stress}</span>
            </div>
            
             <div 
                ref={hopePanelRef}
                className={`col-span-2 glass-panel rounded-2xl p-5 flex items-center justify-between px-8 relative overflow-hidden transition-all duration-700 ease-[0.16,1,0.3,1] ${animatingResource === 'hope' ? 'z-[60] scale-105 shadow-2xl bg-sky-900/60 border-sky-400 ring-1 ring-sky-400/50' : ''}`}
             >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-dagger-hope rounded-full"></div>
                    <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold">Hope</h3>
                </div>
                <div className="flex gap-3">
                    {Array.from({length: character.maxHope}).map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setCharacter(c => ({...c, hope: i + 1 === c.hope ? i : i + 1}))}
                            className={`w-7 h-7 rounded-full border border-dagger-hope/50 transition-all duration-300 ${
                                i < character.hope ? 'bg-dagger-hope shadow-[0_0_12px_rgba(56,189,248,0.6)] scale-110' : 'bg-transparent'
                            }`}
                        />
                    ))}
                </div>
                <span className="text-2xl font-bold text-dagger-hope tabular-nums">{character.hope}</span>
            </div>
          </motion.div>

          <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="glass-panel rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white">Arsenal</h2>
                <button onClick={() => setActiveModal('WEAPON')} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors text-slate-400"><PlusIcon /></button>
             </div>
             <div className="grid grid-cols-1 gap-4">
                {character.weapons.map((w) => (
                    <div key={w.id} className="bg-[#151515] p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-slate-600"><SwordIcon /></div>
                            <div>
                                <h4 className="font-bold text-slate-200 text-lg">{w.name}</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">{w.type} • {w.range} • <span className="text-white">{w.damage}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button 
                                onClick={() => handleAskAI(`Weapon: ${w.name}`, w.description)}
                                className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-slate-500 hover:text-white border border-transparent hover:border-white/10 transition-all"
                            >
                                INSIGHT
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); requestDeleteWeapon(w.id); }} className="text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
             </div>
          </motion.div>

          <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-serif font-bold text-white">Abilities</h2>
                <button onClick={() => setActiveModal('ABILITY')} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors text-slate-400"><PlusIcon /></button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {character.abilities.map(a => (
                    <div 
                        key={a.id} 
                        onClick={() => setPreviewCard(getFullCardData(a))} 
                        className="bg-[#151515] p-5 rounded-xl border border-white/5 hover:border-dagger-gold/30 transition-all relative group cursor-pointer hover:shadow-lg hover:-translate-y-1 duration-300"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                             <button onClick={(e) => { e.stopPropagation(); handleAskAI(`Ability: ${a.name}`, a.description); }} className="text-slate-600 hover:text-white"><CommentIcon /></button>
                             <button onClick={(e) => { e.stopPropagation(); requestDeleteAbility(a.id); }} className="text-slate-600 hover:text-red-500"><TrashIcon /></button>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-[10px] font-bold text-dagger-gold uppercase tracking-widest border border-dagger-gold/20 px-2 py-0.5 rounded-full bg-dagger-gold/5">
                                {a.domain}
                            </span>
                            <span className="text-[10px] text-slate-500">{a.type}</span>
                        </div>
                        <h4 className="font-serif font-bold text-white text-lg mb-2">{a.name}</h4>
                        <div className="text-xs text-dagger-hope font-bold mb-3 uppercase tracking-wide">{a.cost}</div>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{a.description}</p>
                        
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity pointer-events-none"></div>
                    </div>
                ))}
                {character.abilities.length === 0 && (
                    <div className="col-span-2 py-8 text-center border border-dashed border-white/10 rounded-xl text-slate-600 text-sm">
                        Your grimoire is empty.
                    </div>
                )}
             </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 space-y-6">
           <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-bold text-white">Experiences</h2>
                <button onClick={() => setActiveModal('EXPERIENCE')} className="text-slate-500 hover:text-white"><PlusIcon /></button>
            </div>
            <div className="space-y-3">
                {character.experiences.map((e, i) => (
                    <div key={e.id || i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                        <span className="text-sm text-slate-300 font-medium">{e.name}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-dagger-hope border border-dagger-hope/30 px-1.5 py-0.5 rounded">+{e.value}</span>
                            <button onClick={(ev) => { ev.stopPropagation(); requestDeleteExperience(i); }} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
            </div>
           </motion.div>

           <motion.div variants={{ hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 }}} className="glass-panel rounded-2xl p-6 min-h-[400px] flex flex-col">
            <div 
                className="bg-gradient-to-r from-[#222] to-[#151515] rounded-xl border border-dagger-gold/20 p-4 mb-6 cursor-pointer hover:border-dagger-gold/50 transition-all group shadow-lg"
                onClick={() => setActiveModal('GOLD')}
            >
                <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] text-dagger-gold uppercase tracking-widest font-bold opacity-80">Total Wealth</span>
                    <span className="text-xs text-slate-500 group-hover:text-white transition-colors">Manage &rarr;</span>
                </div>
                
                <div className="flex justify-between items-end">
                     <div>
                        <span className="text-3xl font-serif font-bold text-white block">{character.gold}</span>
                        <span className="text-[10px] text-slate-500 uppercase">Gold Pieces</span>
                     </div>
                     <div className="text-dagger-gold opacity-50 text-2xl"><CoinIcon /></div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-bold text-white">Inventory</h2>
                <button onClick={() => setActiveModal('INVENTORY')} className="text-slate-500 hover:text-white"><PlusIcon /></button>
            </div>
            <ul className="space-y-3 flex-1">
                {character.inventory.map((item, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-center justify-between group py-1 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            {item}
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); requestDeleteInventory(i); }} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"><TrashIcon /></button>
                    </li>
                ))}
            </ul>
           </motion.div>
        </div>
      </motion.main>

      {/* --- FLOATING UI --- */}
      <ChatWidget />
      
      <div className="fixed bottom-6 left-6 z-40 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-[10px] text-slate-500 uppercase tracking-widest pointer-events-none">
        API: <span className="text-dagger-hope">{usageStats.calls}</span> | Tokens: <span className="text-dagger-fear">{usageStats.tokens}</span>
      </div>
      
      {/* --- PREVIEW CARD MODAL --- */}
      <AnimatePresence>
        {previewCard && (
            <CardRevealModal 
                card={previewCard} 
                onClose={() => setPreviewCard(null)} 
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
      {rollResult && (
        <>
          {showRollDetail && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[120] flex items-center justify-center p-4"
              onMouseDown={(e) => { if(e.target === e.currentTarget) backdropRef.current = e.target; }}
              onMouseUp={(e) => { 
                if(e.target === e.currentTarget && backdropRef.current === e.currentTarget) setShowRollDetail(false);
                backdropRef.current = null;
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-3xl max-w-sm w-full p-8 shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()} 
              >
                <div className={`absolute inset-0 opacity-10 ${getResultBg(rollResult)}`}></div>
                
                <div className="relative z-10 text-center">
                  <h3 className={`text-xl font-bold mb-2 uppercase tracking-widest ${getResultColor(rollResult)}`}>
                    {rollResult.isCrit ? "Critical Roll" : (rollResult.withHope ? "Roll with Hope" : "Roll with Fear")}
                  </h3>
                  <div className="text-8xl font-bold text-white my-8 drop-shadow-2xl font-serif tracking-tighter">
                    {rollResult.total}
                  </div>
                  
                  <div className="flex justify-center gap-12 mb-8">
                    <div className="text-center">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Hope</div>
                        <div className={`text-4xl font-bold ${rollResult.withHope ? 'text-dagger-hope' : 'text-slate-600'}`}>{rollResult.hopeDie}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Fear</div>
                        <div className={`text-4xl font-bold ${!rollResult.withHope ? 'text-dagger-fear' : 'text-slate-600'}`}>{rollResult.fearDie}</div>
                    </div>
                  </div>
                  
                  {rollResult.withHope && (
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">Confirm Success</p>
                        <button 
                            onClick={handleSuccessConfirmation}
                            className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto transition-all duration-500 ease-out ${
                                isSuccessChecked 
                                    ? 'bg-dagger-gold border-dagger-gold text-black scale-110 rotate-12' 
                                    : 'bg-transparent border-white/20 hover:border-dagger-gold hover:text-dagger-gold text-white/20'
                            }`}
                        >
                            <i className="fa-solid fa-check text-2xl"></i>
                        </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {!showRollDetail && (
            <motion.button
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              onClick={() => setShowRollDetail(true)}
              className={`fixed bottom-8 right-8 w-20 h-20 rounded-full glass-panel shadow-2xl border flex items-center justify-center z-40 hover:scale-110 active:scale-95 duration-300 ${getResultColor(rollResult)} bg-black/50`}
            >
              <span className="text-3xl font-bold font-serif">{rollResult.total}</span>
              <span className={`absolute -top-1 -right-1 flex h-4 w-4`}>
                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${rollResult.withHope ? 'bg-dagger-hope' : 'bg-dagger-fear'}`}></span>
                 <span className={`relative inline-flex rounded-full h-4 w-4 ${rollResult.withHope ? 'bg-dagger-hope' : 'bg-dagger-fear'}`}></span>
              </span>
            </motion.button>
          )}
        </>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {activeModal !== 'NONE' && activeModal !== 'INFO_MODAL' && (
            <>
              {activeModal === 'PROFILE' && <EditCharacterModal character={character} onSave={handleUpdateProfile} onClose={() => setActiveModal('NONE')} />}
              {activeModal === 'WEAPON' && <AddWeaponModal onSave={handleAddWeapon} onClose={() => setActiveModal('NONE')} />}
              {activeModal === 'ABILITY' && <AddAbilityModal character={character} onSave={handleAddAbility} onClose={() => setActiveModal('NONE')} onPreview={setPreviewCard} />}
              {activeModal === 'EXPERIENCE' && <AddExperienceModal onSave={handleAddExperience} onClose={() => setActiveModal('NONE')} />}
              {activeModal === 'INVENTORY' && <AddInventoryModal onSave={handleAddInventory} onClose={() => setActiveModal('NONE')} />}
              {activeModal === 'GOLD' && <GoldExchangeModal currentGold={character.gold} onUpdate={handleUpdateGold} onClose={() => setActiveModal('NONE')} />}
              
              {activeModal === 'CHAR_SELECT' && (
                <ModalWrapper title="Select Character" onClose={() => setActiveModal('NONE')}>
                    <div className="max-w-xl mx-auto space-y-4">
                        {savedCharacters.length === 0 && <p className="text-slate-500 text-center py-10 italic">No saved legends found.</p>}
                        {savedCharacters.map(char => (
                            <div key={char.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-white/10" onClick={() => { setCharacter(char); setActiveModal('NONE'); }}>
                                <div className="flex-1">
                                    <div className="font-serif font-bold text-white text-lg">{char.name}</div>
                                    <div className="text-sm text-slate-400">{char.class} • Lvl {char.level}</div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); requestDeleteSavedChar(char.id!); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-slate-600 hover:bg-red-900/20 hover:text-red-500 transition-colors"><TrashIcon /></button>
                            </div>
                        ))}
                    </div>
                </ModalWrapper>
              )}
            </>
        )}
      </AnimatePresence>
      
      {/* Info Modal Separate for simpler popup feel */}
      <AnimatePresence>
      {activeModal === 'INFO_MODAL' && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
            onMouseDown={(e) => { if(e.target === e.currentTarget) backdropRef.current = e.target; }}
            onMouseUp={(e) => { 
                if(e.target === e.currentTarget && backdropRef.current === e.currentTarget) setActiveModal('NONE');
                backdropRef.current = null;
            }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-lg text-dagger-gold flex items-center gap-2 font-serif">
                <InfoIcon /> {infoModalData.topic}
              </h3>
              <button onClick={() => setActiveModal('NONE')} className="text-slate-400 hover:text-white"><CloseIcon /></button>
            </div>
            <div className="p-8 overflow-y-auto dagger-scroll">
              {infoModalData.loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                </div>
              ) : (
                <MarkdownText content={infoModalData.content} />
              )}
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {deleteModal && (
          <DeleteConfirmModal 
              title={deleteModal.title}
              message={deleteModal.message}
              onConfirm={deleteModal.onConfirm}
              onClose={() => setDeleteModal(null)}
          />
      )}
      </AnimatePresence>
    </div>
  );
}