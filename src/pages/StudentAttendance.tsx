import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../lib/supabase';
import { Student, StudentAttendance } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Save,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance['status']>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [classes, setClasses] = useState<string[]>([]);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Extract unique classes
      const uniqueClasses = Array.from(new Set(studentsData?.map(s => s.class) || []));
      setClasses(['Semua', ...uniqueClasses]);

      // Fetch existing attendance for today
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_students')
        .select('*')
        .eq('date', today);

      if (attendanceError) throw attendanceError;
      
      const attendanceMap: Record<string, StudentAttendance['status']> = {};
      attendanceData?.forEach(a => {
        attendanceMap[a.student_id] = a.status;
      });
      setAttendance(attendanceMap);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (studentId: string, status: StudentAttendance['status']) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        teacher_id: user.id,
        date: today,
        status,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('attendance_students')
        .upsert(attendanceRecords, { onConflict: 'student_id,date' });

      if (error) throw error;
      alert('Absensi siswa berhasil disimpan!');
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Gagal menyimpan absensi');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
    const matchesClass = selectedClass === 'Semua' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const statusOptions: { status: StudentAttendance['status']; label: string; color: string; bgColor: string }[] = [
    { status: 'hadir', label: 'H', color: 'text-green-600', bgColor: 'bg-green-100' },
    { status: 'izin', label: 'I', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { status: 'sakit', label: 'S', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { status: 'alpa', label: 'A', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Absensi Siswa</h1>
          <p className="text-slate-500 mt-1">Input kehadiran siswa untuk tanggal {format(new Date(), 'd MMMM yyyy', { locale: id })}.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={submitting || Object.keys(attendance).length === 0}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save size={20} />
          )}
          <span>Simpan Absensi</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama siswa atau NISN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all appearance-none"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">NISN</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{student.nisn}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.status}
                            onClick={() => handleStatusChange(student.id, option.status)}
                            className={cn(
                              "w-10 h-10 rounded-xl font-bold transition-all flex items-center justify-center border-2",
                              attendance[student.id] === option.status
                                ? cn(option.bgColor, option.color, "border-transparent scale-110 shadow-sm")
                                : "border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                            title={option.status}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={48} className="text-slate-200" />
                      <p>Tidak ada data siswa ditemukan.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
