"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"; 
import { ParamProps } from "@/schema/playgroundTask";
import { useEffect, useId, useState } from "react";

function StringField({ param, value, updateNodeParamValue, disabled }: ParamProps) {
  const [internalValue, setInternalValue] = useState(value || "");
  const id = useId();

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const languageOptions = [
    { code: "af", name: "Afrikaans" },
    { code: "ar", name: "Arabic" },
    { code: "az", name: "Azerbaijani" },
    { code: "be", name: "Belarusian" },
    { code: "bg", name: "Bulgarian" },
    { code: "bn", name: "Bengali" },
    { code: "ca", name: "Catalan" },
    { code: "cs", name: "Czech" },
    { code: "cy", name: "Welsh" },
    { code: "da", name: "Danish" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "en", name: "English" },
    { code: "eo", name: "Esperanto" },
    { code: "es", name: "Spanish" },
    { code: "et", name: "Estonian" },
    { code: "eu", name: "Basque" },
    { code: "fa", name: "Persian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "ga", name: "Irish" },
    { code: "gl", name: "Galician" },
    { code: "gu", name: "Gujarati" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hr", name: "Croatian" },
    { code: "hu", name: "Hungarian" },
    { code: "hy", name: "Armenian" },
    { code: "id", name: "Indonesian" },
    { code: "is", name: "Icelandic" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ka", name: "Georgian" },
    { code: "kk", name: "Kazakh" },
    { code: "km", name: "Khmer" },
    { code: "kn", name: "Kannada" },
    { code: "ko", name: "Korean" },
    { code: "ky", name: "Kyrgyz" },
    { code: "la", name: "Latin" },
    { code: "lt", name: "Lithuanian" },
    { code: "lv", name: "Latvian" },
    { code: "mk", name: "Macedonian" },
    { code: "ml", name: "Malayalam" },
    { code: "mn", name: "Mongolian" },
    { code: "mr", name: "Marathi" },
    { code: "ms", name: "Malay" },
    { code: "my", name: "Myanmar (Burmese)" },
    { code: "ne", name: "Nepali" },
    { code: "nl", name: "Dutch" },
    { code: "no", name: "Norwegian" },
    { code: "pa", name: "Punjabi" },
    { code: "pl", name: "Polish" },
    { code: "ps", name: "Pashto" },
    { code: "pt", name: "Portuguese" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "si", name: "Sinhala" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "sq", name: "Albanian" },
    { code: "sr", name: "Serbian" },
    { code: "sv", name: "Swedish" },
    { code: "sw", name: "Swahili" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "uz", name: "Uzbek" },
    { code: "vi", name: "Vietnamese" },
    { code: "zh", name: "Chinese" },
  ];

  if (param.variant === "select") {
    // Check if the field is related to language selection
    const isTranslationField = param.name === "Source Language" || param.name === "Target Language";

    return (
      <div className="space-y-1 p-1 w-full">
        <Label htmlFor={id} className="text-xs flex">
          {param.name}
          {param.required && <p className="text-red-400 px-2">*</p>}
        </Label>
        <Select
          value={internalValue}
          onValueChange={(val: string) => {
            setInternalValue(val);
            updateNodeParamValue(val);
          }}
          disabled={disabled}
        >
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {(isTranslationField ? languageOptions.map((opt) => (
              <SelectItem key={opt.code} value={opt.code}>
                {opt.name}
              </SelectItem>
            )) : param.options?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            )))}
          </SelectContent>
        </Select>
        {param.helperText && (
          <p className="text-muted-foreground px-2">{param.helperText}</p>
        )}
      </div>
    );
  }

  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Component
        id={id}
        value={internalValue}
        placeholder="Enter value here"
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setInternalValue(e.target.value)
        }
        onBlur={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          updateNodeParamValue(e.target.value)
        }
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}

export default StringField;
