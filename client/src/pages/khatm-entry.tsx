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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { StudentSelector } from "@/components/student-selector";
import { StarRating } from "@/components/star-rating";
import { BookOpen, Save, RotateCcw, Clock, Calendar } from "lucide-react";
import type { Student } from "@shared/schema";

const formSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  recitationType: z.enum([
    "1_para", 
    "2_3_paras", 
    "4_5_paras", 
    "10_paras", 
    "half_quran", 
    "full_quran", 
    "final_recitation"
  ]),
  parasCovered: z.array(z.number()).min(1, "Please select at least one para"),
  date: z.string().min(1, "Please select a date"),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, "Please enter duration in HH:MM format"),
  fluencyScore: z.number().min(1).max(5).optional(),
  accuracyScore: z.number().min(1).max(5).optional(),
  tajweedScore: z.number().min(1).max(5).optional(),
  mistakes: z.string().optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const recitationTypes = [
  { value: "1_para", label: "1 Para Recitation", description: "Single para recitation" },
  { value: "2_3_paras", label: "2–3 Paras Recitation", description: "Short session" },
  { value: "4_5_paras", label: "4–5 Paras Recitation", description: "Medium session" },
  { value: "10_paras", label: "10 Paras Recitation", description: "Extended session" },
  { value: "half_quran", label: "Half Qur'an (15 Paras)", description: "Half completion" },
  { value: "full_quran", label: "Full Qur'an (30 Paras)", description: "Complete in one sitting" },
  { value: "final_recitation", label: "Final Recitation", description: "Certified/Public recitation" },
];

const mistakeTags = [
  "Fluent delivery",
  "Minor stumbles", 
  "Repeats required",
  "Excellent retention",
  "Needs breath control",
  "Perfect flow",
  "Good pace",
  "Needs improvement",
  "Outstanding performance"
];

