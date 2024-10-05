'use client';

import  { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Trash2, Copy } from "lucide-react";

// npm install lucide-react


const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [accumulatedText, setAccumulatedText] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentText(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current.stop();
    setAccumulatedText((prev) => prev + ' ' + currentText.trim());
    setCurrentText('');
  };

  const clearText = () => {
    setAccumulatedText('');
    setCurrentText('');
    setCopySuccess('');
  };

  const copyToClipboard = () => {
    const textToCopy = accumulatedText + ' ' + currentText;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear success message after 2 seconds
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Speech to Text</h1>
          <p className="text-red-500 text-center">
            Sorry, your browser does not support speech recognition.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Speech to Text</h1>
        <textarea
          value={accumulatedText + ' ' + currentText}
          onChange={(e) => setAccumulatedText(e.target.value)}
          placeholder="Your speech will appear here..."
          className="w-full h-40 mb-4 p-2 border border-gray-300 rounded"
        />
        <div className="flex space-x-2">
          <button
            onClick={toggleListening}
            className={`flex-1 p-2 text-white rounded flex items-center justify-center ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={clearText}
            className="flex-none p-2 border border-gray-300 rounded flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear text</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="flex-none p-2 border border-gray-300 rounded flex items-center justify-center"
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy text</span>
          </button>
        </div>
        {copySuccess && <p className="text-green-500 text-center mt-2">{copySuccess}</p>}
      </div>
    </div>
  );
};

export default SpeechToText;
