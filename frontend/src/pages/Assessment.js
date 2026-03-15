import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Navbar } from '../components/Navbar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Assessment() {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadQuestions(); }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(`${API}/assessment/questions`, { headers: { Authorization: `Bearer ${token}` } });
      setQuestions(res.data);
    } catch { toast.error('Failed to load questions'); }
    finally { setLoading(false); }
  };

  const handleAnswer = (qId, oId) => setResponses({ ...responses, [qId]: oId });
  const handleNext = () => { if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1); };
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const handleSubmit = async () => {
    if (Object.keys(responses).length < questions.length) { toast.error('Please answer all questions'); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/assessment/submit`, { user_id: user.id, responses }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Assessment completed!');
      navigate('/results');
    } catch { toast.error('Failed to submit assessment'); }
    finally { setSubmitting(false); }
  };

  const cardBg = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-md border-slate-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-600';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" /></div>;

  if (!questions || questions.length === 0) return (
    <div className="min-h-screen"><Navbar /><div className={`max-w-2xl mx-auto px-4 py-12 text-center ${textSecondary}`}><p className="mb-4">No questions available</p><Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button></div></div>
  );

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-12" data-testid="assessment-container">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-violet-100 text-violet-700'}`}>
            <Compass className="h-4 w-4" /> Career Discovery Assessment
          </div>
        </motion.div>

        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className={`font-medium ${textSecondary}`}>Question {currentIndex + 1} of {questions.length}</span>
            <span className="font-bold text-indigo-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-4" data-testid="assessment-progress" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }} className={`rounded-2xl border shadow-xl p-8 md:p-12 mb-8 ${cardBg}`} data-testid="question-card">
            <h2 className={`text-2xl md:text-3xl font-bold font-outfit mb-8 ${textPrimary}`} data-testid="question-text">{currentQuestion.text}</h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button key={option.id} onClick={() => handleAnswer(currentQuestion.id, option.id)}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                    responses[currentQuestion.id] === option.id
                      ? isDark ? 'border-indigo-400 bg-indigo-500/20 shadow-lg' : 'border-violet-500 bg-violet-50 shadow-lg'
                      : isDark ? 'border-white/10 hover:border-indigo-400/50 hover:bg-white/5' : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                  }`} data-testid={`option-${option.id}`}>
                  <div className="flex items-center gap-4">
                    <motion.div animate={{ scale: responses[currentQuestion.id] === option.id ? [1, 1.2, 1] : 1 }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        responses[currentQuestion.id] === option.id ? 'border-indigo-500 bg-indigo-500' : isDark ? 'border-white/30' : 'border-slate-300'
                      }`}>
                      {responses[currentQuestion.id] === option.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-white rounded-full" />}
                    </motion.div>
                    <span className={`text-lg font-medium ${textPrimary}`}>{option.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-between gap-4">
          <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="outline" size="lg"
            className={`rounded-full px-8 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}`} data-testid="previous-btn">Previous</Button>
          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!responses[currentQuestion.id] || submitting} size="lg"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8" data-testid="submit-btn">
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!responses[currentQuestion.id]} size="lg"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8" data-testid="next-btn">Next</Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
