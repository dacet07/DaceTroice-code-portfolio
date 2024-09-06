import { ContentData, AccordionData, Language } from "../types/types";

export type ActionContent =
  | { type: 'SET_CONTENT_DATA'; payload: ContentData[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean };

  export type ActionAccordion =
  | { type: 'SET_CONTENT_DATA'; payload: AccordionData[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean };

export type StateContent = {
  contentDataArray: ContentData[];
  error: string | null;
  loading: boolean;
};

export const initialStateContent: StateContent = {
  contentDataArray: [],
  error: null,
  loading: true,
};

export type StateAccordion = {
  contentDataArray: AccordionData[];
  error: string | null;
  loading: boolean;
};

export const initialStateAccordion: StateAccordion = {
  contentDataArray: [],
  error: null,
  loading: true,
};

export const contentReducer = (state: StateContent, action: ActionContent): StateContent => {
  switch (action.type) {
    case 'SET_CONTENT_DATA':
      return { ...state, contentDataArray: action.payload, error: null, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const accordionReducer = (state: StateAccordion, action: ActionAccordion): StateAccordion => {
  switch (action.type) {
    case 'SET_CONTENT_DATA':
      return { ...state, contentDataArray: action.payload, error: null, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const fetchData = async <T>(
  lang: Language,
  dbFileName: string,
  dispatch: React.Dispatch<{ type: 'SET_CONTENT_DATA' | 'SET_ERROR' | 'SET_LOADING'; payload: any }>,
  retries = 3, 
  delay = 1000 
): Promise<void> => {
  dispatch({ type: 'SET_LOADING', payload: true });

  try {
    const res = await fetch(`http://localhost:5000/api/${lang}/${dbFileName}`); 
    if (res.status === 429 && retries > 0) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || `${delay / 1000}`, 10);
      console.warn(`429 Too Many Requests, retrying after ${retryAfter} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchData(lang, dbFileName, dispatch, retries - 1, delay * 2); 
    }
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      dispatch({ type: 'SET_CONTENT_DATA', payload: data as T[] });
    } else if (data && Array.isArray(data.content)) {
      dispatch({ type: 'SET_CONTENT_DATA', payload: data.content as T[] });
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid response format: Missing or invalid data' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    dispatch({ type: 'SET_ERROR', payload: 'Error fetching data. Please try again later.' });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

