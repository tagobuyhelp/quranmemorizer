import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { StarRating } from "./star-rating";
import type { Student, ParaData } from "@shared/schema";

interface TaskFieldsProps {
  form: UseFormReturn<any>;
  taskType: "sabaq" | "ammapara" | "amukta";
  selectedStudent: Student | null;
  paraData: ParaData[];
}

export function TaskFields({ form, taskType, selectedStudent, paraData }: TaskFieldsProps) {
  const para = form.watch("para");
  const fromPage = form.watch("fromPage");
  const toPage = form.watch("toPage");

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

  // Reset dependent fields when para changes
  useEffect(() => {
    if (taskType === "sabaq" && para) {
      form.setValue("fromPage", undefined);
      form.setValue("toPage", undefined);
      form.setValue("pagesRead", undefined);
    }
  }, [para, taskType, form]);

  // Reset "To Page" when "From Page" changes
  useEffect(() => {
    if (taskType === "sabaq" && fromPage && toPage && fromPage > toPage) {
      form.setValue("toPage", undefined);
      form.setValue("pagesRead", undefined);
    }
  }, [fromPage, taskType, form, toPage]);

  if (taskType === "sabaq") {
    return (
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
                  disabled={!para}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select from page" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {para && getPageOptions(para).map((pageNum) => (
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
                  disabled={!para || !fromPage}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select to page" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {para && fromPage && getToPageOptions(para, fromPage).map((pageNum) => (
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
    );
  }

  if (taskType === "ammapara") {
    const currentParaData = paraData.find(p => p.paraNumber === selectedStudent?.currentPara);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="para"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Para Number</FormLabel>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedStudent?.currentPara || "Not selected"}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">(Current Para - Read Only)</span>
                </div>
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
                    {currentParaData?.totalPages || 0}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">(Full Para)</span>
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
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">
                    {currentParaData?.startPage || "N/A"}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">(Para Start)</span>
                </div>
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
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">
                    {currentParaData?.endPage || "N/A"}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">(Para End)</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  if (taskType === "amukta") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="para"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Paras Memorized</FormLabel>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedStudent?.totalParas || 0}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">(Auto-loaded)</span>
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
                <FormLabel>Accuracy Score</FormLabel>
                <div className="flex items-center space-x-2">
                  <StarRating
                    rating={field.value || 0}
                    onRatingChange={field.onChange}
                  />
                  <span className="text-sm text-gray-600 ml-2">
                    {field.value ? `${field.value}/5` : "0/5"}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <FormField
            control={form.control}
            name="parasRevised"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paras Revised Today</FormLabel>
                <div className="bg-white border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: selectedStudent?.totalParas || 0 }, (_, i) => i + 1).map((paraNum) => (
                      <label key={paraNum} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(paraNum) || false}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, paraNum]);
                            } else {
                              field.onChange(currentValue.filter((p) => p !== paraNum));
                            }
                          }}
                        />
                        <span className="text-sm">{paraNum}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Selected:</span>{" "}
                      {field.value?.length > 0 
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
        </div>
      </div>
    );
  }

  return null;
}
