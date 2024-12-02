'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialFaqData = [
  {
    question: "How do I file a report using the AI system?",
    answer: "To file a report, log in to your account or register and proceed to reporting submission page. Choose the Speech to Text recognition provided by our AI system to input all necessary information. Once complete, submit the report for processing."
  },
  {
    question: "How do I contact IT support?",
    answer: "You can contact our customer support team via email at zalhazmi@gmail.com or call us at (123) 456-7890. Our support hours are Monday to Friday, 9 AM to 6 PM."
  },
  {
    question: "What types of incidents can I report?",
    answer: "You can report various incidents, including theft, vandalism, assault, traffic accidents, and more."
  },
  {
    question: "Is my information secure?",
    answer: "Yes, your information is secure. Our AI police reporting system uses advanced encryption and security protocols to ensure that your data is protected at all times."
  },
  {
    question: "Can I edit a report after submission?",
    answer: "If you need to make changes to a report after submission, please contact our support team as soon as possible. They can assist you in updating the report if it is still in the review stage."
  },
]

export default function FrequentlyAskedQuestions() {
  const [faqData, setFaqData] = useState(initialFaqData)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddQuestion = () => {
    if (newQuestion && newAnswer) {
      setFaqData([...faqData, { question: newQuestion, answer: newAnswer }])
      setNewQuestion('')
      setNewAnswer('')
      setIsDialogOpen(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-w-[375px] max-w-[1200px] mx-auto mt-[15vh]'>
      <div className='mx-2 w-full'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-[6vh]">
          Frequently Asked Questions
        </h1>

        <div className="flex w-full max-w-sm items-center space-x-2 mx-auto mb-7">
          <Input type="text" placeholder="Type here..." />
          <Button type="submit">
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <span className="font-bold mr-2">Q{index + 1}:</span> {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-justify">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className='mb-48'></div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className='fixed md:bottom-[4%] bottom-[5%] md:right-[13%] right-[10%] rounded-full w-[50px] h-[50px] sm:w-[75px] sm:h-[75px]'
            size="icon"
          >
            <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="sr-only">Add new question</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Enter the new question and its answer here. Click save when you&apos;re done.
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
            <Button type="submit" onClick={handleAddQuestion}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}