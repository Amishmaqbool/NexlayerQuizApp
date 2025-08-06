import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DocViewer } from '@/components/docs/DocViewer';
import { useAuth } from '@/contexts/AuthContext';
import { AuthComponent } from '@/components/auth/AuthComponent';
import { Loader2 } from 'lucide-react';

const Documentation = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Validate slug
  const validSlugs = ['ai-native-platform', 'one-command-deploy', 'production-ready', 'agent-friendly'];
  
  useEffect(() => {
    if (slug && !validSlugs.includes(slug)) {
      navigate('/404', { replace: true });
    }
  }, [slug, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{backgroundColor: '#191919'}}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-nexlayer-cyan mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth component if user is not logged in
  if (!user) {
    return <AuthComponent />;
  }

  if (!slug || !validSlugs.includes(slug)) {
    navigate('/', { replace: true });
    return null;
  }

  const handleBack = () => {
    navigate('/', { replace: true });
  };

  return (
    <DocViewer 
      docPath={slug} 
      onBack={handleBack}
    />
  );
};

export default Documentation;
