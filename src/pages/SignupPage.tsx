import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../hooks/useSEO';
import { EyeIcon, EyeOffIcon, UserPlusIcon, ArrowLeftIcon, CheckIcon } from 'lucide-react';

export const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile info');
        const profile = await res.json();
        
        const result = await googleLogin(profile);
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error || 'Google login failed.');
        }
      } catch (err) {
        setError('Failed to fetch user info from Google.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign-In was cancelled or failed.');
    },
  });

  useSEO({
    title: 'Create Account',
    description:
      'Create a free CodeType account to track your coding typing speed, unlock achievements, and join the leaderboard.',
    canonicalPath: '/signup',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await signup(username, email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Sign up failed.');
  };

  const inputCls =
    'w-full bg-background/60 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 transition-all';

  const perks = ['Track WPM & accuracy', 'Unlock achievements', 'Join the leaderboard'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeftIcon size={14} />
          Back home
        </Link>

        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">Start tracking your progress today</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          {perks.map(p => (
            <span key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckIcon size={13} className="text-success" />
              {p}
            </span>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-error/10 border border-error/30 text-error text-sm rounded-lg p-3 animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} className={inputCls} placeholder="coderninja" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className={`${inputCls} pr-10`} placeholder="min. 6 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
              <input type={showPw ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required className={inputCls} placeholder="repeat password" />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 text-sm disabled:opacity-60 mt-1">
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <UserPlusIcon size={16} />
              )}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-2 bg-background/40 hover:bg-background/80 border border-border text-foreground hover:text-foreground/90 font-medium py-2.5 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>

          <p className="text-sm text-muted-foreground text-center mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
