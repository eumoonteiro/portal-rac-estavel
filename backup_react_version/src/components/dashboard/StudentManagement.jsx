import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Edit2, FileUp, 
  Trash2, Filter, MoreVertical, CheckCircle, Clock 
} from 'lucide-react';
import { db, storage } from '../../services/firebase';
import { collection, query, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendGeneralNotification } from '../../services/email';

const StudentManagement = () => {
    const [students, setStudents] = useState([
        { id: 1, name: 'João Silva', cpf: '123.456.789-00', course: 'Psicanálise Clínica', status: 'Ativo', documents: [] },
        { id: 2, name: 'Maria Souza', cpf: '321.654.987-11', course: 'Psicogerontologia', status: 'Ativo', documents: [] },
    ]);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (studentId, file, type) => {
        if (!file) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `documents/${studentId}/${type}_${Date.now()}.pdf`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            
            // In a real app, update Firestore student record with this URL
            console.log(`File uploaded for student ${studentId}: ${url}`);
            alert(`Arquivo "${type}" enviado com sucesso!`);
            
            // Notify student via EmailJS (if email exists)
            // await sendGeneralNotification(studentName, studentEmail, "Uma nova declaração está disponível para download", "Novo Documento");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Erro ao enviar arquivo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Gestão de Alunos</h2>
                    <p className="text-slate-500 text-sm">Gerencie perfis, matricule alunos e envie documentos</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all text-sm">
                        <Filter size={18} /> Filtrar
                    </button>
                    <button className="btn-primary flex items-center gap-2 py-2 px-6">
                        <UserPlus size={18} /> Novo Aluno
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou CPF..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-extrabold tracking-wider">
                                <th className="px-6 py-4">Estudante</th>
                                <th className="px-6 py-4">Curso</th>
                                <th className="px-6 py-4">CPF</th>
                                <th className="px-6 py-4 text-center">Ações Rápidas</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{student.name}</p>
                                                <span className="text-[10px] text-green-500 font-bold uppercase">{student.status}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">{student.course}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{student.cpf}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <label className="cursor-pointer p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all title='Subir Declaração'">
                                                <FileUp size={18} />
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={(e) => handleFileUpload(student.id, e.target.files[0], 'declaração')}
                                                />
                                            </label>
                                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title='Editar Perfil'>
                                                <Edit2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Support section */}
            <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                    <Clock size={24} />
                 </div>
                 <div>
                    <h4 className="font-bold text-purple-900">Documentos em Lote</h4>
                    <p className="text-purple-700 text-sm font-medium">Você pode subir arquivos PDF para múltiplos alunos ao mesmo tempo usando o botão de importação no menu.</p>
                 </div>
            </div>
        </div>
    );
};

export default StudentManagement;
