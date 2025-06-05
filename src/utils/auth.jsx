export function getAuthToken() {
    const localData = localStorage.getItem('authToken');
    if (localData) {
        try {
            const { token, expiry } = JSON.parse(localData);
            if (expiry > Date.now()) {
                console.log('Token found in localStorage');
                return token;
            } else {
                localStorage.removeItem('authToken');
            }
        } catch {
            localStorage.removeItem('authToken');
        }
    }

    const sessionToken = sessionStorage.getItem('authToken');
    console.log('Token from sessionStorage:', sessionToken);
    return sessionToken ;
}



export function setToken(token, rememberMe) {
    if (rememberMe) {
        const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem('authToken', JSON.stringify({ token, expiry }));
    } else {
        sessionStorage.setItem('authToken', token);
    }
}

export function clearToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
}

export function getTokenExpiryTime() {
  const localData = localStorage.getItem('authToken');
  if (localData) {
    try {
      const { expiry } = JSON.parse(localData);
      return expiry;
    } catch {
      return null;
    }
  }
  // Session tokens don’t have expiry → null
  return null;
}
