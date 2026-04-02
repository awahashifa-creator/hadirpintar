import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TeacherAttendance, StudentAttendance } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Calendar, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';

interface RecapProps {
  type: 'guru' | 'siswa';
}

export default function Recap({ type }: RecapProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM'));
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecap();
  }, [type, dateFilter]);

  async function fetchRecap() {
    setLoading(true);
    try {
      const startOfMonth = `${dateFilter}-01`;
      const endOfMonth = `${dateFilter}-31`;

      if (type === 'guru') {
        const { data: attendance, error } = await supabase
          .from('attendance_teachers')
          .select('*, profiles(*)')
          .gte('date', startOfMonth)
          .lte('date', endOfMonth)
          .order('date', { ascending: false });

        if (error) throw error;
        setData(attendance || []);
      } else {
        const { data: attendance, error } = await supabase
          .from('attendance_students')
          .select('*, students(*), profiles(*)')
          .gte('date', startOfMonth)
          .lte('date', endOfMonth)
          .order('date', { ascending: false });

        if (error) throw error;
        setData(attendance || []);
      }
    } catch (err) {
      console.error('Error fetching recap:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = data.filter(item => {
    const name = type === 'guru' ? item.profiles?.full_name : item.students?.name;
    return name?.toLowerCase().includes(search.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Hadir</span>;
      case 'izin': return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">Izin</span>;
      case 'sakit': return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase">Sakit</span>;
      case 'alpa': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">Alpa</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rekap Absensi {type === 'guru' ? 'Guru' : 'Siswa'}</h1>
          <p className="text-slate-500 mt-1">Laporan kehadiran periode {format(new Date(dateFilter), 'MMMM yyyy', { locale: id })}.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
          <Download size={20} />
          <span>Export PDF/Excel</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={`Cari nama ${type === 'guru' ? 'guru' : 'siswa'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Nama</th>
                {type === 'siswa' && <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Kelas</th>}
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Waktu Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={type === 'siswa' ? 5 : 4} className="px-6 py-12 text-center">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {format(new Date(item.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {type === 'guru' ? item.profiles?.full_name : item.students?.name}
                    </td>
                    {type === 'siswa' && (
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                          {item.students?.class}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {format(new Date(item.created_at), 'HH:mm')} WIB
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={type === 'siswa' ? 5 : 4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={48} className="text-slate-200" />
                      <p>Tidak ada data rekap ditemukan.</p>
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
