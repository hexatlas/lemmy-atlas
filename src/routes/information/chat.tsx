import React, { useContext, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LLMao from '../../components/shared/LLMao';
import LegendLayout from '../../components/shared/LegendLayout';

import useChat from '../../hooks/useChat';
import ChatMessage from '../../components/shared/ChatMessage';
import { AtlasContext } from '../__root';
import { useStateStorage } from '../../hooks/useAtlasUtils';

export const Route = createFileRoute('/information/chat')({
  component: ChatRouteComponent,
});

function ChatRouteComponent() {
  const [activeModel, setActiveModel] = useState(
    import.meta.env.VITE_MODEL_NAME,
  );

  const [modelAPIKey, setModelAPIKey] = useStateStorage<string>(
    'modelAPIKey',
    '',
  );

  const [
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    messagesWithThinkingSplit,
    handleSendPrompt,
    loading,
    { models },
  ] = useChat({ activeModel });

  const { activeAdministrativeRegion, activeGeographicIdentifier } =
    useContext(AtlasContext)!;

  const defaultUserPrompts = [
    'What is dialectical and historical materialism?',
    'Give me a dialectical materialist analysis of NATO.',
    'How does historical materialism explain the current climate crisis?',
    'Analyze the rise of right-wing populism through a dialectical materialist lens.',
  ];

  const defaultUserPromptsActiveLocation = [
    `Dialectical analysis of ${activeAdministrativeRegion[activeGeographicIdentifier]}'s class composition and productive forces.`,
    `Significant Economic Locations in ${activeAdministrativeRegion[activeGeographicIdentifier]}: A Materialist Perspective.`,
    `How has globalization affected class dynamics in ${activeAdministrativeRegion.name}, ${activeAdministrativeRegion.country}?`,
    `Analysis of ${activeAdministrativeRegion[activeGeographicIdentifier]}'s colonial history and its material consequences today.`,
  ];

  return (
    <LegendLayout className="chat__layout">
      {/* Model Selection */}

      <label>
        Select Model
        <select id="models" onChange={(e) => setActiveModel(e.target.value)}>
          {models.map((model, index) => {
            console.log(model);
            return (
              <option value={model.name} key={index}>
                {model.name}
              </option>
            );
          })}
          {/* <option value={'deepseek-r1'}>deepseek-r1</option> */}
        </select>
      </label>
      {/* 
      {activeModel === 'deepseek-r1' && modelAPIKey.length !== 35 && (
        <input
          className="wrapper"
          type="password"
          placeholder="API Key for deepseek.com e.g. sk-13abac12..."
          onChange={(e) => setModelAPIKey(e.target.value)}
        />
      )} */}

      {/*  System Prompt */}

      <details>
        <summary>System Prompt</summary>
        <textarea
          name={'systemPrompt'}
          className="chat__systemprompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </details>
      <LLMao />

      {/* Default Prompts */}

      {messagesWithThinkingSplit.length === 1 && (
        <>
          {activeAdministrativeRegion.country === 'country' ? (
            <div className="container wrapper ">
              {defaultUserPrompts.map((prompt, index) => (
                <form onSubmit={handleSendPrompt} key={index}>
                  <button
                    type="submit"
                    onClick={() => setUserPrompt(prompt)}
                    className="action"
                  >
                    {prompt}
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <div className="container wrapper ">
              {defaultUserPromptsActiveLocation.map((prompt, index) => (
                <form onSubmit={handleSendPrompt} key={index}>
                  <button
                    type="submit"
                    onClick={() => setUserPrompt(prompt)}
                    className="action"
                  >
                    {prompt}
                  </button>
                </form>
              ))}
            </div>
          )}
        </>
      )}

      {/* Chat */}

      {messagesWithThinkingSplit
        .filter(({ role }) => role === 'user' || role === 'assistant')
        .map((m, index) => (
          <ChatMessage
            key={index}
            message={m}
            activeAdministrativeRegion={activeAdministrativeRegion}
          />
        ))}

      {/* User Prompt */}

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
