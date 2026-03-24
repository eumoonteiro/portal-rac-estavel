import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, LayoutDashboard, Database, Users, GraduationCap, 
  BookOpen, FileText, Send, Bell, Settings, LogOut,
  PlusCircle, ClipboardList, BarChart3, Mail, HelpCircle,
  Download, ExternalLink, Calendar, Trash2, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentManagement from '../components/dashboard/StudentManagement';
import Requirements from '../components/dashboard/Requirements';
import ProfessorClassRoom from '../components/dashboard/ProfessorClassRoom';

const SidebarItem = ({ icon: Icon, label, active, onClick, alert }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600 font-semibold'
    }`}
  >
    <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="text-sm">{label}</span>
    </div>
    {alert && <div className="w-2 h-2 rounded-full bg-red-400"></div>}
  </button>
);

const Dashboard = () => {
    const { userData, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Specific CPF for Admin Admin 15632157725
    const isSpecialAdmin = userData?.cpf === '15632157725';

    const renderRoleContent = () => {
        const role = userData?.role || 'student';

        if (selectedSubject && role === 'professor') {
            return <ProfessorClassRoom subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
        }

        switch(role) {
            case 'coordinator':
                return <CoordinatorView tab={activeTab} isSpecialAdmin={isSpecialAdmin} />;
            case 'professor':
                return <ProfessorView tab={activeTab} onSelectSubject={setSelectedSubject} />;
            default:
                return <StudentView tab={activeTab} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <motion.aside 
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
                className="bg-white border-r border-slate-100 flex flex-col z-20 overflow-hidden"
            >
                <div className="p-6">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Portal <span className="text-purple-600">RAC</span></h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Conectando Educação</p>
                </div>

                <div className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSelectedSubject(null); }} />
                    
                    {userData?.role === 'coordinator' && (
                        <>
                            <SidebarItem icon={Users} label="Gestão de Alunos" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
                            <SidebarItem icon={Users} label="Gestão de Turmas" active={activeTab === 'classes'} onClick={() => setActiveTab('classes')} />
                            <SidebarItem icon={FileText} label="Requerimentos" active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} alert />
                            <SidebarItem icon={Send} label="Comunicados" active={activeTab === 'announce'} onClick={() => setActiveTab('announce')} />
                        </>
                    )}

                    {userData?.role === 'student' && (
                        <>
                            <SidebarItem icon={BarChart3} label="Desempenho" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
                            <SidebarItem icon={Download} label="Meus Documentos" active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} />
                            <SidebarItem icon={FileText} label="Requerimentos" active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} />
                            <SidebarItem icon={Bell} label="Comunicados" active={activeTab === 'announce'} onClick={() => setActiveTab('announce')} />
                        </>
                    )}

                    {userData?.role === 'professor' && (
                        <>
                            <SidebarItem icon={ClipboardList} label="Diário de Classe" active={activeTab === 'diary'} onClick={() => setActiveTab('diary')} />
                            <SidebarItem icon={HelpCircle} label="Ajuda" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {userData?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-slate-800 text-sm truncate">{userData?.name || 'Carregando...'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{userData?.role || 'Acesso'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-semibold text-sm transition-all"
                    >
                        <LogOut size={20} />
                        Sair do Portal
                    </button>
                </div>
            </motion.aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h3 className="font-bold text-slate-800 text-lg capitalize">{activeTab.replace('_', ' ')}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                         <button className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all relative">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                         </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            {renderRoleContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

/* --- Coordinator Inner Views --- */
const CoordinatorView = ({ tab, isSpecialAdmin }) => (
    <div className="space-y-8">
        {tab === 'dashboard' && (
            <>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cursos Geridos</h2>
                        <p className="text-slate-500 mt-1">Bem-vindo à sua central de coordenação</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-3 bg-purple-100 text-purple-700 font-bold rounded-2xl flex items-center gap-2 hover:bg-purple-200 transition-all shadow-sm">
                            <Send size={18} /> Novo Comunicado
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Psicanálise Clínica', 'Psicogerontologia', 'Saúde Mental'].map((course, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group overflow-hidden">
                             <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen size={28} />
                             </div>
                             <h4 className="font-extrabold text-slate-800 text-lg mb-1">{course}</h4>
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Pós-Graduação</p>
                             <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span className="text-xs text-slate-500 font-bold">128 Alunos</span>
                                <button className="text-purple-600 text-xs font-bold flex items-center gap-1 hover:underline">Ver Gestão <ExternalLink size={14} /></button>
                             </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h4 className="text-xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                            <PlusCircle className="text-purple-600" size={24} /> Ações Rápidas
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['Novo Aluno', 'Novo Professor', 'Nova Disciplina'].map(action => (
                                <button key={action} className="p-6 bg-slate-50 rounded-3xl text-center hover:bg-purple-600 hover:text-white transition-all group">
                                    <div className="text-xs font-extrabold uppercase tracking-widest">{action}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <h4 className="text-xl font-extrabold text-slate-800 mb-8 w-full text-left flex items-center gap-3">
                            <Settings className="text-purple-600" size={24} /> APOIO & ADMIN
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <button className="flex items-center gap-4 p-5 border border-slate-100 rounded-3xl hover:border-purple-200 transition-all shadow-sm">
                                <ClipboardList className="text-purple-600" size={24} />
                                <span className="text-sm font-bold text-slate-700">Diário de Classe</span>
                            </button>
                            <button className="flex items-center gap-4 p-5 border border-slate-100 rounded-3xl hover:border-purple-200 transition-all shadow-sm">
                                <BarChart3 className="text-purple-600" size={24} />
                                <span className="text-sm font-bold text-slate-700">Frequência</span>
                            </button>
                            {isSpecialAdmin && (
                                <button className="col-span-full flex items-center justify-center gap-4 p-6 bg-purple-900 text-white rounded-[2rem] hover:bg-black transition-all shadow-xl shadow-purple-100">
                                    <Database size={24} />
                                    <span className="text-md font-bold uppercase tracking-widest">ADMIN: Gerenciar Ferramentas</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}
        {tab === 'students' && <StudentManagement />}
        {tab === 'requirements' && <Requirements coordinator />}
    </div>
);

/* --- Student Inner Views --- */
const StudentView = ({ tab }) => (
    <div className="space-y-8">
        {tab === 'dashboard' && (
            <>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meus Cursos</h2>
                        <p className="text-slate-500 mt-1">Central do Estudante RAC</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-purple-700 to-purple-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-3xl font-extrabold mb-3">Psicanálise Clínica</h3>
                            <p className="text-purple-100 text-lg font-medium opacity-80 mb-10">Turma Especial 2024.1 • Quinta-feira às 19:30</p>
                            <button className="px-10 py-4 bg-white text-purple-900 font-extrabold rounded-2xl text-sm hover:scale-105 transition-all shadow-lg active:scale-95">Ver Minhas Notas</button>
                        </div>
                        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 group-hover:scale-110 transition-all duration-700">
                             <GraduationCap size={350} />
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col">
                        <h4 className="font-extrabold text-slate-800 text-xl mb-8 flex items-center gap-3">
                             <Bell className="text-purple-600" size={24} /> Mural
                        </h4>
                        <div className="space-y-6 flex-1 overflow-y-auto">
                             {[1, 2].map(i => (
                                 <div key={i} className="p-6 bg-slate-50 border-l-4 border-purple-500 rounded-2xl">
                                     <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest">HOJE</span>
                                     <p className="text-sm font-bold text-slate-800 mt-2 leading-relaxed">Novo documento disponível para download na sua área restrita.</p>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </>
        )}
        {tab === 'performance' && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-extrabold text-slate-800 mb-10">Desempenho Acadêmico</h3>
                <div className="space-y-6">
                    {['História da Psicanálise', 'Teoria das Pulsões'].map((sub, i) => (
                        <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                            <div>
                                <h5 className="font-extrabold text-slate-800 text-lg">{sub}</h5>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Semestre 2024.1</p>
                            </div>
                            <div className="flex gap-12">
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mb-1">Média</p>
                                    <p className="text-2xl font-black text-purple-600">9.5</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mb-1">Faltas</p>
                                    <p className="text-2xl font-black text-slate-800">02</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {tab === 'docs' && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Meus Documentos</h3>
                <p className="text-slate-400 font-medium mb-10">Documentos emitidos pela secretaria e coordenação</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Declaração de Matrícula', 'Carteirinha de Estudante'].map((doc, i) => (
                        <div key={i} className="p-8 border-2 border-slate-50 rounded-[2.5rem] flex items-center justify-between group hover:border-purple-200 hover:bg-purple-50/20 transition-all cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <Download size={28} />
                                </div>
                                <div>
                                    <h5 className="font-extrabold text-slate-800">{doc}</h5>
                                    <p className="text-xs text-slate-400 font-bold uppercase">PDF • 2.4 MB</p>
                                </div>
                            </div>
                            <ExternalLink size={20} className="text-slate-300 group-hover:text-purple-600" />
                        </div>
                    ))}
                </div>
            </div>
        )}
        {tab === 'requirements' && <Requirements />}
    </div>
);

/* --- Professor Inner Views --- */
const ProfessorView = ({ tab, onSelectSubject }) => (
    <div className="space-y-8">
        {tab === 'dashboard' || tab === 'diary' ? (
            <>
                 <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Docência</h2>
                        <p className="text-slate-500 mt-1">Gerencie suas disciplinas e alunos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['Psicanálise II', 'Teoria da Clínica'].map((sub, i) => (
                        <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm group">
                            <h4 className="text-2xl font-extrabold text-slate-800 mb-2">{sub}</h4>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">Quinta-feira • 19:30 às 22:00</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => onSelectSubject(sub)}
                                    className="p-5 bg-purple-600 text-white rounded-[2rem] text-sm font-extrabold uppercase tracking-widest shadow-xl shadow-purple-100 hover:scale-105 active:scale-95 transition-all">
                                    Lançar Notas
                                </button>
                                <button className="p-5 bg-slate-50 text-slate-700 border border-slate-100 rounded-[2rem] text-sm font-extrabold uppercase tracking-widest hover:bg-slate-100 transition-all">
                                    Chamada
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : tab === 'help' ? (
            <div className="bg-blue-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-3xl font-extrabold mb-6">Central de Ajuda ao Professor</h3>
                    <p className="text-blue-100 text-xl font-medium leading-relaxed mb-10">Dúvidas sobre o diário de classe ou fechamento de notas? Nossa equipe de coordenação está disponível para auxiliar você em qualquer processo pedagógico ou sistêmico.</p>
                    <div className="flex gap-4">
                        <button className="px-10 py-5 bg-white text-blue-600 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-all">Contatar Coordenação</button>
                        <button className="px-10 py-5 bg-blue-700 text-white font-extrabold rounded-2xl hover:bg-blue-800 transition-all">Manual do Docente</button>
                    </div>
                </div>
                <HelpCircle size={300} className="absolute right-[-50px] top-[-50px] opacity-10" />
            </div>
        ) : null}
    </div>
);

export default Dashboard;
