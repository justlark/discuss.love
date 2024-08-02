const API_URL = import.meta.env.VITE_API_URL;

export const sessionsEndpoint = (code?: string) =>
  code ? `${API_URL}/sessions/${code}` : `${API_URL}/sessions`;

export const submissionsEndpoint = (code?: string, player?: string) => {
  if (code && player) {
    return `${API_URL}/submissions/${code}/${player}`;
  } else if (code) {
    return `${API_URL}/submissions/${code}`;
  } else {
    return `${API_URL}/submissions`;
  }
};

export const questionsEndpoint = (checksum?: string) =>
  checksum ? `${API_URL}/questions/${checksum}` : `${API_URL}/questions`;
