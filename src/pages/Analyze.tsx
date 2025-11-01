import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { AlertTriangle, Check, Download, Image, Mic, Video, Sparkles } from 'lucide-react';
import WebcamAnalyzer from '@/components/WebcamAnalyzer';
import AnalysisMetrics from '@/components/AnalysisMetrics';
import { generateAnalysisResults, generateDownloadableReport, AnalysisResult } from '@/utils/analysisUtils';

const defaultBaseMetrics = {
  authenticity: 0,
  manipulationProbability: 0,
  confidence: 0
};

const defaultSpecificMetrics = {};

const Analyze = () => {
  const [activeTab, setActiveTab] = useState('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const safeAccess = (obj: any, path: string, defaultValue: any = 0) => {
    try {
      const result = path.split('.').reduce((prev: any, curr: string) => 
        prev && prev[curr] !== undefined ? prev[curr] : undefined, obj);
      return result !== undefined ? result : defaultValue;
    } catch (e) {
      console.error(`Error accessing property path: ${path}`, e);
      return defaultValue;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedFile(null);
    setAnalysisResults(null);
    setAnalysisProgress(0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes: Record<string, string[]> = {
        video: ['video/mp4', 'video/webm', 'video/quicktime'],
        audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
        image: ['image/jpeg', 'image/png', 'image/gif'],
      };

      if (!validTypes[activeTab].includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `Please upload a valid ${activeTab} file.`,
        });
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    console.log('Starting analysis for file:', selectedFile.name);

    const interval = setInterval(() => {
      setAnalysisProgress((prevProgress) => {
        const nextProgress = prevProgress + Math.random() * 15;
        return nextProgress >= 100 ? 99 : nextProgress;
      });
    }, 600);
    
    try {
      const results = await generateAnalysisResults(activeTab, selectedFile.name, selectedFile);
      clearInterval(interval);
      setAnalysisProgress(100);
      
      console.log('Analysis complete:', results);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResults(results);
        toast({
          title: "Analysis complete",
          description: "Media analysis has been successfully completed.",
        });
      }, 500);
    } catch (error) {
      console.error('Error during analysis:', error);
      clearInterval(interval);
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "An error occurred during analysis. Please try again.",
      });
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResults(null);
    setAnalysisProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWebcamAnalysisComplete = (results: AnalysisResult) => {
    console.log('Webcam analysis results received:', results);
    if (results && results.baseMetrics && results.specificMetrics) {
      setAnalysisResults(results);
    } else {
      console.error('Incomplete webcam analysis results:', results);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Could not process webcam image analysis results.",
      });
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResults) return;

    const reportContent = generateDownloadableReport(analysisResults);
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deepfake-analysis-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report downloaded",
      description: "Analysis report has been downloaded successfully.",
    });
  };

  const getMediaTypeIcon = () => {
    switch (activeTab) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'audio':
        return <Mic className="h-6 w-6" />;
      case 'image':
        return <Image className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
              Analyze Media for Deepfakes
            </h1>
            <p className="text-muted-foreground">
              Upload media files for comprehensive deepfake detection analysis
            </p>
          </div>
          
          <Card className="bg-gradient-to-b from-card to-background border border-border p-6 shadow-lg">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-3 mb-8 bg-muted/50 backdrop-blur">
                <TabsTrigger value="video" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyber-primary/20 data-[state=active]:to-cyber-secondary/20 data-[state=active]:shadow-sm">
                  <Video size={18} className="mr-2" />
                  Video
                </TabsTrigger>
                <TabsTrigger value="audio" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyber-primary/20 data-[state=active]:to-cyber-secondary/20 data-[state=active]:shadow-sm">
                  <Mic size={18} className="mr-2" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyber-primary/20 data-[state=active]:to-cyber-secondary/20 data-[state=active]:shadow-sm">
                  <Image size={18} className="mr-2" />
                  Image
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="video" className="space-y-6 animate-fade-in">
                {!analysisResults ? (
                  <>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center border-muted hover:border-muted-foreground/50 transition-colors bg-background/50 backdrop-blur">
                        {selectedFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center">
                              <Video className="h-8 w-8 text-cyber-primary" />
                            </div>
                            <p className="text-foreground font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetAnalysis}
                              className="mt-2"
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <div className="relative">
                                <div className="absolute -inset-4 rounded-full bg-cyber-primary/10 animate-pulse"></div>
                                <Video className="h-12 w-12 text-cyber-primary relative" />
                              </div>
                            </div>
                            <div>
                              <p className="text-lg font-medium">Upload Video for Analysis</p>
                              <p className="text-sm text-muted-foreground mb-4">
                                Supports MP4, WebM, MOV (max 100MB)
                              </p>
                              <Button
                                variant="secondary"
                                className="bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 hover:from-cyber-primary/20 hover:to-cyber-secondary/20 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Select Video File
                              </Button>
                              <input
                                type="file"
                                accept="video/*"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <WebcamAnalyzer onAnalysisComplete={handleWebcamAnalysisComplete} />
                      
                      {selectedFile && !isAnalyzing && (
                        <Button 
                          className="w-full py-6 bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:opacity-90 transition-opacity shadow-md hover:shadow-lg text-white font-medium text-lg"
                          onClick={handleAnalyze}
                        >
                          <Sparkles size={18} className="mr-2" />
                          Start Analysis
                        </Button>
                      )}
                      
                      {isAnalyzing && (
                        <div className="space-y-4 bg-background/50 backdrop-blur p-4 rounded-lg border animate-fade-in">
                          <div className="flex items-center justify-between text-sm">
                            <span>Analyzing video...</span>
                            <span className="font-mono">{Math.round(analysisProgress)}%</span>
                          </div>
                          <Progress value={analysisProgress} className="h-2 bg-muted" indicatorClassName="bg-gradient-to-r from-cyber-primary to-cyber-secondary" />
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-pulse"></span>
                              Checking video frame consistency
                            </p>
                            <p className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-pulse"></span>
                              Analyzing facial expressions
                            </p>
                            <p className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-pulse"></span>
                              Examining audio-visual synchronization
                            </p>
                            <p className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-pulse"></span>
                              Comparing against DFDC dataset patterns
                            </p>
                            <p className="flex items-center">
                              <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-pulse"></span>
                              Testing with DFD detection model
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Analysis Results</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadReport}
                          className="flex items-center gap-1 hover:bg-cyber-primary/10 transition-colors"
                        >
                          <Download size={16} />
                          <span>Download Report</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetAnalysis}
                          className="hover:bg-cyber-secondary/10 transition-colors"
                        >
                          New Analysis
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`p-5 rounded-lg ${safeAccess(analysisResults, 'isDeepfake') 
                      ? 'bg-cyber-danger/10 border border-cyber-danger/30 shadow-inner' 
                      : 'bg-cyber-success/10 border border-cyber-success/30 shadow-inner'}`}
                    >
                      <div className="flex items-center gap-3">
                        {safeAccess(analysisResults, 'isDeepfake') ? (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-cyber-danger/20 animate-pulse"></div>
                            <AlertTriangle className="h-6 w-6 text-cyber-danger relative" />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-cyber-success/20 animate-pulse"></div>
                            <Check className="h-6 w-6 text-cyber-success relative" />
                          </div>
                        )}
                        <span className={`font-medium text-lg ${safeAccess(analysisResults, 'isDeepfake') ? 'text-cyber-danger' : 'text-cyber-success'}`}>
                          {safeAccess(analysisResults, 'overallResult', 'Analysis Complete')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground pl-9">
                        {safeAccess(analysisResults, 'isDeepfake') 
                          ? 'Our DFDC-trained AI has detected potential signs of manipulation in this media.' 
                          : 'Our DFD-trained AI did not detect significant signs of manipulation in this media.'}
                      </p>
                      <div className="mt-2 text-xs bg-background/50 backdrop-blur px-3 py-2 rounded inline-block ml-9">
                        <span className="text-muted-foreground">Confidence Interval:</span>{' '}
                        <span className="font-mono">{safeAccess(analysisResults, 'confidenceInterval', '0%')}</span>
                      </div>
                    </div>
                    
                    <AnalysisMetrics results={analysisResults} />
                    
                    <div className="bg-muted/40 p-5 rounded-lg text-sm backdrop-blur border">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Sparkles size={16} className="text-cyber-primary mr-2" />
                        Explanation
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {safeAccess(analysisResults, 'detailedExplanation', 'Analysis complete. No detailed explanation available.')}
                      </p>
                      <div className="mt-4 text-xs text-muted-foreground bg-background/50 backdrop-blur p-2 rounded">
                        Analysis performed using models trained on the Deepfake Detection Challenge Dataset (DFDC) and Deep Fake Detection (DFD) dataset.
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline"
                        className="hover:bg-cyber-secondary/10 transition-colors px-6 py-2" 
                        onClick={resetAnalysis}
                      >
                        Analyze Another File
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:opacity-90 transition-opacity shadow-md hover:shadow-lg px-6 py-2"
                        onClick={() => navigate('/')}
                      >
                        Return Home
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="audio" className="space-y-6 animate-fade-in">
                {!analysisResults ? (
                  <>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center border-muted hover:border-muted-foreground/50 transition-colors bg-background/50 backdrop-blur">
                        {selectedFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center">
                              <Mic className="h-8 w-8 text-cyber-primary" />
                            </div>
                            <p className="text-foreground font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetAnalysis}
                              className="mt-2"
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <Mic className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-lg font-medium">Upload Audio for Analysis</p>
                              <p className="text-sm text-muted-foreground mb-4">
                                Supports MP3, WAV, OGG (max 50MB)
                              </p>
                              <Button
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Select Audio File
                              </Button>
                              <input
                                type="file"
                                accept="audio/*"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* No webcam for audio tab */}
                      
                      {selectedFile && !isAnalyzing && (
                        <Button 
                          className="w-full bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:opacity-90 transition-opacity"
                          onClick={handleAnalyze}
                        >
                          Start Analysis
                        </Button>
                      )}
                      
                      {isAnalyzing && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Analyzing audio...</span>
                            <span>{Math.round(analysisProgress)}%</span>
                          </div>
                          <Progress value={analysisProgress} className="h-2" />
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>▹ Analyzing voice patterns</p>
                            <p>▹ Checking for frequency anomalies</p>
                            <p>▹ Examining background noise consistency</p>
                            <p>▹ Comparing against DFDC dataset patterns</p>
                            <p>▹ Verifying voice print authenticity</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Analysis Results</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadReport}
                          className="flex items-center gap-1 hover:bg-cyber-primary/10 transition-colors"
                        >
                          <Download size={16} />
                          <span>Download Report</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetAnalysis}
                          className="hover:bg-cyber-secondary/10 transition-colors"
                        >
                          New Analysis
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`p-5 rounded-lg ${safeAccess(analysisResults, 'isDeepfake') ? 'bg-cyber-danger/10 border border-cyber-danger/30 shadow-inner' : 'bg-cyber-success/10 border border-cyber-success/30 shadow-inner'}`}>
                      <div className="flex items-center gap-3">
                        {safeAccess(analysisResults, 'isDeepfake') ? (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-cyber-danger/20 animate-pulse"></div>
                            <AlertTriangle className="h-6 w-6 text-cyber-danger relative" />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-cyber-success/20 animate-pulse"></div>
                            <Check className="h-6 w-6 text-cyber-success relative" />
                          </div>
                        )}
                        <span className={`font-medium text-lg ${safeAccess(analysisResults, 'isDeepfake') ? 'text-cyber-danger' : 'text-cyber-success'}`}>
                          {safeAccess(analysisResults, 'overallResult', 'Analysis Complete')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground pl-9">
                        {safeAccess(analysisResults, 'isDeepfake') 
                          ? 'Our DFDC-trained AI has detected potential signs of voice synthesis in this audio.' 
                          : 'Our DFD-trained AI did not detect significant signs of voice synthesis in this audio.'}
                      </p>
                      <div className="mt-2 text-xs bg-background/50 backdrop-blur px-3 py-2 rounded inline-block ml-9">
                        <span className="text-muted-foreground">Confidence Interval:</span>{' '}
                        <span className="font-mono">{safeAccess(analysisResults, 'confidenceInterval', '0%')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Core Metrics</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Authenticity Score</span>
                              <span>{Math.round(safeAccess(analysisResults, 'baseMetrics.authenticity'))}%</span>
                            </div>
                            <Progress value={safeAccess(analysisResults, 'baseMetrics.authenticity')} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Manipulation Probability</span>
                              <span>{Math.round(safeAccess(analysisResults, 'baseMetrics.manipulationProbability'))}%</span>
                            </div>
                            <Progress value={safeAccess(analysisResults, 'baseMetrics.manipulationProbability')} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Confidence Score</span>
                              <span>{Math.round(safeAccess(analysisResults, 'baseMetrics.confidence'))}%</span>
                            </div>
                            <Progress value={safeAccess(analysisResults, 'baseMetrics.confidence')} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Audio-Specific Metrics</h4>
                        <div className="space-y-4">
                          {analysisResults && analysisResults.specificMetrics && Object.entries(analysisResults.specificMetrics).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{Math.round(Number(value))}%</span>
                              </div>
                              <Progress value={Number(value)} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/40 p-5 rounded-lg text-sm backdrop-blur border">
                      <h4 className="font-medium mb-2">Explanation</h4>
                      <p className="text-muted-foreground">
                        {safeAccess(analysisResults, 'detailedExplanation', 'Analysis complete. No detailed explanation available.')}
                      </p>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Analysis performed using models trained on the Deepfake Detection Challenge Dataset (DFDC) and Deep Fake Detection (DFD) dataset.
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={resetAnalysis}>
                        Analyze Another File
                      </Button>
                      <Button
                        onClick={() => navigate('/')}
                      >
                        Return Home
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="image" className="space-y-6 animate-fade-in">
                {!analysisResults ? (
                  <>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center border-muted hover:border-muted-foreground/50 transition-colors bg-background/50 backdrop-blur">
                        {selectedFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center">
                              <Image className="h-8 w-8 text-cyber-primary" />
                            </div>
                            <p className="text-foreground font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetAnalysis}
                              className="mt-2"
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <Image className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-lg font-medium">Upload Image for Analysis</p>
                              <p className="text-sm text-muted-foreground mb-4">
                                Supports JPEG, PNG, GIF (max 20MB)
                              </p>
                              <Button
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Select Image File
                              </Button>
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <WebcamAnalyzer onAnalysisComplete={handleWebcamAnalysisComplete} />
                      
                      {selectedFile && !isAnalyzing && (
                        <Button 
                          className="w-full bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:opacity-90 transition-opacity"
                          onClick={handleAnalyze}
                        >
                          Start Analysis
                        </Button>
                      )}
                      
                      {isAnalyzing && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Analyzing image...</span>
                            <span>{Math.round(analysisProgress)}%</span>
                          </div>
                          <Progress value={analysisProgress} className="h-2" />
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>▹ Examining pixel inconsistencies</p>
                            <p>▹ Analyzing metadata</p>
                            <p>▹ Checking lighting consistency</p>
                            <p>▹ Scanning for neural network artifacts</p>
                            <p>▹ Comparing against DFD dataset patterns</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Analysis Results</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadReport}
                          className="flex items-center gap-1 hover:bg-cyber-primary/10 transition-colors"
                        >
                          <Download size={16} />
                          <span>Download Report</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetAnalysis}
                          className="hover:bg-cyber-secondary/10 transition-colors"
                        >
                          New Analysis
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`p-5 rounded-lg ${safeAccess(analysisResults, 'isDeepfake') 
                      ? 'bg-cyber-danger/10 border border-cyber-danger/30 shadow-inner' 
                      : 'bg-cyber-success/10 border border-cyber-success/30 shadow-inner'}`}>
                      <div className="flex items-center gap-3">
                        {safeAccess(analysisResults, 'isDeepfake') ? (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-cyber-danger/20 animate-pulse"></div>
                            <AlertTriangle className="h-6 w-6 text-cyber-danger relative" />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-cyber-success/20 animate-pulse"></div>
                            <Check className="h-6 w-6 text-cyber-success relative" />
                          </div>
                        )}
                        <span className={`font-medium text-lg ${safeAccess(analysisResults, 'isDeepfake') ? 'text-cyber-danger' : 'text-cyber-success'}`}>
                          {safeAccess(analysisResults, 'overallResult', 'Analysis Complete')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground pl-9">
                        {safeAccess(analysisResults, 'isDeepfake') 
                          ? 'Our DFD-trained AI has detected potential signs of manipulation in this image.' 
                          : 'Our DFD-trained AI did not detect significant signs of manipulation in this image.'}
                      </p>
                      <div className="mt-2 text-xs bg-background/50 backdrop-blur px-3 py-2 rounded inline-block ml-9">
                        <span className="text-muted-foreground">Confidence Interval:</span>{' '}
                        <span className="font-mono">{safeAccess(analysisResults, 'confidenceInterval', '0%')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Core Metrics</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Authenticity Score</span>
                              <span>{Math.round(safeAccess(analysisResults, 'baseMetrics.authenticity'))}%</span>
                            </div>
                            <Progress value={safeAccess(analysisResults, 'baseMetrics.authenticity')} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Manipulation Probability</span>
                              <span>{Math.round(safeAccess(analysisResults, 'baseMetrics.manipulationProbability'))}%</span>
                            </div>
                            <Progress value={safeAccess(analysisResults, 'baseMetrics.manipulationProbability')} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Confidence Score</span>
                              <span>{Math.round(safeAccess(analysisResults, 'baseMetrics.confidence'))}%</span>
                            </div>
                            <Progress value={safeAccess(analysisResults, 'baseMetrics.confidence')} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Image-Specific Metrics</h4>
                        <div className="space-y-4">
                          {analysisResults && analysisResults.specificMetrics && Object.entries(analysisResults.specificMetrics).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{Math.round(Number(value))}%</span>
                              </div>
                              <Progress value={Number(value)} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/40 p-5 rounded-lg text-sm backdrop-blur border">
                      <h4 className="font-medium mb-2">Explanation</h4>
                      <p className="text-muted-foreground">
                        {safeAccess(analysisResults, 'detailedExplanation', 'Analysis complete. No detailed explanation available.')}
                      </p>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Analysis performed using models trained on the Deepfake Detection Challenge Dataset (DFDC) and Deep Fake Detection (DFD) dataset.
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={resetAnalysis}>
                        Analyze Another File
                      </Button>
                      <Button
                        onClick={() => navigate('/')}
                      >
                        Return Home
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
          
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
