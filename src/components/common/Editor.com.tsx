import React from "react";
import { Editor as TinyMCEReactEditor } from "@tinymce/tinymce-react";

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
}

/**
 * A thin wrapper around the official TinyMCE React component.
 * Keeps only the essential configuration we need.
 */
const Editor: React.FC<EditorProps> = ({
  value = "",
  onChange,
  placeholder = "Nhập mô tả...",
  height = 200,
}) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key";

  return (
    <TinyMCEReactEditor
      apiKey={apiKey}
      value={value}
      onEditorChange={(content) => onChange?.(content)}
      init={{
        height,
        menubar: false,
        plugins:
          "advlist autolink lists link image charmap preview anchor " +
          "searchreplace visualblocks code fullscreen " +
          "insertdatetime table help wordcount",
        toolbar:
          "undo redo | blocks | bold italic forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | link image | removeformat | help",
        placeholder,
        branding: false,
        promotion: false,
        resize: false,
        statusbar: false,
        // Only allow image URLs (no base64 uploads)
        paste_data_images: false,
        automatic_uploads: false,
        file_picker_types: "image",
        valid_elements:
          "p,br,strong,b,em,i,u,ul,ol,li,h1,h2,h3,h4,h5,h6,blockquote," +
          "a[href|title],img[src|alt|title|width|height|style]",
      }}
    />
  );
};

export default Editor;
