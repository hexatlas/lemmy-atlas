import React, { useContext, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LLMao from '../../components/shared/LLMao';
import LegendLayout from '../../components/shared/LegendLayout';

import useChat from '../../hooks/useChat';
import ChatMessage from '../../components/shared/ChatMessage';
import { AtlasContext } from '../__root';
import { useStateStorage } from '../../hooks/useAtlasUtils';
import { ModelConfig } from '../../types/atlas.types';

export const Route = createFileRoute('/information/chat')({
  component: ChatRouteComponent,
});

function ChatRouteComponent() {
  const [activeModel, setActiveModel] = useState('open-ai');
  const [isEditModelConfig, setIsEditModelConfig] = useState(true);
  const [modelConfig, setModelConfig] = useStateStorage<ModelConfig>(
    'modelConfig',
    {
      baseURL: 'https://api.deepseek.com',
      apiKey: '',
      model: 'deepseek-chat',
      max_tokens: 3500,
    },
    true,
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
  ] = useChat({ activeModel, modelConfig });

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

  function handleSetOpenAIModel(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    console.log(modelConfig);

    setModelConfig((prev) => ({
      ...prev,
      baseURL: data.get('baseURL') as string,
      apiKey: data.get('apiKey') as string,
      model: data.get('model') as string,
      max_tokens: Number(data.get('max_tokens')),
    }));

    setIsEditModelConfig(!isEditModelConfig);
  }

  return (
    <LegendLayout className="chat__layout">
      {/* Ollama Model Selection */}

      <label className="wrapper">
        Select Model
        <select id="models" onChange={(e) => setActiveModel(e.target.value)}>
          {' '}
          <option value={'ollama'} disabled>
            ### ollama ###
          </option>
          {models.map((model, index) => {
            return (
              <option value={model.name} key={index}>
                {model.name}
              </option>
            );
          })}
          <option value={'open-ai'} disabled>
            ### open-ai ###
          </option>
          <option value={'open-ai'}>OpenAI - Config</option>
        </select>
      </label>

      {/* Troubleshoot  */}

      {models.length === 0 && (
        <>
          <small>Ollama not found</small>
          <h6>Troubleshoot</h6>
          <ul>
            <li>
              Install ollama via{' '}
              <a
                href="https://ollama.com/download"
                target="_blank"
                rel="noopener noreferrer"
              >
                ollama.com
              </a>
            </li>
            <li>
              Pull a model e.g.
              <code>{`ollama pull deepseek-r1:7b`}</code>
            </li>
            <li>
              If redAtlas is not running on the same machine as ollama, add
              origin
              <code>
                {`OLLAMA_ORIGINS=${window.location.origin} ollama serve`}
              </code>
            </li>
          </ul>
        </>
      )}

      {/* OpenAI Model Selection */}

      {activeModel === 'open-ai' && (
        <form
          name="modelConfig"
          onSubmit={handleSetOpenAIModel}
          className="container wrapper chat__config"
        >
          <label htmlFor="modelConfig">{modelConfig.model}</label>
          {isEditModelConfig && (
            <>
              <input
                name="baseURL"
                type="url"
                defaultValue={modelConfig.baseURL}
                placeholder="baseURL e.g. https://api.deepseek.com"
              />
              <input
                name="apiKey"
                type="password"
                defaultValue={modelConfig.apiKey}
                placeholder="apiKey e.g. sk-13abac12..."
              />
              <input
                name="model"
                type="text"
                defaultValue={modelConfig.model}
                placeholder="model e.g. deepseek-chat"
              />
              <label htmlFor="max_tokens">
                Max Tokens: {modelConfig.max_tokens}
              </label>
              <input
                name="max_tokens"
                type="range"
                min={0}
                max={8192}
                step={10}
                defaultValue={modelConfig.max_tokens}
                onChange={(e) => {
                  setModelConfig((prev) => ({
                    max_tokens: Number(e.target.value),
                    baseURL: prev.baseURL,
                    apiKey: prev.apiKey,
                    model: prev.model,
                  }));
                }}
                placeholder="model e.g. deepseek-chat"
              />
            </>
          )}
          <button type="submit">{isEditModelConfig ? '💾' : '✍'}</button>
        </form>
      )}

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
            model={activeModel}
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
