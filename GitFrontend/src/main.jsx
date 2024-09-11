import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useDropzone } from 'react-dropzone';
const pdfjs = await import('pdfjs-dist/build/pdf');
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import './index.css';

function App() {
  const [messageType, setMessageType] = useState("sms");
  const [inputType, setInputType] = useState("text");
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles.find(f => f.type === 'application/pdf');
    if (pdfFile) {
      setFile(pdfFile);
      setInputType('image'); // Assuming 'image' type is used for PDFs in your original code
    } else {
      setError('Please upload a valid PDF file.');
    }
  }, []);

  const extractTextFromPdf = async (pdfBuffer) => {
    const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
    const pdfDoc = await loadingTask.promise;
    let text = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      text += textContent.items.map(item => item.str).join(' ') + '\n';
    }

    return text;
  };

  const uploadFile = async (formData) => {
    setLoading(true);
    setError("");
  
    try {
      const apiKey = process.env.REACT_APP_API_KEY
      console.log(apiKey)
      const response = await fetch(`https://phisingfunction.azurewebsites.net/api/mycustomroute`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setError(`Failed to upload file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && inputType === 'image') {
      setError("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("type", messageType);
    formData.append("file", file);

    await uploadFile(formData);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="font-LibreBaskerville bg-slate-200">
      <div className="text-5xl pt-16 text-center">Find Fraud</div>
      <div className="text-center text-xl mt-10 mb-2">
        <p>Want to know if you're being scammed or spammed?</p>
        <p>Upload a PDF or paste the message below to let our AI find out!</p>
        {error && <p className="text-red-500">{error}</p>}
        <img className="h-52 mx-auto" src="/fishgif.gif" alt="fishgif" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col mx-auto pb-20 items-center w-1/2 gap-4">
        <div className="flex gap-10 justify-center">
          <select
            name="messageType"
            id="messageType"
            className="bg-white text-slate-400 border border-slate-400 font-bold mx-auto w-32 py-2 px-4 rounded-lg focus:outline-none shadow-md"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
          >
            <option value="sms">SMS</option>
            <option value="email">E-mail</option>
          </select>
          <select
            name="inputType"
            id="inputType"
            className="bg-white text-slate-400 border border-slate-400 font-bold mx-auto w-32 py-2 px-4 rounded-lg focus:outline-none shadow-md"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="image">PDF</option>
          </select>
        </div>

        {inputType === "text" ? (
          <textarea
            className="form-textarea mt-1 block w-full h-40 p-2 rounded-lg border focus:border-slate-400 focus:outline-none border-slate-400"
            placeholder="Paste your message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        ) : (
          <div
            {...getRootProps()}
            className="border-slate-400 border-2 p-16 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop a PDF file here, or click to select files</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-slate-400 text-white border border-slate-400 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:scale-125 hover:bg-white hover:text-slate-400"
        >
          {loading ? "Loading..." : "Check Message"}
        </button>
      </form>

      {result && <pre className="bg-white p-4 rounded-lg">{result}</pre>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);