import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) { toast.error(error.response?.data?.detail || 'Login failed'); }
    finally { setLoading(false); }
  };

  const cardBg = isDark
    ? 'bg-white/5 backdrop-blur-xl border border-white/10'
    : 'bg-white/60 backdrop-blur-xl border border-slate-200/50 shadow-xl';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/60' : 'text-slate-500';
  const inputClass = isDark ? 'auth-input' : 'bg-white border-slate-200 text-slate-900 h-12 rounded-xl focus:ring-2 focus:ring-indigo-500/50';
  const labelClass = isDark ? 'text-white/80' : 'text-slate-700';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <GraduationCap className={`h-10 w-10 ${isDark ? 'text-indigo-400' : 'text-indigo-600'} group-hover:scale-110 transition-transform duration-300`} />
            <span className={`text-3xl font-outfit font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>PATHWISE</span>
          </Link>
          <h1 className={`text-4xl font-bold font-outfit mb-3 ${textPrimary}`}>Welcome Back</h1>
          <p className={`text-lg ${textSecondary}`}>Continue your career journey</p>
        </div>
        <div className={`rounded-2xl p-8 ${cardBg}`} data-testid="login-form">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className={`flex items-center gap-2 mb-2 ${labelClass}`}><Mail className="h-4 w-4" />Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} data-testid="login-email-input" />
            </div>
            <div>
              <Label htmlFor="password" className={`flex items-center gap-2 mb-2 ${labelClass}`}><Lock className="h-4 w-4" />Password</Label>
              <Input id="password" type="password" placeholder="Password" required value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} data-testid="login-password-input" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full rounded-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl"
              data-testid="login-submit-btn">
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className={textSecondary}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors" data-testid="login-signup-link">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
