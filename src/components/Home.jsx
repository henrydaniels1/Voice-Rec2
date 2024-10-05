import SpeechToText from './Speech2'
import ExampleComponent from './Scroll'
export default function Home() {
  return (
      <div>
          <ExampleComponent />
          <div className="reveal2">
              <SpeechToText/>
          </div>
      
    </div>
  )
}
