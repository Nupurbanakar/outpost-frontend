const AI_PREFERENCE_KEY = 'outpost_ai_ranking_enabled';

/**
 * Get the user's AI ranking preference from localStorage
 */
export function getAIPreference(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const stored = window.localStorage.getItem(AI_PREFERENCE_KEY);
    return stored === 'true';
  } catch (error) {
    console.error('Error reading AI preference from localStorage:', error);
    return false;
  }
}

/**
 * Save the user's AI ranking preference to localStorage
 */
export function setAIPreference(enabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    window.localStorage.setItem(AI_PREFERENCE_KEY, String(enabled));
  } catch (error) {
    console.error('Error saving AI preference to localStorage:', error);
  }
}
