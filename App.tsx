
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { Crown, User, Mail, Phone, Users, MapPin, Calendar, Clock, Loader, ShieldCheck, FileText, CheckCircle, Music, ClipboardCopy, PartyPopper, DiscAlbum, History, Wand2, DollarSign, Home, Briefcase, GraduationCap, Sparkles, Send } from 'lucide-react';

// --- TYPES ---
interface FormData {
    clientName: string;
    email: string;
    phone: string;
    eventType: string;
    guestCount: number;
    eventDate: string;
    startTime: string;
    endTime: string;
    address: string;
    addMics: boolean;
    addLights: boolean;
    paypalEmail: string;
}

interface Quote {
    duration: number;
    baseFee: number;
    micFee: number;
    lightsFee: number;
    transportationFee: number;
    total: number;
    deposit: number;
    balance: number;
}

interface Song {
    title: string;
    artist: string;
}

interface PlaylistPromptData {
    vibe: string;
    genre: string;
    keySong: string;
    era: string;
    count: number;
}


// --- CONSTANTS ---
const HOURLY_RATE = 150;
const MIC_FEE = 50;
const LIGHTS_FEE = 200;
const TRANSPORTATION_ESTIMATE = 60;

// --- SUPABASE CLIENT ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;


// --- API SERVICE ---
const geminiService = {
  generateContract: async (formData: FormData, quote: Quote) => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const equipmentList = [
      "Base DJ Service (Laptop, DJ Controller, 2 Speakers)",
      formData.addMics ? "Cordless Microphones" : "",
      formData.addLights ? "Professional DJ Lighting Rig" : "",
    ].filter(Boolean).join("\n- ");

    const prompt = `
      You are a legal assistant specializing in contracts for freelance entertainers. 
      Generate a professional DJ Service Agreement for "Royal Events Worldwide" based on the following details.
      The output should be clean, well-formatted text, suitable for display on a webpage.

      **Event Details:**
      - Client Name: ${formData.clientName}
      - Client Email: ${formData.email}
      - Client Phone: ${formData.phone}
      - Event Type: ${formData.eventType}
      - Event Date: ${formData.eventDate}
      - Start Time: ${formData.startTime}
      - End Time: ${formData.endTime}
      - Total Duration: ${quote.duration} hours
      - Venue Address: ${formData.address}
      - Expected Guests: ${formData.guestCount}

      **Services & Equipment Provided:**
      - ${equipmentList}

      **Financial Agreement:**
      - DJ Performance Fee: $${quote.baseFee.toFixed(2)} (${quote.duration} hours at $${HOURLY_RATE}/hour)
      - Equipment Fee (Mics): $${quote.micFee.toFixed(2)}
      - DJ Lights Fee: $${quote.lightsFee.toFixed(2)}
      - Estimated Transportation Fee: $${quote.transportationFee.toFixed(2)}
      - **Total Estimated Fee:** $${quote.total.toFixed(2)}
      - **50% Deposit Required:** $${quote.deposit.toFixed(2)} (Due upon signing to secure the date)
      - **Remaining Balance:** $${quote.balance.toFixed(2)} (Due upon DJ's arrival at the event)

      **Terms & Conditions:**
      1.  **Payment:** The 50% deposit is non-refundable and required to secure the event date. The remaining balance must be paid upon the DJ's arrival. Overtime is billed at $100.00 per additional hour and must be paid on the spot.
      2.  **Travel:** All round-trip transportation costs must be paid for by the client. The fee is an estimate and the final cost will be based on actual receipts.
      3.  **Amenities:** The DJ must be provided with complimentary non-alcoholic drinks and a meal.
      4.  **Security:** The client must ensure the DJ and equipment are in a secure location, safe from harm or theft.
      5.  **Equipment Usage:** Only the DJ or authorized personnel may operate the DJ equipment (including microphones). Unauthorized use is prohibited.
      6.  **Cancellation:** Cancellations by the client within 14 days of the event date will forfeit the deposit.
      
      Generate the complete DJ Service Agreement document now.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  },

  generatePlaylist: async (data: PlaylistPromptData) => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a world-class DJ and music curator known as "Vibe Creator AI" for Royal Events Worldwide.
      Your task is to generate a playlist of exactly ${data.count} songs based on the user's request. The playlist should be coherent and flow well.

      User Request:
      - Vibe/Description: "${data.vibe}"
      - Genre(s): ${data.genre || 'any'}
      - Key Song (to build around): ${data.keySong || 'none'}
      - Era/Year: ${data.era || 'any'}

      Generate a list of exactly ${data.count} songs that match these criteria.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    songs: {
                        type: Type.ARRAY,
                        description: `An array of exactly ${data.count} song objects.`,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The title of the song." },
                                artist: { type: Type.STRING, description: "The name of the artist or band." }
                            },
                            required: ["title", "artist"]
                        }
                    }
                },
                required: ["songs"]
            }
        }
    });

    try {
        const resultText = response.text.trim();
        const result = JSON.parse(resultText);
        return result.songs || [];
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("The AI returned an invalid playlist format.");
    }
  }
};

// --- HELPER COMPONENTS ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  label: string;
}
const FormInput: React.FC<InputProps> = ({ icon: Icon, label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-300">{label}</label>
    <div className="relative mt-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <input
        {...props}
        className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
      />
    </div>
  </div>
);

// --- BOOKING PAGE COMPONENT ---
const BookingPage = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Contract, 3: Confirmation
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractText, setContractText] = useState('');
  const [formData, setFormData] = useState<FormData>({
    clientName: '', email: '', phone: '', eventType: 'Birthday Party', guestCount: 50,
    eventDate: '', startTime: '19:00', endTime: '23:00', address: '',
    addMics: false, addLights: false, paypalEmail: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const quote = useMemo(() => {
    const { startTime, endTime, addMics, addLights } = formData;
    let duration = 0;
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      if (end < start) end.setDate(end.getDate() + 1); // Handle overnight events
      duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    const baseFee = duration * HOURLY_RATE;
    const micFee = addMics ? MIC_FEE : 0;
    const lightsFee = addLights ? LIGHTS_FEE : 0;
    const transportationFee = TRANSPORTATION_ESTIMATE;

    const total = baseFee + micFee + lightsFee + transportationFee;
    const deposit = total * 0.5;
    const balance = total - deposit;

    return { duration, baseFee, micFee, lightsFee, transportationFee, total, deposit, balance };
  }, [formData]);

  const handleGenerateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const contract = await geminiService.generateContract(formData, quote);
      setContractText(contract);
      setStep(2);
    } catch (err) {
      setError('Failed to generate contract. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const BookingForm = () => (
    <form onSubmit={handleGenerateContract} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6 bg-[#111] p-8 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-serif text-[#D4AF37] border-b border-gray-700 pb-3 mb-6">Book a Speaker or DJ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput icon={User} label="Full Name" name="clientName" value={formData.clientName} onChange={handleInputChange} type="text" placeholder="John Doe" required />
          <FormInput icon={Mail} label="Email Address" name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john.doe@email.com" required />
          <FormInput icon={Phone} label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="(555) 123-4567" required />
          <FormInput icon={DollarSign} label="Your PayPal.me Username or Email" name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange} type="text" placeholder="your-paypal-username" />
        </div>
        <FormInput icon={MapPin} label="Venue Full Address" name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="123 Main St, Anytown, USA" required />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormInput icon={Users} label="Guest Count" name="guestCount" value={formData.guestCount} onChange={handleInputChange} type="number" min="1" placeholder="50" required />
          <FormInput icon={Calendar} label="Event Date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} type="date" required />
          <FormInput icon={Clock} label="Start Time" name="startTime" value={formData.startTime} onChange={handleInputChange} type="time" required />
          <FormInput icon={Clock} label="End Time" name="endTime" value={formData.endTime} onChange={handleInputChange} type="time" required />
        </div>
         <div>
            <label className="text-sm font-medium text-gray-300">Event Type</label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <PartyPopper className="h-5 w-5 text-gray-500" />
              </div>
              <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition appearance-none">
                <option>Birthday Party</option>
                <option>Wedding</option>
                <option>Corporate Event</option>
                <option>Private Party</option>
                <option>Speaking Engagement</option>
                <option>Virtual Event</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        <div className="pt-6 border-t border-gray-800">
          <h3 className="text-xl font-serif text-[#D4AF37] mb-4">Equipment Add-ons</h3>
          <div className="space-y-4">
            <label className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-[#D4AF37] transition cursor-pointer">
              <input type="checkbox" name="addMics" checked={formData.addMics} onChange={handleInputChange} className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37]" />
              <span className="ml-4 flex-grow text-white">Cordless Microphones</span>
              <span className="text-lg font-bold text-[#D4AF37]">+${MIC_FEE}</span>
            </label>
            <label className="flex items-center p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-[#D4AF37] transition cursor-pointer">
              <input type="checkbox" name="addLights" checked={formData.addLights} onChange={handleInputChange} className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37]" />
              <span className="ml-4 flex-grow text-white">DJ Lights</span>
              <span className="text-lg font-bold text-[#D4AF37]">+${LIGHTS_FEE}</span>
            </label>
          </div>
        </div>
      </div>
      <QuoteSummary />
    </form>
  );

  const QuoteSummary = () => (
    <div className="lg:sticky lg:top-8 h-fit bg-[#111] p-8 rounded-lg border border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/10">
      <h2 className="text-2xl font-serif text-[#D4AF37] border-b border-gray-700 pb-3 mb-6">Instant Quote</h2>
      <div className="space-y-3 text-gray-300">
        <div className="flex justify-between"><span>Base Fee ({quote.duration.toFixed(1)} hrs)</span><span>${quote.baseFee.toFixed(2)}</span></div>
        {formData.addMics && <div className="flex justify-between"><span>Microphones</span><span>${quote.micFee.toFixed(2)}</span></div>}
        {formData.addLights && <div className="flex justify-between"><span>DJ Lights</span><span>${quote.lightsFee.toFixed(2)}</span></div>}
        <div className="flex justify-between"><span>Est. Transportation</span><span>${quote.transportationFee.toFixed(2)}</span></div>
      </div>
      <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-700 space-y-4">
        <div className="flex justify-between items-center text-xl font-bold text-white">
          <span>Total</span>
          <span>${quote.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg text-[#D4AF37]">
          <span>50% Deposit</span>
          <span>${quote.deposit.toFixed(2)}</span>
        </div>
      </div>
      <button type="submit" disabled={isLoading} className="mt-8 w-full bg-[#D4AF37] text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? <><Loader className="animate-spin mr-2" /> Generating...</> : <><ShieldCheck className="mr-2" /> Generate Agreement</>}
      </button>
      {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
    </div>
  );
  
  const GeneratedContract = () => (
    <div className="bg-[#111] p-8 rounded-lg border border-gray-800 max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-center text-[#D4AF37] mb-6">Service Agreement</h2>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-h-[50vh] overflow-y-auto">
            <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed font-sans">{contractText}</pre>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setStep(1)} className="w-full sm:w-auto border border-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                Back to Edit
            </button>
            <button onClick={() => setStep(3)} className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center">
                <FileText className="mr-2"/> Accept & Book Now
            </button>
        </div>
    </div>
  );

  const Confirmation = () => {
    const paypalUrl = `https://paypal.me/${formData.paypalEmail}/${quote.deposit.toFixed(2)}`;

    return (
        <div className="bg-[#111] p-12 rounded-lg border border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/10 text-center max-w-2xl mx-auto">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6"/>
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">Booking Confirmed!</h2>
          <p className="text-gray-300 mb-2">
            Thank you, {formData.clientName}! Your event is secured pending deposit. A copy of your service agreement has been sent to <strong>{formData.email}</strong>.
          </p>
          <p className="text-gray-300 mb-8">
            To finalize your booking, please pay the <strong>${quote.deposit.toFixed(2)}</strong> deposit.
          </p>
          
          {formData.paypalEmail ? (
            <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full max-w-xs bg-[#D4AF37] text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-400 transition-colors text-lg">
              Pay Deposit with PayPal
            </a>
          ) : (
             <p className="text-yellow-400 bg-yellow-900/50 p-3 rounded-lg">
                Payment instructions for the deposit will be sent to your email.
             </p>
          )}

          <button onClick={() => { setStep(1); setFormData({
                clientName: '', email: '', phone: '', eventType: 'Birthday Party', guestCount: 50,
                eventDate: '', startTime: '19:00', endTime: '23:00', address: '',
                addMics: false, addLights: false, paypalEmail: formData.paypalEmail // Keep paypal email for next booking
          })}} className="mt-8 text-gray-400 underline hover:text-[#D4AF37] transition-colors">
            Book Another Event
          </button>
        </div>
    );
  };
  
  if (step === 1) return <BookingForm />;
  if (step === 2) return <GeneratedContract />;
  if (step === 3) return <Confirmation />;
  return null;
}

