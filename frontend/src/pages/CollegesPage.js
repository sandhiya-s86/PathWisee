import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, Star, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL || ''}/api`;

export default function CollegesPage() {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadColleges(); }, []);

  const loadColleges = async () => {
    try {
      const res = await axios.get(`${API}/colleges`, { headers: { Authorization: `Bearer ${token}` } });
      setColleges(res.data);
    } catch { toast.error('Failed to load colleges'); }
    finally { setLoading(false); }
  };

  const filtered = colleges.filter(c => {
    return c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.location?.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.location?.state || '').toLowerCase().includes(search.toLowerCase());
  });

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10" data-testid="colleges-header">
          <h1 className={`text-4xl md:text-5xl font-bold font-outfit mb-4 ${textPrimary}`}>
            Top Indian <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Colleges</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${textSecondary}`}>Explore India's premier educational institutions - IITs, AIIMS, IIMs, NLUs & more</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 mb-8 ${cardBg}`} data-testid="colleges-filters">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
            <input type="text" placeholder="Search by college name, city or state..." value={search} onChange={e => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
              data-testid="colleges-search" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((college, index) => (
            <motion.div key={college.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }}>
              <div className={`rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 h-full ${cardBg}`} data-testid={`college-card-${college.id}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold font-outfit ${textPrimary}`}>{college.name}</h3>
                    <div className={`flex items-center gap-1 text-sm ${textSecondary}`}>
                      <MapPin className="h-3 w-3" />
                      {college.location?.city}{college.location?.state ? `, ${college.location.state}` : ''}
                    </div>
                  </div>
                </div>

                {college.type && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>{college.type}</span>
                )}

                {college.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className={`text-sm font-medium ${textPrimary}`}>{college.rating}</span>
                  </div>
                )}

                {college.fees_range && (
                  <div className={`flex items-center gap-1 text-sm mb-3 ${textSecondary}`}>
                    <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{college.fees_range}</span>
                  </div>
                )}

                {college.courses && college.courses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {college.courses.slice(0, 4).map((c, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{c}</span>
                    ))}
                    {college.courses.length > 4 && <span className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>+{college.courses.length - 4} more</span>}
                  </div>
                )}

                {college.entrance_exams && college.entrance_exams.length > 0 && (
                  <div className={`pt-3 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <p className={`text-xs font-medium mb-1 ${textSecondary}`}>Entrance Exams:</p>
                    <p className={`text-sm ${textPrimary}`}>{college.entrance_exams.join(', ')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && <div className={`text-center py-16 ${textSecondary}`}><p className="text-lg">No colleges found matching your search.</p></div>}
      </div>
    </div>
  );
}
