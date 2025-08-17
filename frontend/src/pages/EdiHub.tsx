import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BaplieMessageView from '../components/BaplieMessageView';
import CoarriMessageView from '../components/CoarriMessageView';
import CodecoMessageView from '../components/CodecoMessageView';

const EdiHub = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageType, setMessageType] = useState('');
  const [content, setContent] = useState('');
  const [visibleMessages, setVisibleMessages] = useState({});

  const toggleVisibility = (id) => {
    setVisibleMessages(prev => ({...prev, [id]: !prev[id]}));
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`http://localhost:3001/api/edi/${containerId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    };
    fetchMessages();
  }, [containerId]);

  const handleAddMessage = async () => {
    await fetch(`http://localhost:3001/api/edi/${containerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageType, content }),
    });
    setMessageType('');
    setContent('');
    // a simple way to refresh the data
    const response = await fetch(`http://localhost:3001/api/edi/${containerId}`);
    if (response.ok) {
        const data = await response.json();
        setMessages(data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">EDI Hub: {containerId}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add New EDI Message</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Message Type (e.g., BAPLIE, COARRI, CODECO)"
            className="p-2 border rounded"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
          />
          <textarea
            placeholder="Content"
            className="p-2 border rounded w-full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddMessage}
          >
            Add Message
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        {messages.map((message) => (
          <div key={message.id} className="border p-4 mb-4 rounded">
            <p><strong>Type:</strong> {message.messageType}</p>
            <p><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</p>

            {(() => {
                switch (message.messageType.toUpperCase()) {
                    case 'BAPLIE':
                        return <BaplieMessageView message={message} />;
                    case 'COARRI':
                        return <CoarriMessageView message={message} />;
                    case 'CODECO':
                        return <CodecoMessageView message={message} />;
                    default:
                        return <pre className="bg-gray-100 p-2 rounded mt-2">{message.content}</pre>;
                }
            })()}

            <button onClick={() => toggleVisibility(message.id)} className="text-sm text-blue-500 mt-2">
                {visibleMessages[message.id] ? 'Hide' : 'Show'} Raw Content
            </button>
            {visibleMessages[message.id] && <pre className="bg-gray-100 p-2 rounded mt-2">{message.content}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EdiHub;
