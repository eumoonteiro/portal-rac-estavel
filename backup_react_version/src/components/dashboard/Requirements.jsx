import React, { useState } from 'react';
import { 
  FileText, MessageSquare, CheckCircle, XCircle, 
  Clock, ArrowRight, Send, AlertCircle, FileUp
} from 'lucide-react';
import { sendGeneralNotification } from '../../services/email';

const Requirements = ({ coordinator = false }) => {
    const [activeReq, setActiveReq] = useState(null);
    const [requirements, setRequirements] = useState([
        { id: 'REQ-001', student: 'João Silva', type: 'Declaração de Matrícula', status: 'Pendente', date: '15/05/2026', message: 'Gostaria de solicitar uma declaração para o estágio.', responses: [] },
        { id: 'REQ-002', student: 'Maria Souza', type: 'Trancamento de Disciplina', status: 'Deferido', date: '10/05/2026', message: 'Preciso trancar a disciplina de Ética.', responses: [{ role: 'coord', content: 'Sua solicitação foi aceita.', date: '11/05/2026' }] },
    ]);
    const [newReply, setNewReply] = useState('');

    const updateStatus = async (id, status) => {
        setRequirements(prev => prev.map(req => req.id === id ? { ...req, status } : req));
        
        // Notify Student via EmailJS
        try {
            // Mock email call
            // await sendGeneralNotification(studentName, studentEmail, `Seu requerimento ${id} foi atualizado para: ${status}`, "Atualização de Requerimento");
            alert(`O status do requerimento ${id} foi alterado para: ${status}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = (id) => {
        if (!newReply) return;
        setRequirements(prev => prev.map(req => {
            if (req.id === id) {
                return {
                    ...req,
                    responses: [...req.responses, { role: coordinator ? 'coord' : 'student', content: newReply, date: new Date().toLocaleDateString() }]
                };
            }
            return req;
        }));
        setNewReply('');
        
        // Notify other party via EmailJS
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* List side */}
            <div className={`flex-1 space-y-4 ${activeReq && 'hidden lg:block'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Requerimentos</h2>
                    {!coordinator && (
                        <button className="btn-primary py-2 px-6 flex items-center gap-2">
                            <PlusCircle size={18} /> Novo Requerimento
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {requirements.map(req => (
                        <div 
                            key={req.id}
                            onClick={() => setActiveReq(req)}
                            className={`p-6 rounded-[2rem] border transition-all cursor-pointer hover:shadow-lg ${
                                activeReq?.id === req.id ? 'bg-white border-purple-500 shadow-purple-50' : 'bg-white border-slate-100 hover:border-purple-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{req.id}</span>
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${
                                    req.status === 'Pendente' ? 'bg-amber-50 text-amber-600' :
                                    req.status === 'Deferido' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {req.status}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{req.type}</h4>
                            <p className="text-xs text-slate-500 font-semibold mb-3">{coordinator ? `ALUNO: ${req.student}` : `SOLICITADO EM: ${req.date}`}</p>
                            <div className="flex items-center gap-1 text-purple-600 font-bold text-[10px] uppercase">
                                Ver Detalhes <ArrowRight size={12} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat/Detail side */}
            <div className={`flex-[1.5] bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col min-h-[500px] overflow-hidden ${!activeReq && 'hidden lg:flex items-center justify-center'}`}>
                {activeReq ? (
                    <>
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <button onClick={() => setActiveReq(null)} className="lg:hidden p-2 text-slate-400"><ArrowRight className="rotate-180" size={20} /></button>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{activeReq.type}</h3>
                                    <p className="text-xs text-slate-400 font-semibold">ALUNO: {activeReq.student} • STATUS: <span className={activeReq.status === 'Pendente' ? 'text-amber-500' : 'text-green-500'}>{activeReq.status}</span></p>
                                </div>
                             </div>
                             {coordinator && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateStatus(activeReq.id, 'Deferido')}
                                        className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-colors" title="Deferir">
                                        <CheckCircle size={20} />
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(activeReq.id, 'Indeferido')}
                                        className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors" title="Indeferir">
                                        <XCircle size={20} />
                                    </button>
                                </div>
                             )}
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto space-y-6">
                            {/* Initial message */}
                            <div className="flex flex-col items-start max-w-[80%]">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm font-medium text-slate-800">{activeReq.message}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{activeReq.date}</span>
                            </div>

                            {/* Responses */}
                            {activeReq.responses.map((resp, i) => (
                                <div key={i} className={`flex flex-col ${resp.role === 'coord' ? 'items-end ml-auto' : 'items-start'} max-w-[80%]`}>
                                    <div className={`p-4 rounded-2xl border ${resp.role === 'coord' ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-50 text-slate-800 border-slate-100'}`}>
                                        <p className="text-sm font-medium">{resp.content}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{resp.role === 'coord' ? 'COORDENAÇÃO' : 'ALUNO'} • {resp.date}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                            <div className="relative">
                                <textarea 
                                    placeholder="Escreva sua resposta..."
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm h-24 resize-none shadow-sm"
                                />
                                <button 
                                    onClick={() => handleReply(activeReq.id)}
                                    className="absolute bottom-4 right-4 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12">
                         <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <MessageSquare size={40} />
                         </div>
                         <h4 className="font-bold text-slate-800 mb-2">Selecione um Requerimento</h4>
                         <p className="text-slate-400 text-sm font-medium">Clique em um requerimento lateral para ver o status e responder.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlusCircle = ({ size, className }) => <FileUp size={size} className={className} />;

export default Requirements;
