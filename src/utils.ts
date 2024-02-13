import React from 'react'

interface UseBoolean {
  value: boolean
  setValue: (value: boolean) => void;
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

export function useBoolean(defaultValue?: boolean): UseBoolean {
  const [value, setValue] = React.useState(defaultValue ?? false);
  const toggle = React.useCallback(() => setValue(x => !x), []);
  const setTrue = React.useCallback(() => setValue(true), []);
  const setFalse = React.useCallback(() => setValue(false), []);
  return { value, setValue, setTrue, setFalse, toggle }
}
