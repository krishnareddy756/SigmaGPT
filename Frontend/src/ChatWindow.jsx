import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState,useEffect, use } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId ,prevChats,setPrevChats,setNewChat} = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setNewChat(false);
    console.log("Prompt sent:", prompt);
    console.log("Current Thread ID:", currThreadId);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      const res = await response.json();
      setReply(res.reply);
    } catch (error) {
      console.error("Error fetching reply:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,{
          role: 'user',
          content: prompt,
        },
        {
          role: 'assistant',
          content: reply,
        }
      ]);
    }
    setPrompt('');
  }, [ reply]);
  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>SigmaGpt &nbsp;<i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv">
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      <Chat />

      {isLoading && (
        <div className="loaderContainer">
          <ScaleLoader
            color="#ffffff"
            height={35}
            width={4}
            radius={2}
            margin={2}
            loading={isLoading}
          />
        </div>
      )}

      <div className="chatInput">
        <div className='InputBox'>
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getReply();
              }
            }}
            disabled={isLoading}
          />
          <div id='submit' onClick={getReply} style={{ cursor: isLoading ? "not-allowed" : "pointer" }}>
            <i className="fa-solid fa-square-arrow-up-right"></i>
          </div>
        </div>
      </div>

      <div>
        <p className='info'>SigmaGPT can make mistakes</p>
      </div>
    </div>
  );
}

export default ChatWindow;
