import { useState } from 'react'
import './App.css'
import { v1 as uuidv1 } from 'uuid'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import Layout from './components/Layout'
import { MyContext } from './MyContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { KeyboardProvider } from './contexts/KeyboardContext'
import { TagProvider } from './contexts/TagContext'

function App() {
  const[prompt, setPrompt] = useState('')
  const[reply, setReply] = useState(null)
  const [currThreadId, setCurrThreadId] = useState(uuidv1())
  const [prevChats, setPrevChats] = useState([])
  const [newChat, setNewChat] = useState(true)
  const [allThreads, setAllThreads] = useState([])
  const providerValue = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <KeyboardProvider>
          <TagProvider>
            <div className='app'>
              <MyContext.Provider value={providerValue}>
                <Layout
                  sidebar={<Sidebar />}
                  mainContent={<ChatWindow />}
                />
              </MyContext.Provider>
            </div>
          </TagProvider>
        </KeyboardProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
