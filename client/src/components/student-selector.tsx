import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Student } from "@shared/schema";

interface StudentSelectorProps {
  selectedStudent: Student | null;
  onSelect: (student: Student | null) => void;
}

export function StudentSelector({ selectedStudent, onSelect }: StudentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: searchResults = [] } = useQuery<Student[]>({
    queryKey: ["/api/students/search", searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/students/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search students");
      return response.json();
    },
  });

  const displayStudents = searchQuery.length > 0 ? searchResults : students;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 px-4"
        >
          {selectedStudent ? (
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <div className="font-medium text-gray-900">{selectedStudent.name}</div>
                <div className="text-sm text-gray-600">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mr-2">
                    {selectedStudent.studentId}
                  </span>
                  <span className="mr-2">{selectedStudent.section}</span>
                  <span className="text-gray-500">•</span>
                  <span className="ml-2">{selectedStudent.teacher}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">Para {selectedStudent.currentPara}</div>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Search className="mr-2 h-4 w-4" />
              Search by name or ID...
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
        <Command>
          <CommandInput
            placeholder="Search students..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading students..." : "No students found."}
            </CommandEmpty>
            <CommandGroup>
              {displayStudents.map((student) => (
                <CommandItem
                  key={student.id}
                  value={`${student.name} ${student.studentId}`}
                  onSelect={() => {
                    onSelect(student);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between p-3 cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStudent?.id === student.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mr-2">
                          {student.studentId}
                        </span>
                        <span className="mr-2">{student.section}</span>
                        <span className="text-gray-500">•</span>
                        <span className="ml-2">{student.teacher}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Para {student.currentPara}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
