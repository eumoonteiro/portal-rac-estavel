import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, BookOpen, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginWithCPF } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length !== 6 || !/^\d+$/.test(password)) {
            setError('A senha deve ser composta por 6 dígitos numéricos');
            setLoading(false);
            return;
        }

        try {
            await loginWithCPF(cpf, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('CPF ou senha inválidos. Verifique seus dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Portal da <span className="text-purple-600">RAC</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Acesse sua área restrita</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">CPF</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                                    <User size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Senha (6 dígitos)</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input 
                                    type="password" 
                                    maxLength={6}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 transform transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Entrar no Portal
                                    <LogIn size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
                        <button className="flex items-center justify-center gap-2 text-slate-500 hover:text-purple-600 transition-colors text-sm font-semibold group">
                            <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                            Acessar Manual do Usuário
                        </button>
                        
                        <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h4 className="text-[10px] font-extrabold text-purple-600 uppercase mb-2">Desenvolvimento</h4>
                            <p className="text-[10px] text-purple-800 mb-3 font-medium">Use os botões abaixo para criar usuários de teste no seu Firebase:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <SeedButton cpf="15632157725" pass="156321" name="Admin Master" role="coordinator" />
                                <SeedButton cpf="11111111111" pass="111111" name="Aluno Teste" role="student" />
                                <SeedButton cpf="22222222222" pass="222222" name="Prof. Cláudio" role="professor" />
                                <SeedButton cpf="33333333333" pass="333333" name="Coord. Geral" role="coordinator" />
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-10 text-slate-400 text-sm font-medium">
                    © {new Date().getFullYear()} RAC - Todos os direitos reservados.
                </p>
            </motion.div>
        </div>
    );
};

const SeedButton = ({ cpf, pass, name, role }) => {
    const { registerWithCPF } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        try {
            await registerWithCPF(cpf, pass, name, role);
            alert(`Usuário ${name} (${role}) criado com sucesso!\n\nCPF: ${cpf}\nSenha: ${pass}`);
        } catch (e) {
            console.error(e);
            alert("Erro ao criar (usuário já existe?)");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button 
            onClick={handleCreate}
            disabled={loading}
            className="px-3 py-2 bg-white text-[9px] font-extrabold text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50">
            {loading ? "Criando..." : `MOCK: ${role.toUpperCase()}`}
        </button>
    )
}

export default Login;
