import React, { useContext, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LLMao from '../../components/shared/LLMao';
import LegendLayout from '../../components/shared/LegendLayout';

import useChat from '../../hooks/useChat';
import ChatMessage from '../../components/shared/ChatMessage';
import { AtlasContext } from '../__root';

export const Route = createFileRoute('/information/chat')({
  component: ChatRouteComponent,
});

function ChatRouteComponent() {
  const [model, setModel] = useState(import.meta.env.VITE_OLLAMA_MODEL);

  const [
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    messagesWithThinkingSplit,
    handleSendPrompt,
    loading,
  ] = useChat({ model });

  const { activeAdministrativeRegion } = useContext(AtlasContext)!;

  return (
    <LegendLayout className="chat__layout">
      <input
        type="model"
        name="model"
        placeholder="Select any Ollama Model - deepseek-r1 recommended"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      <details>
        <summary>System Prompt</summary>
        <textarea
          name={'premise'}
          style={{ width: '100%' }}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </details>
      <LLMao />

      {messagesWithThinkingSplit
        .filter(({ role }) => role === 'user' || role === 'assistant')
        .map((m, index) => (
          <ChatMessage
            key={index}
            message={m}
            activeAdministrativeRegion={activeAdministrativeRegion}
          />
        ))}

      <form
        onSubmit={handleSendPrompt}
        className="container wrapper ask__container"
      >
        <textarea
          value={userPrompt}
          disabled={loading}
          placeholder="Ask LLMao"
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <button
          className="ask__button"
          type="submit"
          disabled={loading || !userPrompt.trim()}
        >
          {loading ? <div className="loading">💬</div> : '📨'}
        </button>
      </form>
    </LegendLayout>
  );
}
