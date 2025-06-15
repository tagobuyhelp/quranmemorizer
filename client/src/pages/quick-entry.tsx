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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { StudentSelector } from "@/components/student-selector";
import { StarRating } from "@/components/star-rating";
import { BookOpen, Save, Zap, Clock } from "lucide-react";
import type { Student, ParaData } from "@shared/schema";

const quickFormSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  section: z.enum(["Hifz", "Najera", "Noorani Qaida"]),
  taskType: z.string().min(1, "Please select task type"),
  primaryValue: z.number().min(1, "Required field"),
  secondaryValue: z.number().optional(),
  accuracyScore: z.number().min(1).max(5).optional(),
  quickRemarks: z.string().optional(),
});

type QuickFormData = z.infer<typeof quickFormSchema>;

const quickTags = [
  "Excellent", "Good", "Needs work", "Progress", "Review needed", "Outstanding"
];

export default function QuickEntry() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuickFormData>({
    resolver: zodResolver(quickFormSchema),
    defaultValues: {
      studentId: "",
      section: "Hifz",
      taskType: "",
      primaryValue: 1,
      secondaryValue: undefined,
      accuracyScore: undefined,
      quickRemarks: "",
    },
  });

  const section = form.watch("section");
  const taskType = form.watch("taskType");

  // Fetch para data
  const { data: paraData = [] } = useQuery<ParaData[]>({
    queryKey: ["/api/paras"],
  });

  // Auto-populate student data and section
  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.studentId);
      form.setValue("section", selectedStudent.section as any);
    }
  }, [selectedStudent, form]);

  // Get task types based on section
  const getTaskTypes = (section: string) => {
    switch (section) {
      case "Hifz":
        return [
          { value: "sabaq", label: "Sabaq (New)" },
          { value: "ammapara", label: "Ammapara (Full Para)" },
          { value: "amukta", label: "Amukta (Revision)" },
        ];
      case "Najera":
        return [
          { value: "fluent_reading", label: "Fluent Reading" },
          { value: "revision", label: "Revision" },
        ];
      case "Noorani Qaida":
        return [
          { value: "new_lesson", label: "New Lesson" },
          { value: "revision", label: "Revision" },
          { value: "tajweed_practice", label: "Tajweed Practice" },
        ];
      default:
        return [];
    }
  };

  // Get field labels based on section and task type
  const getFieldLabels = () => {
    if (section === "Hifz") {
      return {
        primary: taskType === "amukta" ? "Paras Revised" : "Para Number",
        secondary: taskType === "sabaq" ? "Pages Read" : undefined,
      };
    } else if (section === "Najera") {
      return {
        primary: "Para Number",
        secondary: "Pages Read",
      };
    } else if (section === "Noorani Qaida") {
      return {
        primary: "Lesson Number",
        secondary: undefined,
      };
    }
    return { primary: "Value", secondary: undefined };
  };

  const fieldLabels = getFieldLabels();

  const createQuickEntryMutation = useMutation({
    mutationFn: async (data: QuickFormData) => {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Convert quick form data to appropriate format
      let payload: any = {
        studentId: data.studentId,
        date: currentDate,
        section: data.section,
        taskType: data.taskType,
        accuracyScore: data.accuracyScore,
        remarks: data.quickRemarks,
      };

      // Set specific fields based on section and task type
      if (data.section === "Hifz") {
        if (data.taskType === "sabaq") {
          payload.para = data.primaryValue;
          payload.pagesRead = data.secondaryValue || 1;
          payload.fromPage = null;
          payload.toPage = null;
        } else if (data.taskType === "ammapara") {
          payload.para = data.primaryValue;
          const paraInfo = paraData.find(p => p.paraNumber === data.primaryValue);
          payload.pagesRead = paraInfo?.totalPages || 20;
          payload.fromPage = paraInfo?.startPage || 1;
          payload.toPage = paraInfo?.endPage || 20;
        } else if (data.taskType === "amukta") {
          payload.parasRevised = [data.primaryValue];
          payload.para = null;
          payload.pagesRead = null;
          payload.fromPage = null;
          payload.toPage = null;
        }
      } else if (data.section === "Najera") {
        payload.para = data.primaryValue;
        payload.pagesRead = data.secondaryValue || 1;
        payload.parasRevised = null;
        payload.fromPage = null;
        payload.toPage = null;
      } else if (data.section === "Noorani Qaida") {
        payload.lessonNumber = data.primaryValue;
        payload.para = null;
        payload.pagesRead = null;
        payload.parasRevised = null;
        payload.fromPage = null;
        payload.toPage = null;
      }

      return apiRequest("POST", "/api/hifz-entries", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Quick entry saved successfully.",
      });
      form.reset();
      setSelectedStudent(null);
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["/api/hifz-entries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save entry.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuickFormData) => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student.",
        variant: "destructive",
      });
      return;
    }
    createQuickEntryMutation.mutate(data);
  };

  const handleTagClick = (tag: string) => {
    const currentRemarks = form.getValues("quickRemarks") || "";
    const isSelected = selectedTags.includes(tag);
    
    if (isSelected) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
      const newRemarks = currentRemarks.replace(tag + ". ", "").replace(tag, "").trim();
      form.setValue("quickRemarks", newRemarks);
    } else {
      setSelectedTags(prev => [...prev, tag]);
      const newRemarks = currentRemarks ? `${currentRemarks}. ${tag}` : tag;
      form.setValue("quickRemarks", newRemarks);
    }
  };

  return (
    <div className="min-h-screen bg-neutral">
      <main className="max-w-2xl mx-auto px-4 py-4">
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Quick Entry</h2>
                  <p className="text-emerald-100 text-sm">Fast mobile progress tracking</p>
                </div>
              </div>
              <Clock className="h-5 w-5 text-emerald-100" />
            </div>
          </div>

          {/* Form Body */}
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Student Selection */}
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                    <BookOpen className="text-emerald-600 mr-2 h-4 w-4" />
                    Student
                  </FormLabel>
                  <StudentSelector
                    selectedStudent={selectedStudent}
                    onSelect={setSelectedStudent}
                  />
                </div>

                {/* Section Display */}
                {selectedStudent && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Section
                    </div>
                    <div className="text-sm font-medium text-gray-900">{selectedStudent.section}</div>
                  </div>
                )}

                {/* Task Type */}
                <FormField
                  control={form.control}
                  name="taskType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="touch-target">
                            <SelectValue placeholder="Select task type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getTaskTypes(section).map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Primary Value */}
                <FormField
                  control={form.control}
                  name="primaryValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldLabels.primary}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          className="touch-target text-lg"
                          min="1"
                          max={section === "Noorani Qaida" ? "30" : "30"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Secondary Value (if applicable) */}
                {fieldLabels.secondary && (
                  <FormField
                    control={form.control}
                    name="secondaryValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldLabels.secondary}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            className="touch-target text-lg"
                            min="1"
                            placeholder="Optional"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Accuracy Score */}
                <FormField
                  control={form.control}
                  name="accuracyScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accuracy Score (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center py-2">
                          <StarRating
                            rating={field.value || 0}
                            onRatingChange={field.onChange}
                            size="lg"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quick Tags */}
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Quick Notes
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {quickTags.map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        className="touch-target justify-start text-sm"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Remarks */}
                <FormField
                  control={form.control}
                  name="quickRemarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={2}
                          placeholder="Brief remarks..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full touch-target bg-emerald-600 hover:bg-emerald-700"
                  disabled={createQuickEntryMutation.isPending}
                  size="lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createQuickEntryMutation.isPending ? "Saving..." : "Quick Save"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}