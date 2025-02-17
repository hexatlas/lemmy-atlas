import React, { useEffect, useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import LLMao from '../../components/shared/LLMao';
import LegendLayout from '../../components/shared/LegendLayout';

import Markdown from '../../components/shared/Markdown';
import ollama from 'ollama/browser';

type Message = {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
};

type MessageWithThinking = Message & {
  finishedThinking?: boolean;
  think?: string;
};

function useMessagesWithThinking(messages: Message[]) {
  return useMemo(
    () =>
      messages.map((m: Message): MessageWithThinking => {
        if (m.role === 'assistant') {
          if (m.content.includes('</think>')) {
            return {
              ...m,
              finishedThinking: true,
              think: m.content
                .split('</think>')[0]
                .replace('</think>', '')
                .replace('<think>', ''),
              content: m.content.split('</think>')[1],
            };
          } else {
            return {
              ...m,
              finishedThinking: false,
              think: m.content.replace('<think>', ''),
              content: '',
            };
          }
        }
        return m;
      }),
    [messages],
  );
}

export const Route = createFileRoute('/information/chat')({
  component: ChatRouteComponent,
});

function ChatRouteComponent() {
  const [input, setInput] = useState('');
  const [premise, setPremise] = useState(
    `
  [Core Framework]
    
  You are a triple-aspect dialectical engine combining:
  1. Socratic Maieutics - Epistemological midwifery
  2. Hegelian Synthesis - Aufhebung processor
  3. Marxist Materialism - Historical contingency analyzer
  
  
  [Operational Protocol]
  
  - Maintain 3 parallel context layers:
  A) Immediate dialogue
  B) Historical dialectical progression
  C) Material conditions matrix
  - Use phase-specific response patterns
  - Track conceptual contradictions explicitly

  
  [Processing Rules]
  
  1. Phase Handling:
  - socratic: Challenge premises via elenchus
  - hegelian: Identify aufhebung opportunities
  - marxist: Root analysis in material conditions
  
  2. Contradiction Management:
  - When detecting contradictions:
  a) Categorize (Logical/Material/Dialectical)
  b) Preserve in tension matrix
  c) Map to historical precedents
  
  3. Synthesis Protocol:
  - Require 3-stage validation: 
  1. Material feasibility check 
  2. Historical progress alignment 
  3. Epistemological consistency test
  
  
  [Implementation Notes]
  
  1. Maximum dialectical depth: 7 layers
  2. Minimum material context required for Marxist phase
  3. Auto-escalate abstraction after 3 contradictions
  4. Default phase rotation: Socratic → Hegelian → Marxist
  `,
  );
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: premise },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(messages, 'chat.tsx');
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setLoading(true);

    const messagesWithInput: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(messagesWithInput);

    const stream = await ollama.chat({
      model: 'deepseek-r1:14b',
      messages: messagesWithInput,
      stream: true,
    });
    if (stream) {
      let assistantResponse = '';
      for await (const part of stream) {
        assistantResponse += part.message.content;
        console.log(assistantResponse);
        setMessages([
          ...messagesWithInput,
          {
            role: 'assistant',
            content: assistantResponse,
          },
        ]);
      }
    }
    setLoading(false);
  };

  const messagesWithThinkingSplit = useMessagesWithThinking(messages);

  return (
    <LegendLayout>
      <LLMao></LLMao>
      <details>
        <summary>System Prompt</summary>
        <textarea
          name={'premise'}
          style={{ width: '100%' }}
          value={premise}
          onChange={(e) => setPremise(e.target.value)}
        />
      </details>

      {messagesWithThinkingSplit
        .filter(({ role }) => role === 'user' || role === 'assistant')
        .map((m, index) => (
          <ChatMessage key={index} message={m} />
        ))}

      <form onSubmit={handleSubmit} className="container wrapper">
        <span>💬</span>
        <input
          className=""
          value={input}
          disabled={loading}
          placeholder="Ask LLMao"
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? <div className="loading"></div> : '📨'}
          <span className="sr-only">Send message</span>
        </button>
      </form>
    </LegendLayout>
  );
}

const ChatMessage: React.FC<{ message: MessageWithThinking }> = ({
  message,
}) => {
  return (
    <div className={`${message.role === 'user' && 'container neutral'}`}>
      <span className="">
        {message.role === 'user'
          ? '🚩'
          : !message.finishedThinking
            ? '⏳'
            : '🤖'}

        <span>{message.role === 'user' ? 'You' : 'LLMao'}</span>
      </span>

      {message.role === 'assistant' && (
        <details>
          <summary>Thoughts</summary>{' '}
          {message.think && (
            <blockquote className="">
              <Markdown>{message.think}</Markdown>
            </blockquote>
          )}
        </details>
      )}

      {message.role === 'assistant' && !message.finishedThinking && (
        <span className="thinking">Thinking...</span>
      )}

      <article className={`${message.role === 'user' ? '' : ''}`}>
        <Markdown>{message.content}</Markdown>
      </article>
    </div>
  );
};
