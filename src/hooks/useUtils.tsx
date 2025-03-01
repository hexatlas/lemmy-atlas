// import center from "@turf/center";
import { useState, useEffect, SetStateAction, Dispatch } from 'react';

// STORAGE

function getSavedValue(key, initialValue, storage) {
  try {
    const savedValue = JSON.parse(storage.getItem(key));
    if (savedValue) return savedValue;
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
  } catch (error) {
    console.log(error);
  }
}

export function useStateStorage<T>(
  key,
  initialValue,
  isLocalStorage = false,
): [T, Dispatch<SetStateAction<T>>] {
  const storage = isLocalStorage ? localStorage : sessionStorage;
  const [value, setValue] = useState<T>(() => {
    return getSavedValue(key, initialValue, storage);
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
}

// JSON to JSX Recursive

// export const RecursiveJSONComponent = ({ data }) => {
//   const renderData = (data, nestingIndex = 0) => {
//     if (Array.isArray(data)) {
//       return (
//         <ul className={`nextindex-${nestingIndex}`}>
//           {data.map((item, index) => (
//             <li key={index}>{renderData(item, nestingIndex + 1)}</li>
//           ))}
//         </ul>
//       );
//     } else if (typeof data === 'object') {
//       return (
//         <ul className={`nextindex-${nestingIndex}`}>
//           {Object.keys(data).map((key, index) => (
//             <li key={index}>
//               <strong>{key}:</strong> {renderData(data[key], nestingIndex + 1)}
//             </li>
//           ))}
//         </ul>
//       );
//     } else {
//       return String(data);
//     }
//   };

//   return <div>{renderData(data)}</div>;
// };