export default function KhatmEntry() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      recitationType: "1_para",
      parasCovered: [],
      date: new Date().toISOString().split('T')[0],
      duration: "01:00",
      fluencyScore: undefined,
      accuracyScore: undefined,
      tajweedScore: undefined,
      mistakes: "",
      remarks: "",
    },
  });

  const recitationType = form.watch("recitationType");
  const parasCovered = form.watch("parasCovered");

  // Auto-populate student data when student changes
  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.studentId);
    }
  }, [selectedStudent, form]);

  // Auto-select paras based on recitation type
  useEffect(() => {
    if (recitationType && selectedStudent) {
      const totalParas = selectedStudent.totalParas;
      let suggestedParas: number[] = [];
      
      switch (recitationType) {
        case "1_para":
          suggestedParas = [1];
          break;
        case "2_3_paras":
          suggestedParas = [1, 2, 3];
          break;
        case "4_5_paras":
          suggestedParas = [1, 2, 3, 4, 5];
          break;
        case "10_paras":
          suggestedParas = Array.from({ length: Math.min(10, totalParas) }, (_, i) => i + 1);
          break;
        case "half_quran":
          suggestedParas = Array.from({ length: Math.min(15, totalParas) }, (_, i) => i + 1);
          break;
        case "full_quran":
          suggestedParas = Array.from({ length: Math.min(30, totalParas) }, (_, i) => i + 1);
          break;
        case "final_recitation":
          suggestedParas = Array.from({ length: totalParas }, (_, i) => i + 1);
          break;
      }
      
      // Only include paras that are memorized
      const availableParas = suggestedParas.filter(para => para <= totalParas);
      form.setValue("parasCovered", availableParas);
    }
  }, [recitationType, selectedStudent, form]);

  const createKhatmEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        section: "Hifz",
        taskType: "Khatm Recitation",
        parasRevised: data.parasCovered,
        para: null,
        fromPage: null,
        toPage: null,
        pagesRead: null,
      };
      return apiRequest("POST", "/api/hifz-entries", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Khatm recitation entry has been saved successfully.",
      });
      form.reset({
        studentId: "",
        recitationType: "1_para",
        parasCovered: [],
        date: new Date().toISOString().split('T')[0],
        duration: "01:00",
        fluencyScore: undefined,
        accuracyScore: undefined,
        tajweedScore: undefined,
        mistakes: "",
        remarks: "",
      });
      setSelectedStudent(null);
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["/api/hifz-entries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save Khatm entry.",
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

    // Ensure we only allow Hifz section students
    if (selectedStudent.section !== "Hifz") {
      toast({
        title: "Error",
        description: "Selected student is not in Hifz section.",
        variant: "destructive",
      });
      return;
    }

    createKhatmEntryMutation.mutate(data);
  };

  const handleTagClick = (tag: string) => {
    const currentMistakes = form.getValues("mistakes") || "";
    const isSelected = selectedTags.includes(tag);
    
    if (isSelected) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
      const newMistakes = currentMistakes.replace(tag + ". ", "").replace(tag, "").trim();
      form.setValue("mistakes", newMistakes);
    } else {
      setSelectedTags(prev => [...prev, tag]);
      const newMistakes = currentMistakes ? `${currentMistakes}. ${tag}` : tag;
      form.setValue("mistakes", newMistakes);
    }
  };

  const handleReset = () => {
    form.reset({
      studentId: "",
      recitationType: "1_para",
      parasCovered: [],
      date: new Date().toISOString().split('T')[0],
      duration: "01:00",
      fluencyScore: undefined,
      accuracyScore: undefined,
      tajweedScore: undefined,
      mistakes: "",
      remarks: "",
    });
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
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Khatm-ul-Qur'an Phase Entry</h2>
                <p className="text-amber-100 text-sm">Progressive Full Quran Recitation Tracking</p>
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
                    <BookOpen className="text-amber-600 mr-2 h-4 w-4" />
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
                        Total Paras Memorized
                      </label>
                      <div className="bg-white px-3 py-2 rounded border border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{selectedStudent.totalParas}</span>
                        <span className="text-xs text-gray-500 ml-2">Available for Recitation</span>
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

                {/* Recitation Type Selection */}
                <FormField
                  control={form.control}
                  name="recitationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-amber-600 mr-2 h-4 w-4" />
                        Recitation Stage / Type
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recitation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {recitationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Session Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Calendar className="text-amber-600 mr-2 h-4 w-4" />
                          Recitation Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="text-amber-600 mr-2 h-4 w-4" />
                          Duration (HH:MM)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="02:15"
                            pattern="^\d{1,2}:\d{2}$"
                          />
                        </FormControl>
                        <div className="text-xs text-gray-500 mt-1">
                          Example: 02:15 for 2 hours 15 minutes
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Paras Covered */}
                <FormField
                  control={form.control}
                  name="parasCovered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paras Covered in Recitation</FormLabel>
                      <div className="bg-white border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-2">
                          {Array.from({ length: 30 }, (_, i) => i + 1).map((paraNum) => {
                            const isMemorized = selectedStudent ? paraNum <= selectedStudent.totalParas : false;
                            const isSelected = Array.isArray(field.value) && field.value.includes(paraNum);
                            
                            return (
                              <label 
                                key={paraNum} 
                                className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                                  isMemorized ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  disabled={!isMemorized}
                                  onCheckedChange={(checked) => {
                                    if (!isMemorized) return;
                                    
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    if (checked) {
                                      field.onChange([...currentValue, paraNum].sort((a, b) => a - b));
                                    } else {
                                      field.onChange(currentValue.filter((p) => p !== paraNum));
                                    }
                                  }}
                                />
                                <span className={`text-sm ${isMemorized ? '' : 'text-gray-400'}`}>
                                  {paraNum}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Selected:</span>{" "}
                            {Array.isArray(field.value) && field.value.length > 0 
                              ? `Para ${field.value.join(", ")} (${field.value.length} paras)`
                              : "None selected"
                            }
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Scoring Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fluencyScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fluency Score (Optional)</FormLabel>
                        <div className="flex flex-col items-center space-y-2">
                          <StarRating
                            rating={field.value || 0}
                            onRatingChange={field.onChange}
                          />
                          <span className="text-sm text-gray-600">
                            {field.value ? `${field.value}/5` : "0/5"}
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accuracyScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accuracy Score (Optional)</FormLabel>
                        <div className="flex flex-col items-center space-y-2">
                          <StarRating
                            rating={field.value || 0}
                            onRatingChange={field.onChange}
                          />
                          <span className="text-sm text-gray-600">
                            {field.value ? `${field.value}/5` : "0/5"}
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tajweedScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tajweed Score (Optional)</FormLabel>
                        <div className="flex flex-col items-center space-y-2">
                          <StarRating
                            rating={field.value || 0}
                            onRatingChange={field.onChange}
                          />
                          <span className="text-sm text-gray-600">
                            {field.value ? `${field.value}/5` : "0/5"}
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mistake Observations */}
                <FormField
                  control={form.control}
                  name="mistakes"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-amber-600 mr-2 h-4 w-4" />
                        Mistake Observations / Performance Tags
                      </FormLabel>
                      
                      {/* Preset Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mistakeTags.map((tag) => (
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
                          rows={3}
                          placeholder="Describe any mistakes, stumbles, or notable observations during the recitation..."
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Teacher Remarks */}
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-amber-600 mr-2 h-4 w-4" />
                        Teacher Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Additional teacher comments, recommendations for next session, or certification notes..."
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
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                    disabled={createKhatmEntryMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createKhatmEntryMutation.isPending ? "Saving..." : "Submit Khatm Entry"}
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