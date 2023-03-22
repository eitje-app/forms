import setup, { t } from "./base";
import configure from "./form_creator";
import dutch from "./i18n/nl";
import english from "./i18n/en";
import useFormField from "./use_form_field";
import usePicker from "./use_picker";
import MultiForm, { useMultiForm } from "./multi_form";
import LegacyMultiForm from "./legacy_multi_form";
import FormWrapper from "./form_wrapper";
import Form from "./form";
import ContextForm, { useForm } from "./context_form";

export * from "./actions";
export * from "./legacy_actions";
export * from "./components";
export * from "./use_register_field";
// console.log(nl)

const nl = { form: dutch };
const en = { form: english };
const translations = { en, nl };

export {
  setup,
  configure,
  LegacyMultiForm,
  translations,
  useForm,
  useMultiForm,
  ContextForm,
  useFormField,
  usePicker,
  MultiForm,
  Form,
  FormWrapper,
  t,
};
