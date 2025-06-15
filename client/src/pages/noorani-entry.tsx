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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { StudentSelector } from "@/components/student-selector";
import { StarRating } from "@/components/star-rating";
import { BookOpen, Save, RotateCcw } from "lucide-react";
import type { Student } from "@shared/schema";

const formSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  taskType: z.enum(["new_lesson", "revision", "tajweed_practice"]),
  lessonNumber: z.number().min(1).max(50),
  readingMaterial: z.string().optional(),
  accuracyScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const presetTags = [
  "Good fluency",
  "Difficulty with noon sakin",
  "Needs to focus on madd letters",
  "Excellent qalqala",
  "Requires ghunna practice",
  "Clear articulation",
  "Slow but accurate",
  "Good progress on sukoon",
  "Needs more tajweed focus",
  "Perfect pronunciation"
];

// Noorani Qaida lesson structure
const nooraniLessons = [
  { lesson: 1, title: "Arabic Alphabet - First Group", description: "Alif, Baa, Taa, Thaa" },
  { lesson: 2, title: "Arabic Alphabet - Second Group", description: "Jeem, Haa, Khaa" },
  { lesson: 3, title: "Arabic Alphabet - Third Group", description: "Daal, Dhaal, Raa, Zaa" },
  { lesson: 4, title: "Arabic Alphabet - Fourth Group", description: "Seen, Sheen, Saad, Daad" },
  { lesson: 5, title: "Arabic Alphabet - Fifth Group", description: "Taa, Thaa, Ain, Ghain" },
  { lesson: 6, title: "Arabic Alphabet - Sixth Group", description: "Faa, Qaaf, Kaaf, Laam" },
  { lesson: 7, title: "Arabic Alphabet - Final Group", description: "Meem, Noon, Waaw, Haa, Yaa" },
  { lesson: 8, title: "Letter Connections", description: "Joining letters in different positions" },
  { lesson: 9, title: "Short Vowels - Fatha", description: "Reading with Fatha movement" },
  { lesson: 10, title: "Short Vowels - Kasra", description: "Reading with Kasra movement" },
  { lesson: 11, title: "Short Vowels - Damma", description: "Reading with Damma movement" },
  { lesson: 12, title: "Mixed Short Vowels", description: "Combining Fatha, Kasra, Damma" },
  { lesson: 13, title: "Sukoon (Jazm)", description: "Letters without vowels" },
  { lesson: 14, title: "Long Vowels - Alif Madd", description: "Extending with Alif" },
  { lesson: 15, title: "Long Vowels - Waaw Madd", description: "Extending with Waaw" },
  { lesson: 16, title: "Long Vowels - Yaa Madd", description: "Extending with Yaa" },
  { lesson: 17, title: "Tanween - Fathatan", description: "Double Fatha sound" },
  { lesson: 18, title: "Tanween - Kasratan", description: "Double Kasra sound" },
  { lesson: 19, title: "Tanween - Dammatan", description: "Double Damma sound" },
  { lesson: 20, title: "Shaddah", description: "Double letters with emphasis" },
  { lesson: 21, title: "Madd Letters Practice", description: "Extended pronunciation rules" },
  { lesson: 22, title: "Noon Sakin Rules", description: "Silent Noon pronunciation" },
  { lesson: 23, title: "Meem Sakin Rules", description: "Silent Meem pronunciation" },
  { lesson: 24, title: "Qalqala Letters", description: "Echoing sound letters" },
  { lesson: 25, title: "Lam Rules", description: "Different Lam pronunciations" },
  { lesson: 26, title: "Ra Rules", description: "Thick and thin Ra" },
  { lesson: 27, title: "Basic Tajweed Rules", description: "Fundamental recitation rules" },
  { lesson: 28, title: "Waqf (Stopping)", description: "Proper stopping in recitation" },
  { lesson: 29, title: "Advanced Practice", description: "Complex combinations" },
  { lesson: 30, title: "Final Assessment", description: "Complete Qaida review" },
];

