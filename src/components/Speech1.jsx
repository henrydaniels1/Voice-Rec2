'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Trash2, Copy, Volume2 } from 'lucide-react'

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const [accumulatedText, setAccumulatedText] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef(null)
  const [copySuccess, setCopySuccess] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('') // New state for deletion feedback

  useEffect(() => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setIsSupported(false)
    } else {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        setCurrentText(finalTranscript + interimTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    setIsListening(false)
    recognitionRef.current.stop()
    setAccumulatedText((prev) => prev + ' ' + currentText.trim())
    setCurrentText('')
  }

  const clearText = () => {
    setAccumulatedText('')
    setCurrentText('')
    setCopySuccess('')
    setDeleteSuccess('Text deleted!') // Show delete feedback
    setTimeout(() => setDeleteSuccess(''), 2000) // Clear delete message after 2 seconds
  }

  const copyToClipboard = () => {
    const textToCopy = accumulatedText + ' ' + currentText
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopySuccess('Copied !')
        setTimeout(() => setCopySuccess(''), 2000)
      })
      .catch((err) => {
        console.error('Could not copy text: ', err)
      })
  }

  const speakText = () => {
    const textToSpeak = accumulatedText + ' ' + currentText

    if (textToSpeak.trim() === '') {
      alert("There's no text to speak.")
      return
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    speechSynthesis.speak(utterance)

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
    }
  }

  if (!isSupported) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold mb-4 text-center'>
            Speech to Text
          </h1>
          <p className='text-red-500 text-center'>
            Sorry, your browser does not support speech recognition.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-[100dvh] items-center justify-center min-h-screen bg-gray-900'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4 text-center'>Speech to Text</h1>
        <textarea
          value={accumulatedText + ' ' + currentText}
          onChange={(e) => {
            setAccumulatedText(e.target.value)
            setCurrentText('')
          }}
          placeholder='Your speech will appear here...'
          className='w-full h-40 mb-4 p-2 border border-gray-300 rounded'
        />
        <div className='flex space-x-2'>
          <button
            onClick={toggleListening}
            className={`flex-1 p-2 text-white rounded flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }`}>
            {isListening ? (
              <>
                <MicOff className='mr-2 h-4 w-4 transition-transform duration-300 transform hover:scale-110' />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Mic className='mr-2 h-4 w-4 transition-transform duration-300 transform hover:scale-110' />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={clearText}
            className='flex-none p-2 border border-gray-300 rounded flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:bg-gray-200 active:bg-gray-300'>
            <Trash2 className='h-4 w-4 transition-transform duration-300 transform hover:scale-110' />
            <span className='sr-only'>Clear text</span>
          </button>
          <button
            onClick={copyToClipboard}
            className='flex-none p-2 border border-gray-300 rounded flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:bg-gray-200 active:bg-gray-300'>
            <Copy className='h-4 w-4 transition-transform duration-300 transform hover:scale-110' />
            <span className='sr-only'>Copy text</span>
          </button>
          <button
            onClick={speakText}
            className='flex-none p-2 border border-gray-300 rounded flex items-center justify-center transition-all duration-300 transform active:scale-95 hover:bg-gray-200 active:bg-gray-300'>
            <Volume2 className='h-4 w-4 transition-transform duration-300 transform hover:scale-110' />
            <span className='sr-only'>Speak text</span>
          </button>
        </div>
        {copySuccess && (
          <div className='flex mt-4 '>
            {' '}
            <div className='mx-auto bg-green-500 rounded-lg'>
              {' '}
              <p className='text-white py-2 px-3 text-center font-bold'>
                {copySuccess}
              </p>
            </div>
          </div>
        )}
        {deleteSuccess && (
          <div className='flex mt-4 '>
            {' '}
            <div className='mx-auto bg-red-500 rounded-lg'>
              {' '}
              <p className='text-white py-2 px-3 text-center font-bold'>
                {deleteSuccess}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeechToText
