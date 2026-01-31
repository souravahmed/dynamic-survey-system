import { FieldType } from "@/enums/fieldType";
import * as yup from "yup";

export const surveySchema = yup.object().shape({
  title: yup.string().required("Survey title is required").min(3),
  description: yup.string().optional(),
  fields: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Field label is required"),
        fieldType: yup.string().required("Field type is required"),
        isRequired: yup.boolean().default(false),
        options: yup.array().when("fieldType", {
          is: (val: FieldType) =>
            [FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX].includes(
              val,
            ),
          then: (s) =>
            s
              .of(yup.string().required("Option cannot be empty"))
              .min(1, "Add at least one option"),
          otherwise: (s) => s.optional(),
        }),
      }),
    )
    .min(1, "Add at least one question"),
});
