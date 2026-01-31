/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldType } from "@/enums/fieldType";
import { useSurvey } from "@/hooks/useSurvey";
import { surveySchema } from "@/schemas/surveySchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  LayoutGrid,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  Settings2,
  ListPlus,
  Loader2,
} from "lucide-react";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  UseFormRegister,
} from "react-hook-form";

export const NewSurvey = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
      fields: [
        {
          label: "",
          fieldType: FieldType.TEXT,
          isRequired: false,
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "fields" });
  const { createSurvey, surveyState } = useSurvey();

  const onSubmit = (data: any) => {
    createSurvey(data);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Title Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-2 bg-indigo-600 w-full" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <LayoutGrid className="text-indigo-600" size={24} />
                </div>
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
                  Survey Builder
                </span>
              </div>

              <div className="space-y-4">
                <input
                  {...register("title")}
                  placeholder="Survey Title"
                  className="w-full text-4xl font-black border-none focus:ring-0 placeholder-slate-200 p-0 text-slate-900"
                />
                {errors?.title && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                    {errors.title.message}
                  </p>
                )}
                <textarea
                  {...register("description")}
                  placeholder="Add a description for your respondents..."
                  className="w-full text-slate-500 border-none focus:ring-0 resize-none p-0 min-h-[40px] text-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {fields.map((field, index) => (
              <SurveyFieldItem
                key={field.id}
                index={index}
                register={register}
                control={control}
                remove={remove}
                errors={errors}
              />
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <button
              type="button"
              onClick={() =>
                append({
                  label: "",
                  fieldType: FieldType.TEXT,
                  isRequired: false,
                  options: [],
                })
              }
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-300 transition-all font-bold shadow-sm"
            >
              <Plus size={20} className="text-indigo-600" />
              Add New Question
            </button>

            <button
              type="submit"
              disabled={surveyState.isPending}
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-4 rounded-2xl transition-all font-black shadow-xl active:scale-[0.98] ${
                surveyState.isPending
                  ? "bg-indigo-400 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
              }`}
            >
              {surveyState.isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Publish Survey
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Sub-component for managing the dynamic JSON options
 */

const OptionsManager = ({
  control,
  fieldIndex,
  register,
  errors,
}: {
  control: Control<any>;
  fieldIndex: number;
  register: UseFormRegister<any>;
  errors: any;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options`,
  });

  // Access errors specifically for this field's options array
  const optionErrors = errors?.fields?.[fieldIndex]?.options;

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {/* Header with Icon */}
      <div className="flex items-center gap-2 mb-1">
        <ListPlus size={14} className="text-indigo-500" />
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Answer Choices
        </label>
      </div>

      <div className="space-y-2">
        {fields.map((opt, optIndex) => {
          // Check if this specific option index has an error
          const hasError = !!optionErrors?.[optIndex];

          return (
            <div key={opt.id} className="flex flex-col">
              <div className="flex items-center gap-2 group/option animate-in slide-in-from-left-2 duration-200">
                <span className="text-[10px] font-medium text-slate-400 w-4">
                  {optIndex + 1}.
                </span>

                <input
                  {...register(
                    `fields.${fieldIndex}.options.${optIndex}` as const,
                  )}
                  placeholder="Enter choice text..."
                  className={`flex-1 bg-white border-none ring-1 rounded-md py-1.5 px-3 text-sm text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm ${
                    hasError ? "ring-red-500 bg-red-50" : "ring-slate-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => remove(optIndex)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/option:opacity-100"
                  title="Delete option"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Individual Option Error Message */}
              {hasError && (
                <p className="text-[10px] text-red-500 font-medium ml-6 mt-1">
                  {optionErrors[optIndex]?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Global Options Error (e.g., "Add at least one option") */}
      {typeof optionErrors === "object" && optionErrors?.message && (
        <p className="text-xs text-red-500 font-bold ml-6 bg-red-50 p-2 rounded-lg border border-red-100">
          {optionErrors.message}
        </p>
      )}

      {/* Add Button - Styled as a subtle ghost button */}
      <button
        type="button"
        onClick={() => append("")}
        className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100 border-dashed"
      >
        <Plus size={14} />
        Add another option
      </button>

      {/* Visual hint if empty */}
      {fields.length === 0 && (
        <p className="text-xs text-slate-400 italic ml-6">
          No options added yet. Click above to start adding choices.
        </p>
      )}
    </div>
  );
};

/**
 * Sub-component for a single Survey Field
 * Moved outside to allow useWatch to work correctly with React Compiler
 */
const SurveyFieldItem = ({ index, register, control, remove, errors }: any) => {
  const FIELD_TYPES = [
    FieldType.TEXT,
    FieldType.CHECKBOX,
    FieldType.RADIO,
    FieldType.SELECT,
  ];

  const currentType = useWatch({
    control,
    name: `fields.${index}.fieldType`,
  });

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Handle / Accent Bar */}
      <div className="h-1.5 bg-slate-100 group-hover:bg-indigo-500 transition-colors" />

      <div className="p-6">
        {/* Header: Label & Type */}
        <div className="flex items-start gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Question Input */}
            <div className="md:col-span-8">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Question Label
              </label>
              <input
                {...register(`fields.${index}.label`)}
                placeholder="e.g., How did you hear about us?"
                className={`w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-lg py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors?.fields?.[index]?.label ? "ring-red-500 bg-red-50" : ""
                }`}
              />
              {errors?.fields?.[index]?.label && (
                <p className="text-red-500 text-xs mt-1.5 font-medium ml-1">
                  {errors.fields[index].label.message}
                </p>
              )}
            </div>

            {/* Type Dropdown */}
            <div className="md:col-span-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Field Type
              </label>
              <div className="relative">
                <select
                  {...register(`fields.${index}.fieldType`)}
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-lg py-2.5 px-4 text-slate-900 appearance-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  {FIELD_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-white text-slate-900 py-2"
                    >
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <Settings2 size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Options Section */}
        {[FieldType.CHECKBOX, FieldType.RADIO, FieldType.SELECT].includes(
          currentType,
        ) && (
          <div className="mt-8 ml-9 p-5 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
            <OptionsManager
              control={control}
              fieldIndex={index}
              register={register}
              errors={errors}
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 ml-9 pt-5 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center group/toggle cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                {...register(`fields.${index}.isRequired`)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </div>
            <span className="ml-3 text-sm font-semibold text-slate-600 group-hover/toggle:text-slate-900 transition-colors">
              Required Field
            </span>
          </label>

          <button
            type="button"
            onClick={() => remove(index)}
            className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm"
          >
            <Trash2 size={16} />
            Remove Question
          </button>
        </div>
      </div>
    </div>
  );
};
