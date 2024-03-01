"use client";
import React, { useState, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppContext } from "@/state/appState";
import { useRouter } from "next/navigation";
import { Image, Link } from "@nextui-org/react";


function TextEditor() {
  const [value, setValue] = useState("");
  const router = useRouter();
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

  const module = {
    toolbar: toolbarOptions,
  };
  const handleSave = () => {
    console.log("Content saved:", value);
  };

  const handleChat = () => {
    router.push('/chat')
  }
  return (
    <div>
      
      <ReactQuill
        modules={module}
        theme="snow"
        value={value}
        onChange={setValue}
      />
      <div className="items flex justify-center items-center">
      <Button style={{ padding: '10px', margin: '5px' }} onClick={handleSave}>
        Save
      </Button>
      <Button style={{ padding: '10px', margin: '5px' }} onClick={handleChat}>
        Ask AI
      </Button>
      <Link isExternal href={link}>
          <Button>Download</Button>
      </Link>
      </div>
    </div>
  );
}

export default TextEditor;
