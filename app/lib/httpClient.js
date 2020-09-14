export async function get(url) {
  return fetch(url, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API returned the status code: ${response.status}`);
      }

      return response.json();
    });
}

export async function post(url, payload) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API returned the status code: ${response.status}`);
      }

      return response.json();
    });
}
