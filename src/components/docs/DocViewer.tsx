import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  getAINativePlatformContent, 
  getOneCommandDeployContent, 
  getProductionReadyContent, 
  getAgentFriendlyContent 
} from '@/utils/docContent';

interface DocViewerProps {
  docPath: string;
  onBack: () => void;
}

export const DocViewer = ({ docPath, onBack }: DocViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Use static content directly since MDX files are processed by Vite
        const mdxContent = getStaticContent(docPath);
        if (!mdxContent || mdxContent === 'Documentation content not available.') {
          throw new Error('Document not found');
        }
        setContent(mdxContent);
      } catch (err) {
        console.error('Failed to load document:', err);
        setError('Failed to load documentation. Please try again.');
        setContent('Documentation content not available.');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [docPath]);

  // Static content fallback for development
  const getStaticContent = (path: string): string => {
    const contentMap: { [key: string]: () => string } = {
      'ai-native-platform': getAINativePlatformContent,
      'one-command-deploy': getOneCommandDeployContent,
      'production-ready': getProductionReadyContent,
      'agent-friendly': getAgentFriendlyContent,
    };

    const contentFunction = contentMap[path];
    return contentFunction ? contentFunction() : 'Documentation content not available.';
  };

  const getDocTitle = (docPath: string): string => {
    const titles: { [key: string]: string } = {
      'ai-native-platform': 'AI-Native Platform',
      'one-command-deploy': 'One Command Deploy',
      'production-ready': 'Production Ready',
      'agent-friendly': 'Agent Friendly',
    };
    return titles[docPath] || 'Documentation';
  };

  const getReadingTime = (content: string): string => {
    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/minute
    return `${readingTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="background-svg min-h-screen bg-background" style={{backgroundColor: '#191919'}}>
      {/* Header */}
      <div className="w-screen fixed top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-between">
            <Button 
              onClick={onBack} 
              variant="ghost" 
              className="hover:bg-nexlayer-cyan/10 hover:text-nexlayer-cyan"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {getReadingTime(content)}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                Documentation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 mt-28">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-nexlayer-cyan">
              {getDocTitle(docPath)}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-nexlayer-cyan mb-6 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium text-foreground mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="text-muted-foreground mb-4 ml-6 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-muted-foreground mb-4 ml-6 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="list-disc marker:text-nexlayer-cyan">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-nexlayer-cyan font-semibold">
                    {children}
                  </strong>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted/50 text-nexlayer-cyan px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-muted/30 text-foreground p-4 rounded-lg text-sm font-mono overflow-x-auto border border-border/50">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto border border-border/50 mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-nexlayer-cyan pl-4 py-2 bg-muted/20 rounded-r mb-4">
                    {children}
                  </blockquote>
                ),
                hr: () => (
                  <hr className="border-border/50 my-8" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
