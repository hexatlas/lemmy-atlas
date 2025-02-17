import React, { useContext } from 'react';
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
  const [
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    messagesWithThinkingSplit,
    handleSendPrompt,
    loading,
  ] = useChat();

  const { activeAdministrativeRegion } = useContext(AtlasContext)!;

  return (
    <LegendLayout>
      <LLMao />
      <details>
        <summary>System Prompt</summary>
        <textarea
          name={'premise'}
          style={{ width: '100%' }}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </details>

      {messagesWithThinkingSplit
        .filter(({ role }) => role === 'user' || role === 'assistant')
        .map((m, index) => (
          <ChatMessage
            key={index}
            message={m}
            activeAdministrativeRegion={activeAdministrativeRegion}
          />
        ))}

      <form onSubmit={handleSendPrompt} className="container wrapper">
        <span>💬</span>
        <textarea
          value={userPrompt}
          disabled={loading}
          placeholder="Ask LLMao"
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <button type="submit" disabled={loading || !userPrompt.trim()}>
          {loading ? <div className="loading"></div> : '📨'}
        </button>
      </form>
    </LegendLayout>
  );
}
