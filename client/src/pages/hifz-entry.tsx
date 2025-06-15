import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { StudentSelector } from "@/components/student-selector";
import { TaskFields } from "@/components/task-fields";
import { StarRating } from "@/components/star-rating";
import { BookOpen, Save, RotateCcw, Edit } from "lucide-react";
import type { Student, ParaData } from "@shared/schema";

const formSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  taskType: z.enum(["sabaq", "ammapara", "amukta"]),
  para: z.number().optional(),
  fromPage: z.number().optional(),
  toPage: z.number().optional(),
  pagesRead: z.number().optional(),
  parasRevised: z.array(z.number()).optional(),
  accuracyScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const presetTags = [
  "Good fluency",
  "Needs revision",
  "Tajweed errors",
  "Excellent progress",
  "Concentration issues",
  "Memorization strong",
  "Requires practice",
  "Outstanding performance"
];

export default function HifzEntry() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      taskType: "sabaq",
      para: undefined,
      fromPage: undefined,
      toPage: undefined,
      pagesRead: undefined,
      parasRevised: [],
      accuracyScore: undefined,
      remarks: "",
    },
  });

  const taskType = form.watch("taskType");
  const para = form.watch("para");
  const fromPage = form.watch("fromPage");
  const toPage = form.watch("toPage");

  // Fetch para data
  const { data: paraData = [] } = useQuery<ParaData[]>({
    queryKey: ["/api/paras"],
  });

  // Calculate pages read automatically
  useEffect(() => {
    if (taskType === "sabaq" && fromPage && toPage && fromPage <= toPage) {
      form.setValue("pagesRead", toPage - fromPage + 1);
    } else if (taskType === "ammapara" && para) {
      const paraInfo = paraData.find(p => p.paraNumber === para);
      if (paraInfo) {
        form.setValue("pagesRead", paraInfo.totalPages);
        form.setValue("fromPage", paraInfo.startPage);
        form.setValue("toPage", paraInfo.endPage);
      }
    }
  }, [taskType, fromPage, toPage, para, paraData, form]);

  // Auto-populate para and page data when student changes
  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.studentId);

      if (taskType === "sabaq" || taskType === "ammapara") {
        form.setValue("para", selectedStudent.currentPara);
      }
    }
  }, [selectedStudent, taskType, form]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const payload = {
        ...data,
        date: currentDate,
        section: selectedStudent?.section || "Hifz",
      };
      return apiRequest("POST", "/api/hifz-entries", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Progress entry has been saved successfully.",
      });
      form.reset();
      setSelectedStudent(null);
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["/api/hifz-entries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save progress entry.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student.",
        variant: "destructive",
      });
      return;
    }
    createEntryMutation.mutate(data);
  };

  const handleTagClick = (tag: string) => {
    const currentRemarks = form.getValues("remarks") || "";
    const isSelected = selectedTags.includes(tag);
    
    if (isSelected) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
      const newRemarks = currentRemarks.replace(tag + ". ", "").replace(tag, "").trim();
      form.setValue("remarks", newRemarks);
    } else {
      setSelectedTags(prev => [...prev, tag]);
      const newRemarks = currentRemarks ? `${currentRemarks}. ${tag}` : tag;
      form.setValue("remarks", newRemarks);
    }
  };

  const handleReset = () => {
    form.reset();
    setSelectedStudent(null);
    setSelectedTags([]);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Daily Progress Entry</h2>
                <p className="text-blue-100 text-sm">Auto-Section Detection Active</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">Today: {getCurrentDate()}</span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <CardContent className="p-4 md:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                {/* Student Selection */}
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    <BookOpen className="text-primary mr-2 h-4 w-4" />
                    Select Student
                  </FormLabel>
                  <StudentSelector
                    selectedStudent={selectedStudent}
                    onSelect={setSelectedStudent}
                  />
                </div>

                {/* Auto-populated Student Details */}
                {selectedStudent && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Section
                      </label>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{selectedStudent.section}</span>
                        <span className="text-xs text-gray-500 ml-2">(Read-only)</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Current Para
                      </label>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{selectedStudent.currentPara}</span>
                        <span className="text-xs text-gray-500 ml-2">Currently Memorizing</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        Assigned Teacher
                      </label>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{selectedStudent.teacher}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Task Type Selection */}
                <FormField
                  control={form.control}
                  name="taskType"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-primary mr-2 h-4 w-4" />
                        Task Type
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-1 gap-3"
                        >
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 touch-target has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value="sabaq" id="sabaq" />
                            <div className="flex-1">
                              <label htmlFor="sabaq" className="font-medium text-gray-900 cursor-pointer block">
                                Sabaq
                              </label>
                              <div className="text-xs text-gray-500">New Lesson</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 touch-target has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value="ammapara" id="ammapara" />
                            <div className="flex-1">
                              <label htmlFor="ammapara" className="font-medium text-gray-900 cursor-pointer block">
                                Ammapara
                              </label>
                              <div className="text-xs text-gray-500">Full Para Review</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 touch-target has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value="amukta" id="amukta" />
                            <div className="flex-1">
                              <label htmlFor="amukta" className="font-medium text-gray-900 cursor-pointer block">
                                Amukta
                              </label>
                              <div className="text-xs text-gray-500">Revision Test</div>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dynamic Task Fields */}
                <TaskFields
                  form={form}
                  taskType={taskType}
                  selectedStudent={selectedStudent}
                  paraData={paraData}
                />

                {/* Universal Accuracy Score */}
                <FormField
                  control={form.control}
                  name="accuracyScore"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-accent mr-2 h-4 w-4" />
                        Overall Accuracy Score (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <StarRating
                            rating={field.value || 0}
                            onRatingChange={field.onChange}
                          />
                          <span className="text-lg font-medium text-gray-700">
                            {field.value ? `${field.value}/5` : "0/5"}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remarks Section */}
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-primary mr-2 h-4 w-4" />
                        Remarks / Observations
                      </FormLabel>
                      
                      {/* Preset Tags */}
                      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 mb-3">
                        {presetTags.map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            size="sm"
                            className="text-xs touch-target justify-start"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                      
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Enter your observations about the student's performance today..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Form Actions */}
                <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="w-full touch-target"
                    disabled={createEntryMutation.isPending}
                    size="lg"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createEntryMutation.isPending ? "Saving..." : "Submit Progress Entry"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="w-full touch-target"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="sm:w-auto px-6"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
