import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Map, Award, ArrowRight, BookOpen, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || ''}/api`;

export default function Dashboard() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDashboardData(response.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12" data-testid="dashboard-header">
          <h1 className={`text-4xl md:text-5xl font-bold font-outfit mb-2 ${textPrimary}`}>
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className={`text-lg ${textSecondary}`}>Track your progress and continue your journey</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Target, value: dashboardData.total_assessments, label: "Assessments Taken", color: "from-violet-500 to-indigo-500", id: "stat-assessments" },
            { icon: Award, value: `${dashboardData.career_readiness}%`, label: "Career Readiness", color: "from-blue-500 to-cyan-500", id: "stat-readiness", highlight: true },
            { icon: Map, value: dashboardData.active_paths, label: "Active Learning Paths", color: "from-emerald-500 to-teal-500", id: "stat-paths" }
          ].map((stat, i) => (
            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-8 hover:shadow-xl transition-all duration-300 ${stat.highlight ? `bg-gradient-to-br ${stat.color} border-transparent text-white` : cardBg}`}
              data-testid={stat.id}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${stat.highlight ? 'bg-white/20' : `bg-gradient-to-br ${stat.color} bg-opacity-20`}`}>
                <stat.icon className={`h-6 w-6 ${stat.highlight ? 'text-white' : 'text-white'}`} />
              </div>
              <div className={`text-4xl font-bold font-outfit mb-2 ${stat.highlight ? '' : textPrimary}`}>{stat.value}</div>
              <div className={stat.highlight ? 'text-white/80' : textSecondary}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { to: dashboardData.total_assessments === 0 ? '/assessment' : '/results', title: dashboardData.total_assessments === 0 ? 'Start Assessment' : 'View Results', desc: dashboardData.total_assessments === 0 ? 'Discover your ideal career' : 'See your career matches', icon: Target, id: 'action-assessment' },
            { to: '/careers', title: 'Explore Careers', desc: 'Browse India-focused career paths', icon: TrendingUp, id: 'action-careers' },
            { to: '/exams', title: 'Entrance Exams', desc: 'JEE, NEET, CAT & more', icon: BookOpen, id: 'action-exams' },
            { to: '/colleges', title: 'Top Colleges', desc: 'IITs, AIIMS, IIMs & more', icon: Building2, id: 'action-colleges' }
          ].map((action, i) => (
            <motion.div key={action.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <Link to={action.to}>
                <div className={`group rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${cardBg}`} data-testid={action.id}>
                  <action.icon className={`h-8 w-8 mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <h3 className={`text-lg font-bold font-outfit mb-1 ${textPrimary}`}>{action.title}</h3>
                  <p className={`text-sm mb-3 ${textSecondary}`}>{action.desc}</p>
                  <div className={`flex items-center text-sm font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'} group-hover:gap-2 transition-all`}>
                    Go <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Top Recommendations */}
        {dashboardData.latest_results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} data-testid="top-recommendations">
            <h2 className={`text-3xl font-bold font-outfit mb-6 ${textPrimary}`}>Your Top Matches</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {dashboardData.latest_results.map((rec) => (
                <div key={rec.career_id} className={`rounded-2xl border hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1 ${cardBg}`} data-testid={`top-match-${rec.career_id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl font-bold font-outfit ${textPrimary}`}>{rec.career_name}</h3>
                    <div className="text-2xl font-bold text-indigo-400">{rec.score}%</div>
                  </div>
                  <p className={`text-sm mb-4 ${textSecondary}`}>{rec.description}</p>
                  <Link to={`/career/${rec.career_id}`}>
                    <Button size="sm" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full" data-testid={`view-path-${rec.career_id}`}>
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
