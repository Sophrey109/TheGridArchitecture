import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";

interface Question {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  answers?: Answer[];
}

interface Answer {
  id: string;
  content: string;
  status: string;
  created_at: string;
}

const AskArchitect = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchQuestions();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select(`
        id,
        title,
        content,
        status,
        created_at,
        answers (
          id,
          content,
          status,
          created_at
        )
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching questions:", error);
    } else {
      setQuestions(data || []);
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a question.",
        variant: "destructive",
      });
      return;
    }

    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("questions")
      .insert({
        title: newQuestion.title,
        content: newQuestion.content,
        user_id: user.id,
      });

    if (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Question submitted",
        description: "Your question has been submitted for review and will be posted once approved.",
      });
      setNewQuestion({ title: "", content: "" });
    }
    setLoading(false);
  };

  const submitAnswer = async (questionId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an answer.",
        variant: "destructive",
      });
      return;
    }

    const answerContent = newAnswers[questionId]?.trim();
    if (!answerContent) {
      toast({
        title: "Missing content",
        description: "Please provide content for your answer.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("answers")
      .insert({
        question_id: questionId,
        content: answerContent,
        user_id: user.id,
      });

    if (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Answer submitted",
        description: "Your answer has been submitted for review and will be posted once approved.",
      });
      setNewAnswers({ ...newAnswers, [questionId]: "" });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Ask an Architect</h1>
          <p className="text-muted-foreground text-lg">
            Submit your architectural questions and get answers from the community. All questions and answers are reviewed before posting.
          </p>
        </div>

        {/* Submit Question Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ask a Question
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitQuestion} className="space-y-4">
              <div>
                <Input
                  placeholder="Question title..."
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  maxLength={200}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Describe your question in detail..."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Question"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No questions have been approved yet. Be the first to ask!</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{question.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Approved
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(question.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-6">{question.content}</p>

                  {/* Approved Answers */}
                  {question.answers && question.answers.filter(a => a.status === 'approved').length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Answers</h4>
                      <div className="space-y-4">
                        {question.answers
                          .filter(answer => answer.status === 'approved')
                          .map((answer) => (
                            <div key={answer.id} className="bg-muted/50 p-4 rounded-lg">
                              <p className="mb-2">{answer.content}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(answer.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Answer Form */}
                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-semibold mb-3">Submit an Answer</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your knowledge and help answer this question..."
                        value={newAnswers[question.id] || ""}
                        onChange={(e) => setNewAnswers({ ...newAnswers, [question.id]: e.target.value })}
                        rows={3}
                      />
                      <Button
                        onClick={() => submitAnswer(question.id)}
                        variant="outline"
                        size="sm"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AskArchitect;