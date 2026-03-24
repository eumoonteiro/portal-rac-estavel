import React, { useState } from 'react';
import { 
  Users, CheckCircle, Save, ArrowLeft, 
  BarChart3, User, Search, Filter 
} from 'lucide-react';
import { sendGradeNotification } from '../../services/email';

const ProfessorClassRoom = ({ subject, onBack }) => {
    const [students, setStudents] = useState([
        { id: 1, name: 'João Silva', grade: 8.5, attendance: true },
        { id: 2, name: 'Maria Souza', grade: 9.0, attendance: true },
        { id: 3, name: 'Pedro Oliver', grade: 7.5, attendance: false },
    ]);
    const [saving, setSaving] = useState(false);

    const handleGradeChange = (id, value) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, grade: parseFloat(value) } : s));
    };

    const handleAttendanceChange = (id) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, attendance: !s.attendance } : s));
    };

    const saveGrades = async () => {
        setSaving(true);
        try {
            // Mock Saving loop
            for (const student of students) {
                // If grade was updated, send notification
                // await sendGradeNotification(student.name, student.email, subject, student.grade);
            }
            alert("Notas e frequências salvas com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-purple-600 transition-all shadow-sm">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{subject}</h2>
                    <p className="text-slate-500 text-sm">Registro de Notas e Frequência • 2024.1</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-100">Lançar Notas</button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Realizar Chamada</button>
                    </div>
                    <button 
                        onClick={saveGrades}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 py-2 px-6 disabled:opacity-50"
                    >
                        {saving ? "Salvando..." : <>
                           <Save size={18} /> Salvar Tudo
                        </>}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider border-b border-slate-50">
                                <th className="px-8 py-6">Aluno</th>
                                <th className="px-8 py-6 text-center">Frequência (Hoje)</th>
                                <th className="px-8 py-6 text-center">Nota Final</th>
                                <th className="px-8 py-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                                                 {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleAttendanceChange(student.id)}
                                                className={`w-12 h-6 rounded-full relative transition-all ${student.attendance ? 'bg-green-500' : 'bg-slate-200'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${student.attendance ? 'right-1' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <input 
                                                type="number" 
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                value={student.grade}
                                                onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                className="w-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${student.grade >= 7 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {student.grade >= 7 ? 'Aprovado' : 'Abaixo da Média'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProfessorClassRoom;
