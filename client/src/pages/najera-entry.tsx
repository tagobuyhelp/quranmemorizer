import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { StudentSelector } from "@/components/student-selector";
import { StarRating } from "@/components/star-rating";
import { BookOpen, Save, RotateCcw } from "lucide-react";
import type { Student, ParaData } from "@shared/schema";

const formSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  taskType: z.enum(["fluent_reading", "revision"]),
  para: z.number().min(1).max(30),
  fromPage: z.number().min(1),
  toPage: z.number().min(1),
  pagesRead: z.number().min(1),
  accuracyScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const presetTags = [
  "Good fluency",
  "Needs tajweed correction",
  "Excellent pronunciation",
  "Reading pace good",
  "Requires practice",
  "Clear articulation",
  "Smooth flow",
  "Needs improvement"
];

export default function NajeraEntry() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      taskType: "fluent_reading",
      para: 1,
      fromPage: 1,
      toPage: 1,
      pagesRead: 1,
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

  // Get page options for selected para
  const getPageOptions = (paraNumber: number) => {
    const paraInfo = paraData.find(p => p.paraNumber === paraNumber);
    if (!paraInfo) return [];
    
    const options = [];
    for (let i = paraInfo.startPage; i <= paraInfo.endPage; i++) {
      options.push(i);
    }
    return options;
  };

  // Get available page options for "To Page" based on "From Page"
  const getToPageOptions = (paraNumber: number, fromPageNum?: number) => {
    const paraInfo = paraData.find(p => p.paraNumber === paraNumber);
    if (!paraInfo) return [];
    
    const startPage = fromPageNum || paraInfo.startPage;
    const options = [];
    for (let i = startPage; i <= paraInfo.endPage; i++) {
      options.push(i);
    }
    return options;
  };

  // Calculate pages read automatically
  useEffect(() => {
    if (fromPage && toPage && fromPage <= toPage) {
      form.setValue("pagesRead", toPage - fromPage + 1);
    }
  }, [fromPage, toPage, form]);

  // Auto-populate student data when student changes
  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.studentId);
    }
  }, [selectedStudent, form]);

  // Reset dependent fields when para changes
  useEffect(() => {
    if (para) {
      const paraInfo = paraData.find(p => p.paraNumber === para);
      if (paraInfo) {
        form.setValue("fromPage", paraInfo.startPage);
        form.setValue("toPage", paraInfo.startPage);
        form.setValue("pagesRead", 1);
      }
    }
  }, [para, paraData, form]);

  // Reset "To Page" when "From Page" changes
  useEffect(() => {
    if (fromPage && toPage && fromPage > toPage) {
      form.setValue("toPage", fromPage);
      form.setValue("pagesRead", 1);
    }
  }, [fromPage, form, toPage]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const payload = {
        ...data,
        date: currentDate,
        section: "Najera",
        taskType: data.taskType === "fluent_reading" ? "Fluent Reading" : "Revision",
      };
      return apiRequest("POST", "/api/hifz-entries", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Najera entry has been saved successfully.",
      });
      form.reset();
      setSelectedStudent(null);
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["/api/hifz-entries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save Najera entry.",
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

    // Ensure we only allow Najera section students
    if (selectedStudent.section !== "Najera") {
      toast({
        title: "Error",
        description: "Selected student is not in Najera section.",
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Daily Reading Entry</h2>
                <p className="text-green-100 text-sm">Auto-Section Detection Active</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">Today: {getCurrentDate()}</span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Selection */}
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    <BookOpen className="text-green-600 mr-2 h-4 w-4" />
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
                        <span className="text-xs text-gray-500 ml-2">Current Reading</span>
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
                        <BookOpen className="text-green-600 mr-2 h-4 w-4" />
                        Task Type
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
                            <RadioGroupItem value="fluent_reading" id="fluent_reading" />
                            <div>
                              <label htmlFor="fluent_reading" className="font-medium text-gray-900 cursor-pointer">
                                Fluent Reading
                              </label>
                              <div className="text-xs text-gray-500">New Reading Session</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 has-[:checked]:border-green-600 has-[:checked]:bg-green-50">
                            <RadioGroupItem value="revision" id="revision" />
                            <div>
                              <label htmlFor="revision" className="font-medium text-gray-900 cursor-pointer">
                                Revision
                              </label>
                              <div className="text-xs text-gray-500">Review Previous Reading</div>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reading Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="para"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Para Number</FormLabel>
                          <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select para" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 30 }, (_, i) => i + 1).map((paraNum) => (
                                <SelectItem key={paraNum} value={paraNum.toString()}>
                                  {paraNum} {selectedStudent?.currentPara === paraNum && "(Current)"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pagesRead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pages Read</FormLabel>
                          <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                            <span className="text-sm font-medium text-gray-900">
                              {field.value || 0}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">(Auto-calculated)</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="fromPage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Page</FormLabel>
                          <Select 
                            value={field.value?.toString()} 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select from page" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getPageOptions(para).map((pageNum) => (
                                <SelectItem key={pageNum} value={pageNum.toString()}>
                                  {pageNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="toPage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Page</FormLabel>
                          <Select 
                            value={field.value?.toString()} 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select to page" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getToPageOptions(para, fromPage).map((pageNum) => (
                                <SelectItem key={pageNum} value={pageNum.toString()}>
                                  {pageNum}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Universal Accuracy Score */}
                <FormField
                  control={form.control}
                  name="accuracyScore"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-green-600 mr-2 h-4 w-4" />
                        Fluency & Accuracy Score (Optional)
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
                        <BookOpen className="text-green-600 mr-2 h-4 w-4" />
                        Remarks / Observations
                      </FormLabel>
                      
                      {/* Preset Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {presetTags.map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
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
                          placeholder="Enter your observations about the student's reading performance today..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={createEntryMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createEntryMutation.isPending ? "Saving..." : "Submit Reading Entry"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Form
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