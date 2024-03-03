"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Spinner } from "@nextui-org/react";

import PDFCard from "@/components/pdfcard/PDFCard";
import FileUpload from "@/components/fileupload/fileUpload";
import { Separator } from "@/components/ui/separator";

import { useAppContext } from "@/state/appState";
import { extractFileNameFromPath } from "@/lib/utils";
import axios from "axios";

interface pdfDataType {
  status: boolean;
  message: string;
  data: any[] | null;
}

export default function Home() {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [userPDFs, setUserPDFs] = useState<pdfDataType>({
    status: true,
    message: "PDFs retrieved successfully",
    data: [],
  });

  useEffect(() => {
    const fetchPDFs = async () => {
      const res = await supabase
        .from("pdf")
        .select("*")
        .eq("user_id", state.user_id);
      setUserPDFs({
        status: true,
        message: "PDFs retrieved successfully",
        data: res.data,
      });
    };
    fetchPDFs();
  }, [reloadTrigger]);

  const handleUpload = () => {
    setReloadTrigger(!reloadTrigger);
  };

  const handleChatPressed = (
    pdf_id: string,
    pdf_url: string,
    pdf_name: string
  ) => {
    console.log('PDFFF DET:', pdf_id, pdf_url, pdf_name);
    axios.post('http://localhost:5000/postPDF', {
      id: pdf_id,
      download_url : pdf_url
    }) 
    router.push("/workspace");
  };

  return (
    <div className="sm:pt-10 md:p-5 lg:p-5">
      <div className="flex justify-center">
        <div className="w-full p-5 space-y-5 max-w-6xl items-center">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Upload Files
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload files to start a conversation with them.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <FileUpload onUpload={handleUpload} />
          <div className="mt-6 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Your Documents
              </h2>
              <p className="text-sm text-muted-foreground">
                List of all your uploaded documents.
                <br />
                Click on that <strong>&quot;Chat&quot;</strong> button to start
                a conversation or <strong>&quot;Download&quot;</strong> button
                to download the file.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center">
            {userPDFs!.data!.length === 0 ? (
              <div className="items-center justify-center p-5">
                <Spinner size="md" />
              </div>
            ) : userPDFs!.data!.length === 0 ? (
              <p className="text-center text-default-500">
                No PDFs uploaded yet
              </p>
            ) : (
              userPDFs!.data!.map((pdf) => {
                return (
                  <PDFCard
                    key={pdf.id}
                    title={extractFileNameFromPath(pdf.title)}
                    size="1 MB"
                    link={pdf.downloadURL}
                    onChatPressed={() =>
                      handleChatPressed(pdf.id, pdf.downloadURL, pdf.title)
                    }
                  />
                );
              })
            )}
          </div>
          {/* </CardContent>
                                        </Card> */}
        </div>
      </div>
    </div>
  );
}
