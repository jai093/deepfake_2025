
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-cyber-primary/5 to-background">
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block mb-4">
                <span className="stat-badge">AI-Powered Protection</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground">
                Future With Next
                <span className="block text-cyber-primary">Intel Processors</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Experience Unmatched Speed, Performance, And Reliability For Work, Gaming And Creativity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/analyze')}
                  className="bg-cyber-primary text-primary-foreground hover:bg-cyber-primary/90 rounded-full px-8 shadow-lg"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/docs')}
                  className="rounded-full px-8 border-2"
                >
                  Learn More
                </Button>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div>
                  <div className="text-3xl font-bold text-cyber-primary mb-1">200M+</div>
                  <div className="text-sm text-muted-foreground">Devices Powered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyber-primary mb-1">#1</div>
                  <div className="text-sm text-muted-foreground">Choice of Experts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyber-primary mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">User Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyber-primary/20 to-cyber-accent/20 rounded-full blur-3xl"></div>
              <div className="relative bg-card border-2 border-border rounded-3xl overflow-hidden shadow-2xl p-8">
                <div className="aspect-square bg-gradient-to-br from-cyber-primary/10 to-cyber-accent/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block rounded-full bg-cyber-primary/20 p-6 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-cyber-primary"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground font-medium">Optimized For Outstanding</p>
                    <p className="text-2xl font-bold text-cyber-primary mt-2">Trusted Process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="stat-badge mb-4">Next-Gen Features</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 mt-4">For Every Need</h2>
            <p className="text-lg text-muted-foreground">
              Our multimodal approach combines multiple analysis techniques for comprehensive deepfake detection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="feature-card group">
              <div className="inline-block rounded-2xl bg-gradient-to-br from-cyber-primary/10 to-cyber-primary/5 p-4 mb-6 group-hover:scale-110 transition-transform">
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
                  <path d="M15 10h4.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5H15" />
                  <path d="M9 12h6" />
                  <path d="M9 5h9" />
                  <path d="M9 19h9" />
                  <path d="M5 19V5" />
                  <path d="M3 3v18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Video Frames</h3>
              <p className="text-muted-foreground leading-relaxed">
                Frame-by-frame analysis detecting inconsistencies and manipulation artifacts.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="inline-block rounded-2xl bg-gradient-to-br from-cyber-secondary/10 to-cyber-secondary/5 p-4 mb-6 group-hover:scale-110 transition-transform">
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
                  <path d="M9 9H4.5a2.5 2.5 0 0 0 0 5H9" />
                  <path d="M16 15h4.5a2.5 2.5 0 0 0 0-5H16" />
                  <path d="M12 5v13" />
                  <path d="m7 8 5-3 5 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Voice Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Detection of synthetic voice patterns and audio-visual misalignments.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="inline-block rounded-2xl bg-gradient-to-br from-cyber-accent/10 to-cyber-accent/5 p-4 mb-6 group-hover:scale-110 transition-transform">
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
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20" />
                  <path d="M8 9h8" />
                  <path d="M8 15h3" />
                  <path d="M16 15h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Facial Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Identifies unnatural facial expressions and emotion distortions.
              </p>
            </div>
            
            <div className="feature-card group">
              <div className="inline-block rounded-2xl bg-gradient-to-br from-cyber-success/10 to-cyber-success/5 p-4 mb-6 group-hover:scale-110 transition-transform">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-8 h-8 text-cyber-success"
                >
                  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
                  <path d="m8 16 4-4 4 4" />
                  <path d="M16 16v4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Metadata Check</h3>
              <p className="text-muted-foreground leading-relaxed">
                Examines file metadata for signs of digital manipulation or editing.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative bg-gradient-to-br from-cyber-primary/5 via-background to-cyber-accent/5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border-2 border-border rounded-3xl p-12 md:p-16 text-center shadow-2xl">
              <span className="stat-badge mb-4">Trusted By 245K+ User</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 mt-4">Ready to Analyze Media?</h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Upload videos, audio, or images to get a comprehensive deepfake analysis powered by our multimodal AI system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/analyze')}
                  className="bg-cyber-primary text-primary-foreground hover:bg-cyber-primary/90 rounded-full px-8 shadow-lg"
                >
                  Start Analysis
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="rounded-full px-8 border-2"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
