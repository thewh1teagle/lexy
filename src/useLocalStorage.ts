import { useState } from "react"

export function useLocalStorage(key: string, defaultValue?: string): [string, (arg: string) => void] {
    const localValue = localStorage.getItem(key);
    const [state, setState] = useState(localValue ?? defaultValue ?? '');
    
    const setStateWrapper = (arg: string) => {
      setState(arg);
      localStorage.setItem(key, arg);
    };
    
    return [state, setStateWrapper];
  }