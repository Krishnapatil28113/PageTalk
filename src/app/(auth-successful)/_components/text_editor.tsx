"use client";
import React, { useState, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppContext } from "@/state/appState";

function TextEditor() {
  const [value, setValue] = useState("");
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const { state, dispatch } = useAppContext();
  const supabase = createClientComponentClient();
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "formula"],

    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  const module = {
    toolbar: toolbarOptions,
  };
  const handleSave = () => {
    console.log("Content saved:", value);
  };
  return (
    <div>
      <div className="items flex justify-center items-center">
        <Button onClick={handleSave}>Save</Button>
        <span className="margin-left: 10px;">&nbsp;</span>{" "}
        <Button>Ask AI</Button>
      </div>
      <ReactQuill
        modules={module}
        theme="snow"
        value={value}
        onChange={setValue}
      />
    </div>
  );
}

export default TextEditor;
