import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Code, BarChart3, Layers, Palette, TrendingUp, Briefcase, Shield } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || ''}/api`;
const iconMap = { Code, BarChart3, Layers, Palette, TrendingUp, Briefcase, Shield };

export default function Results() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadResults(); }, []);

  const loadResults = async () => {
    try {
      const res = await axios.get(`${API}/assessment/results/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setRecommendations(res.data.recommendations);
    } catch { toast.error('Failed to load results'); }
    finally { setLoading(false); }
  };

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12" data-testid="results-header">
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
            Assessment Complete!
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold font-outfit mb-4 ${textPrimary}`}>
            Your Career <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Recommendations</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>Based on your responses, here are the careers that match your profile best</p>
        </motion.div>

        {recommendations.length === 0 ? (
          <div className={`text-center py-12 ${textSecondary}`}>
            <p className="mb-6">No results yet. Take the assessment to get recommendations!</p>
            <Link to="/assessment"><Button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">Take Assessment</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((rec, index) => {
              const IconComponent = iconMap[rec.icon] || Code;
              return (
                <motion.div key={rec.career_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }} whileHover={{ y: -4 }} className="group">
                  <div className={`rounded-2xl border p-8 hover:shadow-xl transition-all duration-300 h-full ${cardBg}`} data-testid={`career-card-${rec.career_id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold font-outfit text-indigo-400">{rec.score}%</div>
                        <div className={`text-xs ${textSecondary}`}>Match Score</div>
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold font-outfit mb-3 ${textPrimary}`}>{rec.career_name}</h3>
                    <p className={`mb-6 leading-relaxed text-sm ${textSecondary}`}>{rec.description}</p>
                    <div className="flex gap-3">
                      <Link to={`/career/${rec.career_id}`} className="flex-1">
                        <Button variant="outline" className={`w-full rounded-full ${isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}`} data-testid={`view-career-${rec.career_id}`}>Details</Button>
                      </Link>
                      <Link to={`/learning-path/${rec.career_id}`}>
                        <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" data-testid={`view-path-${rec.career_id}`}>
                          Path <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
