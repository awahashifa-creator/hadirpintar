import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../lib/supabase';
import { TeacherAttendance } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle2, XCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function TeacherAttendancePage() {
  const { profile, user } = useAuth();
  const [attendance, setAttendance] = useState<TeacherAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchTodayAttendance();
  }, [user]);

  async function fetchTodayAttendance() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('attendance_teachers')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAttendance = async (status: TeacherAttendance['status']) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('attendance_teachers')
        .upsert({
          user_id: user.id,
          date: today,
          status,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      await fetchTodayAttendance();
    } catch (err) {
      console.error('Error submitting attendance:', err);
      alert('Gagal melakukan absensi');
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions: { status: TeacherAttendance['status']; label: string; icon: any; color: string; bgColor: string }[] = [
    { status: 'hadir', label: 'Hadir', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
    { status: 'izin', label: 'Izin', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { status: 'sakit', label: 'Sakit', icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { status: 'alpa', label: 'Alpa', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Absensi Mandiri Guru</h1>
        <p className="text-slate-500 mt-2">Silakan lakukan absensi harian Anda di sini.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl">
              {profile?.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.full_name}</h2>
              <p className="text-slate-500 capitalize">{profile?.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tanggal Hari Ini</p>
            <p className="text-lg font-bold text-slate-900">{format(new Date(), 'd MMMM yyyy', { locale: id })}</p>
          </div>
        </div>

        {attendance ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Absensi Berhasil!</h3>
            <p className="text-slate-500 mb-8">
              Anda telah tercatat <span className="font-bold text-green-600 uppercase">{attendance.status}</span> pada pukul {format(new Date(attendance.created_at), 'HH:mm')} WIB.
            </p>
            <button 
              onClick={() => setAttendance(null)}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Ubah Status Absensi
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusOptions.map((option) => (
              <button
                key={option.status}
                disabled={submitting}
                onClick={() => handleAttendance(option.status)}
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group disabled:opacity-50",
                  "hover:shadow-lg hover:border-transparent",
                  option.status === 'hadir' ? "border-green-100 hover:bg-green-500" :
                  option.status === 'izin' ? "border-blue-100 hover:bg-blue-500" :
                  option.status === 'sakit' ? "border-orange-100 hover:bg-orange-500" :
                  "border-red-100 hover:bg-red-500"
                )}
              >
                <div className={cn("p-4 rounded-2xl transition-colors", option.bgColor, "group-hover:bg-white/20")}>
                  <option.icon className={cn(option.color, "group-hover:text-white")} size={32} />
                </div>
                <span className={cn("font-bold transition-colors", "text-slate-700 group-hover:text-white")}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900">Informasi Penting</h4>
          <p className="text-sm text-blue-700 mt-1 leading-relaxed">
            Absensi mandiri guru hanya dapat dilakukan satu kali setiap harinya. Jika terjadi kesalahan, silakan hubungi Admin untuk melakukan perubahan data rekapitulasi.
          </p>
        </div>
      </div>
    </div>
  );
}
