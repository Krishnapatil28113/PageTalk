"use client";
import React, { useState, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppContext } from "@/state/appState";
import { useRouter } from "next/navigation";
function TextEditor() {
  const router = useRouter();
  const [value, setValue] = useState("");
  //const router = useRouter();
  const link = "/"
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
  const [text, setText] = useState("");
  const module = {
    toolbar: toolbarOptions,
  };
  const handleSave = () => {
    const plainText = stripHtml(value);
    setText(text)
    console.log("Content saved:", plainText);
    
  };
  const handleChat = () =>{
    router.push(`/chat?message=${encodeURIComponent(text)}`);
  }
  const stripHtml = (html) => {
    var doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // const handleChat = () => {
  //   router.push('/chat')
  // }
  return (
    <div>
      
      <ReactQuill
        modules={module}
        theme="snow"
        value={value}
        onChange={setValue}
      />
      <div className="items flex justify-center items-center">
        <Button onClick={handleSave}>Save</Button>
        <span className="margin-left: 10px;">&nbsp;</span>{" "}
        <Button onClick={handleChat}>Ask AI</Button>
      </div>
    </div>
  );
}

export default TextEditor;
