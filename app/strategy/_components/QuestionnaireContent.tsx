import React, { useState } from "react";
import { Form } from "@heroui/form";
import { Select, SelectItem } from "@heroui/select";
import { dataForm } from "@/data/data-form";
import { useGenerateAI } from "@/hooks/mutation/api/useGenerateAI";
import { ButtonSoniclabs } from "@/components/button/button-soniclabs";
import Loading from "@/components/loader/loading";

interface FormData {
  [key: number]: number | null;
}

export default function QuestionnaireContent() {
  const [formData, setFormData] = useState<FormData>({});

  const { mutation } = useGenerateAI()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyAnswers = Object.values(formData).some(
      (value) => value === null || value === undefined
    );

    if (Object.keys(formData).length !== dataForm.questions.length || hasEmptyAnswers) {
      alert("Please answer all questions");
      return;
    }

    const formattedSubmission = Object.entries(formData)
      .map(([questionIndex, answerIndex]) => {
        const qIndex = parseInt(questionIndex);
        return `${dataForm.questions[qIndex].question} = ${dataForm.questions[qIndex].options[answerIndex as number]
          }`;
      })
      .join(". ");

    mutation.mutate({
      formattedSubmission
    })
  };

  const handleChange = (index: number, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [index]: value === null ? null : parseInt(value),
    }));
  };

  if (mutation.isPending) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal">
        Fill the questionnaire to help us understand your needs.
      </p>
      <Form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full bg-background/30 p-5 rounded-2xl">
        {dataForm.questions.map((q, index) => (
          <div key={index} className="form-group flex flex-col gap-1 w-full">
            <p className="text-sm">{q.question}</p>
            <Select
              placeholder="Select an option"
              variant="bordered"
              className="w-full"
              classNames={{
                trigger: "min-h-16",
                listboxWrapper: "max-h-[400px]",
              }}
              onChange={(e) => handleChange(index, e?.target?.value || null)}
              required
              value={formData[index]?.toString() || ""}
            >
              {q.options.map((option, optIndex) => (
                <SelectItem key={optIndex} data-value={optIndex.toString()} aria-required aria-label={q.question} aria-labelledby={`question-${index}`}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          </div>
        ))}

        <ButtonSoniclabs
          type="submit"
          fullWidth={true}
          disabled={mutation.isPending}
          textTag={<span>Submit</span>}
        />
      </Form>
    </div>
  );
}