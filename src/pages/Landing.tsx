import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Users,
  UserCheck
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <CheckCircle2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
              HadirPintar
            </span>
          </div>
          <Link 
            to="/login" 
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Masuk Sekarang
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Absensi Digital <br />
              <span className="text-blue-600">Lebih Cerdas,</span> <br />
              Lebih Akurat.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              HadirPintar adalah solusi manajemen kehadiran modern yang dirancang khusus untuk institusi pendidikan. Mengurangi administrasi manual dan meningkatkan efisiensi sekolah.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/login" 
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-200 group"
              >
                Mulai Sekarang
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                Pelajari Fitur
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-sky-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl">
                  <UserCheck className="text-blue-600 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Absensi Guru</h3>
                  <p className="text-sm text-slate-600">Mandiri & Real-time</p>
                </div>
                <div className="p-6 bg-sky-50 rounded-2xl">
                  <Users className="text-sky-600 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Absensi Siswa</h3>
                  <p className="text-sm text-slate-600">Terintegrasi Database</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl">
                  <BarChart3 className="text-green-600 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Rekap Otomatis</h3>
                  <p className="text-sm text-slate-600">Laporan Akurat</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-2xl">
                  <ShieldCheck className="text-purple-600 mb-4" size={32} />
                  <h3 className="font-bold text-slate-900 mb-1">Keamanan Data</h3>
                  <p className="text-sm text-slate-600">Terproteksi Cloud</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa Memilih HadirPintar?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Kami menyediakan platform yang memudahkan guru dan admin dalam mengelola kehadiran harian dengan teknologi terkini.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Efisiensi Waktu",
                desc: "Proses absensi hanya butuh beberapa detik, memberikan lebih banyak waktu untuk kegiatan belajar mengajar.",
                icon: Clock
              },
              {
                title: "Analisis Data",
                desc: "Dapatkan wawasan mendalam tentang tingkat kehadiran siswa dan guru melalui dashboard analitik.",
                icon: BarChart3
              },
              {
                title: "Akses Kapan Saja",
                desc: "Berbasis cloud sehingga dapat diakses dari perangkat mana pun, kapan saja selama terhubung internet.",
                icon: ShieldCheck
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900">HadirPintar</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 HadirPintar. Dibuat untuk masa depan pendidikan yang lebih baik.
          </p>
        </div>
      </footer>
    </div>
  );
}
