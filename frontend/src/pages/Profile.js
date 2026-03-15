import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';
import { User, Mail, Award, Calendar, GraduationCap } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';
  const fieldBg = isDark ? 'bg-white/5' : 'bg-slate-50';

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-8 md:p-12 ${cardBg}`} data-testid="profile-card">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className={`text-3xl font-bold font-outfit mb-1 ${textPrimary}`}>{user.name}</h1>
              <p className={textSecondary}>Student Profile</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: Mail, label: 'Email', value: user.email, color: 'text-indigo-400', bg: 'bg-indigo-500/20', id: 'profile-email' },
              user.academic_stage && { icon: GraduationCap, label: 'Academic Stage', value: user.academic_stage, color: 'text-cyan-400', bg: 'bg-cyan-500/20', id: 'profile-stage' },
              user.stream && { icon: Award, label: 'Stream', value: user.stream, color: 'text-amber-400', bg: 'bg-amber-500/20', id: 'profile-stream' },
              user.grade && { icon: Award, label: 'Grade/Year', value: user.grade, color: 'text-amber-400', bg: 'bg-amber-500/20', id: 'profile-grade' },
              { icon: Calendar, label: 'Member Since', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A', color: 'text-emerald-400', bg: 'bg-emerald-500/20', id: 'profile-joined' }
            ].filter(Boolean).map(item => (
              <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl ${fieldBg}`} data-testid={item.id}>
                <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <div className={`text-sm ${textSecondary}`}>{item.label}</div>
                  <div className={`font-medium ${textPrimary}`}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