// --- PLAYLIST GENERATOR PAGE COMPONENT ---
const PlaylistGeneratorPage = () => {
    const [promptData, setPromptData] = useState<PlaylistPromptData>({
        vibe: 'Upbeat party music',
        genre: 'Pop, Hip Hop',
        keySong: '',
        era: '2010s',
        count: 20
    });
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPromptData(prev => ({ ...prev, [name]: name === 'count' ? parseInt(value) : value }));
    };

    const handleGeneratePlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPlaylist([]);
        try {
            const result = await geminiService.generatePlaylist(promptData);
            setPlaylist(result);
        } catch (err) {
            setError('Failed to generate playlist. The AI might be busy. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        const playlistText = playlist.map((song, index) => `${index + 1}. ${song.title} - ${song.artist}`).join('\n');
        navigator.clipboard.writeText(playlistText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#111] p-8 rounded-lg border border-gray-800 h-fit lg:sticky lg:top-8">
                <h2 className="text-2xl font-serif text-[#D4AF37] border-b border-gray-700 pb-3 mb-6">Create Your Vibe</h2>
                <form onSubmit={handleGeneratePlaylist} className="space-y-6">
                    <div>
                        <label htmlFor="vibe" className="text-sm font-medium text-gray-300 flex items-center mb-1"><PartyPopper className="h-5 w-5 mr-2 text-gray-500"/>Describe the Vibe</label>
                        <textarea id="vibe" name="vibe" value={promptData.vibe} onChange={handleInputChange} rows={3} placeholder="e.g., 90s hip-hop party, chill dinner background music, high-energy workout mix" required className="w-full bg-gray-900 border border-gray-700 text-white rounded-md py-2 px-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"></textarea>
                    </div>
                    <FormInput icon={Music} label="Genre(s)" name="genre" value={promptData.genre} onChange={handleInputChange} type="text" placeholder="e.g., Pop, Rock, EDM" required/>
                    <FormInput icon={DiscAlbum} label="Key Song (Optional)" name="keySong" value={promptData.keySong} onChange={handleInputChange} type="text" placeholder="e.g., 'Uptown Funk' by Bruno Mars"/>
                    <FormInput icon={History} label="Era / Year (Optional)" name="era" value={promptData.era} onChange={handleInputChange} type="text" placeholder="e.g., 1980s, 2000-2010"/>
                    <div>
                        <label htmlFor="count" className="text-sm font-medium text-gray-300">Number of Songs</label>
                         <input id="count" name="count" type="range" min="10" max="50" step="5" value={promptData.count} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37] mt-2"/>
                         <div className="text-center text-gray-400 text-sm mt-1">{promptData.count} Songs</div>
                    </div>
                    <button type="submit" disabled={isLoading} className="mt-4 w-full bg-[#D4AF37] text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? <><Loader className="animate-spin mr-2" /> Generating...</> : <><Wand2 className="mr-2" /> Generate Playlist</>}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
                </form>
            </div>
            <div className="lg:col-span-2 bg-[#111] p-8 rounded-lg border border-gray-800">
                 <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-6">
                    <h2 className="text-2xl font-serif text-[#D4AF37]">Your Custom Vibe</h2>
                    {playlist.length > 0 && (
                        <button onClick={handleCopyToClipboard} className="bg-gray-800 text-gray-300 text-sm font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                           <ClipboardCopy className="mr-2 h-4 w-4"/> {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Loader className="w-12 h-12 animate-spin text-[#D4AF37] mb-4"/>
                            <p>Curating your perfect vibe...</p>
                        </div>
                    )}
                    {!isLoading && playlist.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center">
                            <Music className="w-16 h-16 mb-4"/>
                            <p className="font-semibold">Your generated vibe will appear here.</p>
                            <p className="text-sm">Fill out the form to get started!</p>
                        </div>
                    )}
                     {!isLoading && error && (
                        <div className="flex flex-col items-center justify-center h-64 text-red-400 text-center">
                            <p>{error}</p>
                        </div>
                    )}
                    {playlist.length > 0 && (
                        <ol className="list-decimal list-inside space-y-3 text-gray-300">
                           {playlist.map((song, index) => (
                               <li key={index} className="p-3 bg-gray-900/50 rounded-md border-l-4 border-transparent hover:border-[#D4AF37] transition-colors">
                                   <span className="font-semibold text-white">{song.title}</span>
                                   <span className="text-sm text-gray-400 block">{song.artist}</span>
                               </li>
                           ))}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- HOME PAGE COMPONENT ---
const HomePage = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => (
    <>
        <div className="bg-[#111] p-8 sm:p-12 rounded-lg border border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/10 text-center max-w-4xl mx-auto">
            <Crown className="w-20 h-20 text-[#D4AF37] mx-auto mb-6"/>
            <h2 className="text-4xl sm:text-5xl font-serif text-white mb-4">
                Welcome to the <span className="text-[#D4AF37]">Movement</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
               “Royal Events Worldwide unites entertainment, education, and empowerment — creating spaces where sound, spirit, and success meet. We uplift artists, speakers, and dreamers to live in divine abundance while building wealth and wellness worldwide.”
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => setCurrentPage('booking')} className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center text-lg">
                    <Briefcase className="mr-2 h-5 w-5"/> Book Talent
                </button>
                <button onClick={() => setCurrentPage('academy')} className="w-full sm:w-auto border border-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-lg">
                    <GraduationCap className="mr-2 h-5 w-5"/> Enter The Academy
                </button>
            </div>
        </div>
        <div className="max-w-3xl mx-auto mt-12 text-center">
             <blockquote className="relative p-8 border border-gray-800 rounded-lg bg-[#111]">
                <div className="absolute top-0 left-0 -translate-x-3 -translate-y-3 text-6xl font-serif text-[#D4AF37]/30">“</div>
                 <p className="text-gray-300 italic">“If an AI artist can make millions by blending creativity + tech, imagine what we can build together via entertainment, education & empowerment.”</p>
                 <footer className="mt-4 text-sm text-gray-500">
                    We’re at the edge of the next era. Royal Events Worldwide is built for the future of experience and income.
                 </footer>
                 <div className="absolute bottom-0 right-0 translate-x-3 translate-y-3 text-6xl font-serif text-[#D4AF37]/30">”</div>
             </blockquote>
        </div>
    </>
);

// --- ROYAL ACADEMY PAGE COMPONENT ---
const RoyalAcademyPage = () => (
     <div className="bg-[#111] p-12 rounded-lg border border-gray-800 text-center max-w-2xl mx-auto">
        <GraduationCap className="w-20 h-20 text-[#D4AF37] mx-auto mb-6"/>
        <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">The Royal Academy</h2>
        <p className="text-gray-300 mb-2">
            A new space for courses, webinars, and motivational content to help you build your empire in wealth and wellness.
        </p>
        <p className="text-4xl font-serif text-white mt-8">
            Coming Soon...
        </p>
    </div>
);

// --- JOIN THE CIRCLE COMPONENT ---
const JoinRoyalCircle = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setIsLoading(true);
        setMessage("");

        if (!supabase) {
            setMessage("Error: Database connection is not configured.");
            setIsLoading(false);
            setTimeout(() => setMessage(""), 5000);
            return;
        }

        const { error } = await supabase.from("leads").insert([{ email, phone: phone || null }]);

        if (error) {
            setMessage("Something went wrong. Please try again.");
            console.error("Supabase error:", error);
        } else {
            setMessage("Welcome to the Royal Circle! 💎");
            setEmail("");
            setPhone("");
        }

        setIsLoading(false);
        setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
    }

    return (
        <div className="py-12 bg-black">
             <div className="max-w-2xl mx-auto text-center p-8 bg-[#111] rounded-lg border border-[#D4AF3T]/20">
                <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4"/>
                <h2 className="text-3xl font-serif text-white mb-2">Join the <span className="text-[#D4AF37]">Royal Circle</span></h2>
                <p className="text-gray-400 mb-6">Get exclusive alerts, VIP event access, & new drops from Royal Events Worldwide.</p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
                    <input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full sm:w-auto flex-grow bg-gray-900 border border-gray-700 text-white rounded-md py-3 px-4 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
                        aria-label="Email Address"
                    />
                     <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full sm:w-auto bg-gray-900 border border-gray-700 text-white rounded-md py-3 px-4 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition"
                        aria-label="Phone Number"
                    />
                    <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold py-3 px-5 rounded-lg hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <Loader className="animate-spin h-5 w-5"/> : <Send className="h-5 w-5"/>}
                    </button>
                </form>
                 {message && <p className={`mt-4 text-sm ${message.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
            </div>
        </div>
    );
}


// --- MAIN APP COMPONENT (Router) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'booking', 'playlist', 'academy'

  const Header = () => (
    <header className="py-6 border-b-2 border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center justify-center text-center mb-4 sm:mb-0">
                <Crown className="w-12 h-12 text-[#D4AF37] mr-4" />
                <div>
                    <h1 className="font-serif text-4xl font-bold text-white tracking-wider">
                        Royal Events <span className="text-[#D4AF37]">Worldwide</span>
                    </h1>
                    <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
                        Empowering Minds, Elevating Events
                    </p>
                </div>
            </div>
             <nav className="flex space-x-1 sm:space-x-2 border border-gray-700 rounded-lg p-1 bg-[#111]">
                <button onClick={() => setCurrentPage('home')} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${currentPage === 'home' ? 'bg-[#D4AF37] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <Home className="h-4 w-4 sm:mr-2"/> <span className="hidden sm:inline">Home</span>
                </button>
                 <button onClick={() => setCurrentPage('booking')} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${currentPage === 'booking' ? 'bg-[#D4AF37] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <Briefcase className="h-4 w-4 sm:mr-2"/> <span className="hidden sm:inline">Book Talent</span>
                </button>
                <button onClick={() => setCurrentPage('playlist')} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${currentPage === 'playlist' ? 'bg-[#D4AF37] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <Sparkles className="h-4 w-4 sm:mr-2"/> <span className="hidden sm:inline">Vibe Creator</span>
                </button>
                 <button onClick={() => setCurrentPage('academy')} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${currentPage === 'academy' ? 'bg-[#D4AF37] text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
                    <GraduationCap className="h-4 w-4 sm:mr-2"/> <span className="hidden sm:inline">Academy</span>
                </button>
            </nav>
        </div>
    </header>
  );

  const renderPage = () => {
    switch(currentPage) {
        case 'home':
            return <HomePage setCurrentPage={setCurrentPage} />;
        case 'booking':
            return <BookingPage />;
        case 'playlist':
            return <PlaylistGeneratorPage />;
        case 'academy':
            return <RoyalAcademyPage />;
        default:
            return <HomePage setCurrentPage={setCurrentPage} />;
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {renderPage()}
        </main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <JoinRoyalCircle />
        </div>
        <footer className="text-center py-6 border-t border-gray-800/50 mt-12">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Royal Events Worldwide. All Rights Reserved.</p>
        </footer>
    </div>
  );
}
