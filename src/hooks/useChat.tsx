import React, { useEffect, useMemo, useState } from 'react';
import ollama, { ListResponse, Message } from 'ollama/browser';
import { MessageWithThinking } from '../types/atlas.types';

function useChat({
  activeModel,
}: {
  activeModel: string;
}): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  MessageWithThinking[],
  (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  boolean,
  ListResponse,
] {
  const [models, setModels] = useState<ListResponse>({ models: [] });
  const [systemPrompt, setSystemPrompt] = useState(
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
  const [userPrompt, setUserPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: systemPrompt as string },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesWithThinkingSplit = useMessagesWithThinking(messages);

  const handleSendPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserPrompt('');
    setLoading(true);

    const messagesWithInput: Message[] = [
      ...messages,
      { role: 'user', content: userPrompt },
    ];
    setMessages(() => messagesWithInput);

    const stream = await ollama.chat({
      model: activeModel,
      messages: messagesWithInput,
      stream: true,
    });

    if (stream) {
      let assistantResponse = '';
      for await (const part of stream) {
        assistantResponse += part.message.content;

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

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await ollama.list();
        setModels(response);
      } catch (error) {}
    };
    fetchModels();
  }, []);

  return [
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    messagesWithThinkingSplit,
    handleSendPrompt,
    loading,
    models,
  ];
}

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

export default useChat;
