import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const [messageType, setMessageType] = useState("sms");
  const [inputType, setInputType] = useState("text");
  const [inputText, setInputText] = useState("");
  const [phishingText, setPhishingText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };

  const uploadFile = async () => {
    function setfield(value) {
      setInputText(value);

    }


    if (inputType === "text") {
      if (!inputText) {
      setError("Please select a file to upload.");
      return;
    }
    setfield(inputText);
  }

    if (inputType === "image") {
      if (!file) {
        setError("Please select a file to upload.");
        return;
      }
      setField(file);
    }

    console.log(phishingText);

    setLoading(true);
    setError("");



    const formData = new FormData();
    formData.append("file", phishingText);

    try {
      const response = await fetch(
        "https://phisingfunction.azurewebsites.net/",
        {
          // Replace with your Azure Function URL
          method: "POST",
          body: formData,
        }
      );

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

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", messageType);
    formData.append("file", file);
    uploadFile(formData);
    alert(`Analysis Result: ${result}`);
  };

  return (
    <div className="font-LibreBaskerville bg-slate-200">
      <div className="text-5xl pt-16 text-center">Find Fraud</div>
      <div className="text-center text-xl mt-10 mb-2">
        <p>Want to know if you're being scammed or spammed?</p>
        <p>Upload a pdf or paste the message below to let our AI find out!</p>
        <p>{error}</p>
        <img className="h-52 mx-auto" src="/fishgif.gif" alt="fishgif" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col mx-auto pb-20 items-center w-1/2 gap-4"
      >
        <div className="flex gap-10 justify-center">
          <select
            name="messageType"
            id="messageType"
            className="bg-white text-slate-400 border border-slate-400 font-bold mx-auto w-32 py-2 px-4 rounded-lg focus:outline-none shadow-md"
          >
            <option value="sms" onChange={() => setMessageType("sms")}>
              SMS
            </option>
            <option value="email" onChange={() => setMessageType("email")}>
              E-mail
            </option>
          </select>
          <select
            name="inputType"
            id="inputType"
            onChange={(e) => setInputType(e.target.value)}
            className="bg-white text-slate-400 border border-slate-400 font-bold mx-auto w-32 py-2 px-4 rounded-lg focus:outline-none shadow-md"
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
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-slate-400 text-white border border-slate-400 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:scale-125 hover:bg-white hover:text-slate-400"
        >
          Check Message
        </button>
      </form>
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
