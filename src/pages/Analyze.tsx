import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { supabase } from '@/integrations/supabase/client';

const Analyze = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session && !loading) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, loading]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <section aria-labelledby="hf-space-title" className="mb-10">
            <div className="text-center mb-6">
              <h1 id="hf-space-title" className="font-display text-4xl font-bold mb-3 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
                Multimodal Deepfake Detection
              </h1>
              <p className="text-muted-foreground text-lg">
                Upload video, audio, or images to detect deepfakes using ResNet50 and InceptionV3 models
              </p>
            </div>
            <div className="bg-card rounded-lg border shadow-lg overflow-hidden" style={{ minHeight: '800px' }}>
              {/* <iframe
                src="https://subhojitsau-multimodal-deepfake-detection.hf.space"
                title="Multimodal Deepfake Detection - Hugging Face Space"
                className="w-full rounded-lg"
                style={{ height: '800px' }}
                frameBorder="0"
                loading="lazy"
                referrerPolicy="no-referrer" */}
              <iframe
  src="https://subhojitsau-multimodal-deepfake-detection.hf.space"
  title="Multimodal Deepfake Detection - Hugging Face Space"
  className="w-full rounded-lg"
  style={{ height: '800px' }}
  frameBorder="0"
  loading="lazy"
  referrerPolicy="no-referrer"
  allow="microphone; camera"
/>
            </div>
          </section>
          
          <div className="mt-12 bg-background/50 backdrop-blur p-6 rounded-lg border shadow-sm">
            <h2 className="font-display text-2xl font-bold mb-6 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">How Our Analysis Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow hover:border-cyber-primary/30 group">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-cyber-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyber-primary/20 transition-colors">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-8 h-8 text-cyber-primary"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 group-hover:text-cyber-primary transition-colors">DFDC-Trained Models</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our system uses advanced neural networks trained on the Deepfake Detection Challenge Dataset (DFDC) to identify manipulated media with high precision.
                  </p>
                </div>
              </div>
              
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow hover:border-cyber-secondary/30 group">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-cyber-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyber-secondary/20 transition-colors">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-8 h-8 text-cyber-secondary"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M12 2v20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 group-hover:text-cyber-secondary transition-colors">Multimodal Analysis</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We combine analysis of visual cues, audio patterns, and metadata using DFD dataset insights for a comprehensive assessment of media authenticity.
                  </p>
                </div>
              </div>
              
              <div className="bg-card p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow hover:border-cyber-accent/30 group">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-cyber-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyber-accent/20 transition-colors">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-8 h-8 text-cyber-accent"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 group-hover:text-cyber-accent transition-colors">Detailed Reporting</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Get comprehensive analysis results with specific metrics, downloadable reports, and detailed explanations about potential manipulation indicators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analyze;