export default function NooraniEntry() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      taskType: "new_lesson",
      lessonNumber: 1,
      readingMaterial: "",
      accuracyScore: undefined,
      remarks: "",
    },
  });

  const taskType = form.watch("taskType");
  const lessonNumber = form.watch("lessonNumber");

  // Auto-populate student data when student changes
  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.studentId);
    }
  }, [selectedStudent, form]);

  const createEntryMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const payload = {
        ...data,
        date: currentDate,
        section: "Noorani Qaida",
        taskType: data.taskType === "new_lesson" ? "New Lesson" : 
                  data.taskType === "revision" ? "Revision" : "Tajweed Practice",
        para: null, // Not applicable for Noorani Qaida
        fromPage: null,
        toPage: null,
        pagesRead: null,
        parasRevised: null,
      };
      return apiRequest("POST", "/api/hifz-entries", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Noorani Qaida entry has been saved successfully.",
      });
      form.reset();
      setSelectedStudent(null);
      setSelectedTags([]);
      queryClient.invalidateQueries({ queryKey: ["/api/hifz-entries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save Noorani Qaida entry.",
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

    // Ensure we only allow Noorani Qaida section students
    if (selectedStudent.section !== "Noorani Qaida") {
      toast({
        title: "Error",
        description: "Selected student is not in Noorani Qaida section.",
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

  const selectedLesson = nooraniLessons.find(l => l.lesson === lessonNumber);

  return (
    <div className="min-h-screen bg-neutral">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Noorani Qaida Progress Entry</h2>
                <p className="text-purple-100 text-sm">Arabic Reading & Tajweed Training</p>
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
                    <BookOpen className="text-purple-600 mr-2 h-4 w-4" />
                    Select Student
                  </FormLabel>
                  <StudentSelector
                    selectedStudent={selectedStudent}
                    onSelect={setSelectedStudent}
                  />
                </div>

                {/* Auto-populated Student Details */}
                {selectedStudent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                        <BookOpen className="text-purple-600 mr-2 h-4 w-4" />
                        Task Type
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50">
                            <RadioGroupItem value="new_lesson" id="new_lesson" />
                            <div>
                              <label htmlFor="new_lesson" className="font-medium text-gray-900 cursor-pointer">
                                New Lesson
                              </label>
                              <div className="text-xs text-gray-500">Learning new letters/rules</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50">
                            <RadioGroupItem value="revision" id="revision" />
                            <div>
                              <label htmlFor="revision" className="font-medium text-gray-900 cursor-pointer">
                                Revision
                              </label>
                              <div className="text-xs text-gray-500">Reviewing earlier lessons</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 border-2 border-gray-300 rounded-lg p-4 has-[:checked]:border-purple-600 has-[:checked]:bg-purple-50">
                            <RadioGroupItem value="tajweed_practice" id="tajweed_practice" />
                            <div>
                              <label htmlFor="tajweed_practice" className="font-medium text-gray-900 cursor-pointer">
                                Tajweed Practice
                              </label>
                              <div className="text-xs text-gray-500">Pronunciation focus</div>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lesson Details */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="lessonNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson Number</FormLabel>
                        <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lesson" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nooraniLessons.map((lesson) => (
                              <SelectItem key={lesson.lesson} value={lesson.lesson.toString()}>
                                Lesson {lesson.lesson}: {lesson.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lesson Description */}
                  {selectedLesson && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-1">{selectedLesson.title}</h4>
                      <p className="text-sm text-purple-700">{selectedLesson.description}</p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="readingMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Material Practiced (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Describe specific words, sentences, or exercises practiced in this lesson..."
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Accuracy & Tajweed Score */}
                <FormField
                  control={form.control}
                  name="accuracyScore"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <BookOpen className="text-purple-600 mr-2 h-4 w-4" />
                        Accuracy & Tajweed Score (Optional)
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
                      <div className="text-xs text-gray-500 mt-1">
                        Rate pronunciation accuracy and tajweed rule application
                      </div>
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
                        <BookOpen className="text-purple-600 mr-2 h-4 w-4" />
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
                          placeholder="Enter your observations about the student's pronunciation, tajweed, and overall progress..."
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
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={createEntryMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createEntryMutation.isPending ? "Saving..." : "Submit Qaida Entry"}
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