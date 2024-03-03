import React, { useState, useMemo, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppContext } from "@/state/appState";
import { useRouter } from "next/navigation";
import axios from "axios";
// import pdfjsLib from 'pdfjs-dist';
// import { pdfjs } from "react-pdf";

//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const TextEditor = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [text, setText] = useState("");
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const { state, dispatch } = useAppContext();
  const supabase = createClientComponentClient();
  var notes;
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

  const [isListening, setIsListening] = useState(false);
  const [pdfURL, setPdfURL] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [loadNotes, setLoadNotes] = useState([{}]);
  
  useEffect(() => {
    let recognitionInstance;

    const startSpeechRecognition = () => {
      recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setValue((prevValue) => prevValue + ' ' + result);

        // Store recognized speech in a variable
        setRecognizedSpeech(result);
        console.log("Recognized Speech:", result);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionInstance.start();
      setIsListening(true);
    };

    const stopSpeechRecognition = () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
        setIsListening(false);
      }
    };

    if (isListening) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }

    const fetchDet = async() =>{
      const resp = await axios.get('http://localhost:5000/fetchPDF');
      //console.log('RESPONSEE', resp.data[0].download_url);
      setPdfURL(resp.data[0].download_url);
      }
      fetchDet();    


    

    return () => {
      if (recognitionInstance) {
        stopSpeechRecognition();
      }
    };
  }, [isListening, notes]);

  const fetchNotes = async() =>{
    const resp = await axios.get('http://localhost:5000/workspace/notes/allNotes');
    //console.log('NOTESSS', resp.data.data);
    notes = resp.data.data;
    setLoadNotes(resp.data.data);
    console.log('NOTEE',notes);
  }
  fetchNotes();
  const [recognizedSpeech, setRecognizedSpeech] = useState("");

  const toggleSpeechRecognition = () => {
    setIsListening((prev) => !prev);
  };

  const handleSave = () => {
    const plainText = stripHtml(value);
    setText(plainText);
    console.log("Content saved:", plainText);
    axios.post('http://127.0.0.1:5000/workspace/notes/save',{
      "data" : {
        "content" : plainText
      }
    })
  };



  const handleChat = () => {
    router.push(`/chat?message=${encodeURIComponent(text)}`);
  };

  const stripHtml = (html) => {
    var doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  //console.log('MMM', loadNotes);

  
  //handleExtractText();


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left side: PDF Viewer */}
      <div style={{ flex: "1", borderRight: "1px solid #ccc", padding: "10px" }}>
        {/* Add your PDF viewer component here */}
        {/* Example: */}
        <iframe
          src={pdfURL}
                   title="PDF Viewer"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Right side: Text Editor */}
      <div style={{ flex: "1", padding: "10px" }}>
        <ReactQuill modules={module} theme="snow" value={value} onChange={setValue} />
        <div className="items flex justify-center items-center">
          <Button style={{ padding: '20px', margin: '10px' }} onClick={handleSave}>
            Save
          </Button>
          <Button style={{ padding: '20px', margin: '10px' }} onClick={handleChat}>
            Ask AI
          </Button>
          <Button style={{ padding: '20px', margin: '10px' }} onClick={toggleSpeechRecognition}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
        </div>
        <div>
        <div>
  <h3>Loaded Notes:</h3>
  <ul>
    {loadNotes && loadNotes.map((note, index) => (
      <li key={index} style={{ marginBottom: '20px' }}>
        {/* Design each note element */}
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <p><strong>Note {note.id}</strong></p>
          <p>{note.content}</p>
          <p style={{ fontSize: '0.8em', color: '#666' }}>Created at: {new Date(note.created_at).toLocaleString()}</p>
        </div>
      </li>
    ))}
  </ul>
</div>

  </div>
      </div>
    </div>
  );
};

export default TextEditor;
