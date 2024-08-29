import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function App() {
  const [messageType, setMessageType] = useState('sms');
  const [inputType, setInputType] = useState('text');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', messageType);
    formData.append('file', file);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    alert(`Analysis Result: ${result.analysis}`);
  };

  return (
    <>
      <div className="container m-auto px-4">
        <div className="text-5xl text-center my-10">Find Fraud</div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <div className="flex gap-10">
            <label>
              <input
                type="radio"
                name="messageType"
                value="sms"
                className='mr-2'
                checked={messageType === 'sms'}
                onChange={() => setMessageType('sms')}
              /> SMS
            </label>
            <label>
              <input
                type="radio"
                name="messageType"
                value="email"
                className='mr-2'
                checked={messageType === 'email'}
                onChange={() => setMessageType('email')}
              /> E-mail
            </label>
          </div>

          <div className="flex gap-10">
            <label>
              <input
                type="radio"
                name="inputType"
                value="text"
                className='mr-2'
                checked={inputType === 'text'}
                onChange={() => setInputType('text')}
              /> Text
            </label>
            <label>
              <input
                type="radio"
                name="inputType"
                value="image"
                className='mr-2'
                checked={inputType === 'image'}
                onChange={() => setInputType('image')}
              /> Image
            </label>
          </div>

          {inputType === 'text' ? (
            <textarea
              className="form-textarea mt-1 block w-full h-40 p-2 border"
              placeholder="Paste your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
          ) : (
            <div {...getRootProps()} className="border-black border-2 p-10 text-center cursor-pointer">
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop some files here, or click to select files</p>
              }
            </div>
          )}

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Check Message
          </button>
        </form>
      </div>
    </>
  );
}

export default App;


createRoot(document.getElementById('root')).render(
    <App />
)
