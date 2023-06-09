import { useState } from "react"



export function useLocalStorage(key: string, defaultValue?: any): [any, (arg: any) => void] {
    const localValue = localStorage.getItem(key);
    const localValueObj = localValue ? JSON.parse(localValue) : null
    const [state, setState] = useState(localValueObj ?? defaultValue ?? {});
    
    const setStateWrapper = (arg: any) => {
      setState(arg);
      localStorage.setItem(key, JSON.stringify(arg));
    };
    
    return [state, setStateWrapper];
  }