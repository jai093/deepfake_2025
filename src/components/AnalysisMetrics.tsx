
import { Progress } from '@/components/ui/progress';
import { AnalysisResult } from '@/utils/analysisUtils';

interface AnalysisMetricsProps {
  results: AnalysisResult;
}

const AnalysisMetrics = ({ results }: AnalysisMetricsProps) => {
  // Safe access helper function to prevent "cannot read property of undefined" errors
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-b from-background/80 to-background/50 backdrop-blur p-5 rounded-lg border shadow-sm">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full mr-2"></span>
          Core Metrics
        </h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <span className={`inline-block w-1 h-4 rounded-sm ${safeAccess(results, 'baseMetrics.authenticity') > 70 ? 'bg-cyber-success' : 'bg-cyber-danger'} mr-2`}></span>
                Authenticity Score
              </span>
              <span className={`font-mono ${safeAccess(results, 'baseMetrics.authenticity') > 70 ? 'text-cyber-success' : 'text-cyber-danger'}`}>
                {Math.round(safeAccess(results, 'baseMetrics.authenticity'))}%
              </span>
            </div>
            <Progress 
              value={safeAccess(results, 'baseMetrics.authenticity')} 
              className="h-2" 
              indicatorClassName={safeAccess(results, 'baseMetrics.authenticity') > 70 ? 'bg-cyber-success' : 'bg-cyber-danger'} 
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <span className={`inline-block w-1 h-4 rounded-sm ${safeAccess(results, 'baseMetrics.manipulationProbability') < 30 ? 'bg-cyber-success' : 'bg-cyber-danger'} mr-2`}></span>
                Manipulation Probability
              </span>
              <span className={`font-mono ${safeAccess(results, 'baseMetrics.manipulationProbability') < 30 ? 'text-cyber-success' : 'text-cyber-danger'}`}>
                {Math.round(safeAccess(results, 'baseMetrics.manipulationProbability'))}%
              </span>
            </div>
            <Progress 
              value={safeAccess(results, 'baseMetrics.manipulationProbability')} 
              className="h-2" 
              indicatorClassName={safeAccess(results, 'baseMetrics.manipulationProbability') < 30 ? 'bg-cyber-success' : 'bg-cyber-danger'} 
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <span className="inline-block w-1 h-4 rounded-sm bg-cyber-secondary mr-2"></span>
                Confidence Score
              </span>
              <span className="font-mono">
                {Math.round(safeAccess(results, 'baseMetrics.confidence'))}%
              </span>
            </div>
            <Progress 
              value={safeAccess(results, 'baseMetrics.confidence')} 
              className="h-2" 
              indicatorClassName="bg-cyber-secondary" 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-background/80 to-background/50 backdrop-blur p-5 rounded-lg border shadow-sm">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <span className="inline-block w-2 h-2 bg-cyber-secondary rounded-full mr-2"></span>
          {results.mediaType.charAt(0).toUpperCase() + results.mediaType.slice(1)}-Specific Metrics
        </h4>
        <div className="space-y-4">
          {results && results.specificMetrics && Object.entries(results.specificMetrics).map(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
            // Determine if this metric is good when high or when low
            const isGoodWhenHigh = key.includes('Consistency') || 
                                   key.includes('Authenticity') || 
                                   key.includes('Natural') ||
                                   key.includes('Quality') ||
                                   key.includes('Sync');
            const isGoodValue = isGoodWhenHigh ? Number(value) > 70 : Number(value) < 30;
            
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <span className={`inline-block w-1 h-4 rounded-sm ${isGoodValue ? 'bg-cyber-success' : 'bg-cyber-danger'} mr-2`}></span>
                    {formattedKey}
                  </span>
                  <span className={`font-mono ${isGoodValue ? 'text-cyber-success' : 'text-cyber-danger'}`}>
                    {Math.round(Number(value))}%
                  </span>
                </div>
                <Progress 
                  value={Number(value)} 
                  className="h-2" 
                  indicatorClassName={isGoodValue ? 'bg-cyber-success' : 'bg-cyber-danger'} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisMetrics;
