import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    teacherAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: todayAttendance } = await supabase.from('attendance_students').select('*', { count: 'exact', head: true }).eq('date', today).eq('status', 'hadir');
        const { count: teacherAttendance } = await supabase.from('attendance_teachers').select('*', { count: 'exact', head: true }).eq('date', today).eq('status', 'hadir');

        setStats({
          totalStudents: studentCount || 0,
          todayAttendance: todayAttendance || 0,
          teacherAttendance: teacherAttendance || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { 
      title: 'Total Siswa', 
      value: stats.totalStudents, 
      icon: Users, 
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Siswa Hadir Hari Ini', 
      value: stats.todayAttendance, 
      icon: UserCheck, 
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Guru Hadir Hari Ini', 
      value: stats.teacherAttendance, 
      icon: CheckCircle2, 
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Persentase Kehadiran', 
      value: stats.totalStudents > 0 ? Math.round((stats.todayAttendance / stats.totalStudents) * 100) + '%' : '0%', 
      icon: TrendingUp, 
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Halo, {profile?.full_name}! 👋</h1>
          <p className="text-slate-500 mt-1">Selamat datang di dashboard HadirPintar.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Calendar className="text-blue-600" size={20} />
          <span className="font-semibold text-slate-700">
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", card.bgColor)}>
                <card.icon className={card.textColor} size={24} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statistik</span>
            </div>
            <h3 className="text-slate-500 font-medium text-sm">{card.title}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Aktivitas Terbaru</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat Semua</button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Absensi Siswa Kelas X-A</p>
                  <p className="text-sm text-slate-500">Oleh Guru: Budi Santoso • 10 menit yang lalu</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Selesai
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-sky-500 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Butuh Bantuan?</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Jika Anda mengalami kendala dalam menggunakan sistem, silakan hubungi tim IT sekolah atau baca panduan penggunaan.
            </p>
            <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg">
              Baca Panduan
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <AlertCircle size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
