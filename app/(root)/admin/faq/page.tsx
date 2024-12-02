"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Save } from 'lucide-react'

interface FAQ {
  id: number;
  question: string;
  answer: string | null;
  isOfficial: boolean;
}

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    { id: 1, question: "How do I file a report?", answer: "Log in and use our AI system.", isOfficial: true },
    { id: 2, question: "Is my data secure?", answer: "Yes, we use encryption.", isOfficial: true },
    { id: 3, question: "What's the response time?", answer: null, isOfficial: false },
    { id: 4, question: "Can I report anonymously?", answer: "No, you need an account.", isOfficial: false },
  ]);

  const [answerFilter, setAnswerFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [officialFilter, setOfficialFilter] = useState<'all' | 'official' | 'unofficial'>('all');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState<string>('');

  const filteredFaqs = faqs.filter(faq => {
    const answerMatch = 
      answerFilter === 'all' ? true :
      answerFilter === 'answered' ? faq.answer !== null :
      faq.answer === null;
    
    const officialMatch = 
      officialFilter === 'all' ? true :
      officialFilter === 'official' ? faq.isOfficial :
      !faq.isOfficial;

    return answerMatch && officialMatch;
  });

  const handleAddQuestion = () => {
    if (newQuestion) {
      const newFaq: FAQ = {
        id: faqs.length + 1,
        question: newQuestion,
        answer: newAnswer || null,
        isOfficial: false,
      };
      setFaqs([...faqs, newFaq]);
      setNewQuestion('');
      setNewAnswer('');
      setIsDialogOpen(false);
    }
  };

  const toggleOfficial = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isOfficial: !faq.isOfficial } : faq
    ));
  };

  const startEditing = (id: number, answer: string | null) => {
    setEditingId(id);
    setEditedAnswer(answer || '');
  };

  const saveAnswer = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, answer: editedAnswer || null } : faq
    ));
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">FAQ Management</h1>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex gap-2">
          <Select onValueChange={(value) => setAnswerFilter(value as 'all' | 'answered' | 'unanswered')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setOfficialFilter(value as 'all' | 'official' | 'unofficial')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All FAQs</SelectItem>
              <SelectItem value="official">Official</SelectItem>
              <SelectItem value="unofficial">Unofficial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Question</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
              <DialogDescription>
                Enter the new question and its answer (if available).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  Question
                </Label>
                <Input
                  id="question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="answer" className="text-right">
                  Answer
                </Label>
                <Textarea
                  id="answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddQuestion}>Add FAQ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFaqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell className="font-medium">{faq.question}</TableCell>
              <TableCell>
                {editingId === faq.id ? (
                  <Textarea
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p>{faq.answer || 'No answer provided'}</p>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-2">
                  {editingId === faq.id ? (
                    <Button onClick={() => saveAnswer(faq.id)} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => startEditing(faq.id, faq.answer)} size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Checkbox
                    checked={faq.isOfficial}
                    onCheckedChange={() => toggleOfficial(faq.id)}
                    aria-label={`Mark as official: ${faq.question}`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}