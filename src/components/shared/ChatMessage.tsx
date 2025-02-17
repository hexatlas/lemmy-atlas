import React from 'react';

import Markdown from '../../components/shared/Markdown';
import { MessageWithThinking } from '../../types/atlas.types';

const ChatMessage: React.FC<{
  message: MessageWithThinking;
  activeAdministrativeRegion;
}> = ({ message, activeAdministrativeRegion }) => {
  const highlightArray = [
    activeAdministrativeRegion.name,
    activeAdministrativeRegion.country,
    activeAdministrativeRegion.region,
    activeAdministrativeRegion['sub-region'],
    activeAdministrativeRegion['intermediate-region'],
  ];
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
        <details open={!message.finishedThinking}>
          <summary>
            {message.finishedThinking ? 'Thoughts' : 'Thinking...'}
          </summary>{' '}
          {message.think && (
            <blockquote className="">
              <Markdown highlight={highlightArray}>{message.think}</Markdown>
            </blockquote>
          )}
        </details>
      )}
      <article className={`${message.role === 'user' ? '' : ''}`}>
        <Markdown highlight={highlightArray}>{message.content}</Markdown>
      </article>
    </div>
  );
};

export default ChatMessage;
