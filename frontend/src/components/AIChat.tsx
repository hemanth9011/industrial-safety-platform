import { useState } from "react";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      setReply("❌ Failed to connect to AI server.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        🤖 Industrial Safety AI Assistant
      </h1>

      <p className="text-gray-600 mb-6">
        Ask anything about fire safety, PPE, compliance, permits, workplace
        hazards, gas leakage, emergency response, or industrial safety.
      </p>

      <textarea
  className="w-full border border-gray-400 rounded-lg p-4 bg-white text-black placeholder:text-gray-500"
  rows={6}
  value={message}
  placeholder="Example: How can we prevent fire accidents in a chemical plant?"
  onChange={(e) => setMessage(e.target.value)}
/>

      <button
        onClick={askAI}
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

     <div className="mt-8 border border-gray-300 rounded-lg p-5 bg-white text-black">
        <h2 className="text-xl font-semibold mb-3">AI Response</h2>

       <div className="whitespace-pre-wrap text-black">
          {reply || "Your AI response will appear here..."}
        </div>
      </div>
    </div>
  );
}