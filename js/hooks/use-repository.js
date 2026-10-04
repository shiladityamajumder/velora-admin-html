import { useEffect, useState, useCallback } from "../runtime/dom.js";
export function useRepository(service) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    let request = 0;
    const fetch = () => {
      const current = ++request;
      service.list().then((result) => {
        if (active && current === request)
          setState({ data: result.data, loading: false, error: null });
      }).catch((error) => {
        if (active && current === request)
          setState({
            data: [],
            loading: false,
            error: error instanceof Error ? error.message : "Something went wrong"
          });
      });
    };
    fetch();
    const unsubscribe = service.subscribe(fetch);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [service, revision]);
  return { ...state, reload };
}
