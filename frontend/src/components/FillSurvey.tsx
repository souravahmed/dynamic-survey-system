/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { useSurvey } from "@/hooks/useSurvey";
import { useSurveySubmission } from "@/hooks/useSurveySubmission";
import { FieldType } from "@/enums/fieldType";
import { AnswerPayload, SurveySubmissionPayload } from "@/interfaces";

export const FillSurvey = () => {
  const { id } = useParams();
  const { survey, isSurveyLoading } = useSurvey(id);
  const { submitSurvey, isSubmitting } = useSurveySubmission();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  if (isSurveyLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  const onSubmit = (data: any) => {
    const formattedAnswers: AnswerPayload[] = Object.entries(data).map(
      ([fieldId, val]) => ({
        fieldId,
        value: Array.isArray(val) ? val.join(", ") : String(val ?? ""),
      }),
    );

    const payload: SurveySubmissionPayload = {
      surveyId: id!,
      answers: formattedAnswers,
    };

    submitSurvey(payload);
  };

  const inputClasses =
    "w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 placeholder:text-slate-400";

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-3 bg-indigo-600 w-full" />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {survey?.title}
          </h1>
          <p className="text-slate-500 text-lg">{survey?.description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {survey?.fields.map((field: any) => (
          <div
            key={field.id}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
          >
            <label className="block text-lg font-semibold text-slate-800 mb-4">
              {field.label}{" "}
              {field.isRequired && <span className="text-red-500">*</span>}
            </label>

            {/* TEXT INPUT */}
            {field.fieldType === FieldType.TEXT && (
              <input
                {...register(field.id, { required: field.isRequired })}
                className={inputClasses}
                placeholder="Your answer..."
              />
            )}

            {/* SELECT DROPDOWN */}
            {field.fieldType === FieldType.SELECT && (
              <select
                {...register(field.id, { required: field.isRequired })}
                className={`${inputClasses} cursor-pointer appearance-none bg-white`}
              >
                <option value="" className="text-slate-400">
                  Select an option
                </option>
                {field.options?.map((opt: string) => (
                  <option key={opt} value={opt} className="text-slate-900">
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* RADIO BUTTONS */}
            {field.fieldType === FieldType.RADIO && (
              <div className="space-y-3">
                {field.options?.map((opt: string) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <input
                      type="radio"
                      value={opt}
                      {...register(field.id, { required: field.isRequired })}
                      className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* CHECKBOXES (MULTI-SELECT) */}
            {field.fieldType === FieldType.CHECKBOX && (
              <div className="space-y-3">
                {field.options?.map((opt: string) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={opt}
                      {...register(field.id, { required: field.isRequired })}
                      className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-3 font-medium flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                This field is required
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-3 px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Submit Response</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
