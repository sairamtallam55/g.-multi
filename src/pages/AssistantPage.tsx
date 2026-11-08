import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
  Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ChatMessage, Language } from '../types';

export const AssistantPage: React.FC = () => {
  const { lang, setLang, t } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('godavari_sahaaya_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content:
          lang === 'te'
            ? 'నమస్కారం! నేను గోదావరి సహాయ AI అసిస్టెంట్. పుష్కరాలు 2027 కొరకు స్నాన ఘాట్లు, వైద్య శిబిరాలు, మంచినీటి పాయింట్లు, పార్కింగ్ మరియు భద్రతా సూచనల గురించి ఏమైనా అడగండి.'
            : lang === 'hi'
            ? 'नमस्ते! मैं गोदावरी सहाय एआई सहायक हूँ। पुष्करालु 2027 के लिए स्नान घाट, चिकित्सा शिविर, पेयजल, पार्किंग और सुरक्षा दिशानिर्देशों के बारे में आप कुछ भी पूछ सकते हैं।'
            : 'Namaste! I am GODAVARI SAHAAYA AI Assistant. Feel free to ask about bathing ghats, medical camps, drinking water points, parking zones, and pilgrim safety guidelines for Godavari Pushkaralu 2027.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: lang,
        sourceReference: 'Platform Welcome Guide',
        verificationStatus: 'DEMO'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages
  useEffect(() => {
    localStorage.setItem('godavari_sahaaya_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Check speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleTextToSpeech = (text: string, msgLang: Language) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = msgLang === 'te' ? 'te-IN' : msgLang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: lang
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: lang,
          history: messages.slice(-4)
        })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: data.language || lang,
          sourceReference: data.sourceReference,
          verificationStatus: data.verificationStatus,
          isFallback: data.isFallback
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'Failed to receive response');
      }
    } catch {
      // Local recovery
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content:
          lang === 'te'
            ? 'క్షమించండి, సర్వర్ స్పందించడంలో తాత్కాలిక సమస్య ఉంది. దయచేసి అత్యవసర పరిస్థితుల్లో జాతీయ హెల్ప్‌లైన్ 112 కు కాల్ చేయండి.'
            : lang === 'hi'
            ? 'क्षमा करें, सर्वर से संपर्क करने में समस्या हुई। कृपया आपात स्थिति में 112 पर कॉल करें।'
            : 'Sorry, could not connect to AI service. In case of immediate safety concern, dial National Helpline 112 or Ambulance 108.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: lang,
        sourceReference: 'Emergency Helpline Protocol',
        verificationStatus: 'VERIFIED',
        isFallback: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      const fresh: ChatMessage[] = [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content:
            lang === 'te'
              ? 'సంభాషణ క్లియర్ చేయబడింది. మీరు గోదావరి పుష్కరాలు 2027 గురించి నన్ను ఏమి అడగాలనుకుంటున్నారు?'
              : lang === 'hi'
              ? 'वार्तालाप मिटा दिया गया है। आप गोदावरी पुष्करालु 2027 के बारे में क्या जानना चाहते हैं?'
              : 'Conversation cleared. How can I assist your Godavari Pushkaralu pilgrimage today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: lang,
          sourceReference: 'System Prompt',
          verificationStatus: 'DEMO'
        }
      ];
      setMessages(fresh);
    }
  };

  const suggestedQuestions: Record<Language, string[]> = {
    en: [
      'Where can I find drinking water near Pushkar Ghat?',
      'Where is the nearest 24/7 medical emergency camp?',
      'What are the vital river safety instructions?',
      'How to travel by bus from the railway station?',
      'Where can I park my car or bus?',
      'What should I do if a family member gets separated?'
    ],
    te: [
      'పుష్కర్ ఘాట్ వద్ద మంచినీరు ఎక్కడ లభిస్తుంది?',
      'సమీప అత్యవసర వైద్య శిబిరం ఎక్కడ ఉంది?',
      'నదిలో స్నానం చేసేటప్పుడు తీసుకోవాల్సిన జాగ్రత్తలు ఏమిటి?',
      'రైల్వే స్టేషన్ నుండి ఘాట్లకు బస్సులు ఎలా ఉన్నాయి?',
      'వాహనాలను ఎక్కడ పార్క్ చేయాలి?',
      'రద్దీలో కుటుంబ సభ్యులు తప్పిపోతే ఏమి చేయాలి?'
    ],
    hi: [
      'पुष्कर घाट के पास पीने का पानी कहाँ मिलेगा?',
      'निकटतम 24/7 चिकित्सा शिविर कहाँ स्थित है?',
      'नदी में स्नान करते समय क्या सावधानियां रखनी चाहिए?',
      'रेलवे स्टेशन से घाटों के लिए बस सेवा कैसी है?',
      'अपनी गाड़ी कहाँ पार्क कर सकते हैं?',
      'यदि भीड़ में परिवार का कोई सदस्य बिछड़ जाए तो क्या करें?'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 flex flex-col h-[calc(100vh-120px)] min-h-[500px]">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs mb-3 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900">
                {t('aiTitle')}
              </h1>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                Gemini + Local KB
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t('aiSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
            <button
              onClick={() => setLang('te')}
              className={`px-1.5 py-1 rounded ${lang === 'te' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'}`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-1 rounded ${lang === 'en' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-1.5 py-1 rounded ${lang === 'hi' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'}`}
            >
              हिन्दी
            </button>
          </div>

          {/* Clear button */}
          <button
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            title={t('aiClear')}
            aria-label={t('aiClear')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested question chips */}
      <div className="mb-2 shrink-0 overflow-x-auto pb-1 flex gap-2 no-scrollbar">
        {suggestedQuestions[lang].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] whitespace-nowrap bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/80 px-2.5 py-1 rounded-full font-medium transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto bg-slate-100/60 rounded-2xl border border-slate-200/80 p-3 sm:p-4 space-y-3.5 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#0a2540] text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line font-medium">{msg.content}</div>

                {/* Assistant footer with Source & Audio */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {msg.sourceReference && (
                        <span className="inline-flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          <Info className="w-3 h-3 text-slate-400" />
                          <span>{msg.sourceReference}</span>
                        </span>
                      )}
                      {msg.verificationStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>VERIFIED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>DEMO DATA — NOT OFFICIAL</span>
                        </span>
                      )}
                      {msg.isFallback && (
                        <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-medium">
                          Offline / Deterministic
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => handleTextToSpeech(msg.content, msg.language)}
                        className="p-1 hover:text-teal-600 rounded"
                        title={t('aiListen')}
                        aria-label={t('aiListen')}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  </div>
                )}

                {isUser && (
                  <div className="text-right text-[9px] text-teal-200/70 mt-1">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-slate-500">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-teal-800 font-medium">Consulting Pushkaralu 2027 Knowledge Base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-xl transition-all ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-slate-500 hover:text-teal-600 hover:bg-slate-100'
          }`}
          title={isRecording ? 'Listening...' : t('aiSpeak')}
          aria-label={t('aiSpeak')}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('aiInputPlaceholder')}
          className="flex-1 py-2 text-xs sm:text-sm outline-none bg-transparent placeholder-slate-400 font-medium"
          disabled={loading}
          aria-label="Ask AI Assistant"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center"
          aria-label={t('aiSend')}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
