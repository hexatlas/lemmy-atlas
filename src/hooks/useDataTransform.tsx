import React from 'react';

// Lemmy

export function userPronouns(usernameString) {
  if (usernameString)
    return usernameString.match(
      /((?<=\[)[a-zA-Z\/\s]+)|([a-zA-Z\/\s]+(?=\]))/g,
    );
}

export interface TimeAgoProps {
  dateString: string;
}

export function TimeAgo({ dateString }: TimeAgoProps) {
  const currentDate = new Date();
  const pastDate = new Date(dateString);

  const timeDifference = currentDate.getTime() - pastDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return (
      <span title={`${pastDate}`}>
        {years === 1 ? 'a year ago' : `${years} years ago`}
      </span>
    );
  } else if (months > 0) {
    return (
      <span title={`${pastDate}`}>
        {months === 1 ? 'a month ago' : `${months} months ago`}
      </span>
    );
  } else if (days > 0) {
    return (
      <span title={`${pastDate}`}>
        {days === 1 ? 'a day ago' : `${days} days ago`}
      </span>
    );
  } else if (hours > 0) {
    return (
      <span title={`${pastDate}`}>
        {hours === 1 ? 'an hour ago' : `${hours} hours ago`}
      </span>
    );
  } else if (minutes > 0) {
    return (
      <span title={`${pastDate}`}>
        {minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`}
      </span>
    );
  } else {
    return (
      <span title={`${pastDate}`}>
        {seconds <= 1 ? 'just now' : `${seconds} seconds ago`}
      </span>
    );
  }
}
