import React, { useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { useHistory } from "react-router-dom";



const Context = React.createContext();

export function ContextProvider({ children }) {

  const ctx = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(ctx.current);
  }, [])

  return (
    <>
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
      <div ref={ctx} />
    </>
  );
}

// export function Modal({ onClose, children }) {
//   const modalNode = useContext(ModalContext);
//   if (!modalNode) return null;

//   return ReactDOM.createPortal(
//     <div id="modal">
//       <div id="modal-background" onClick={onClose} />
//       <div id="modal-content">
//         {children}
//       </div>
//     </div>,
//     modalNode
//   );
// }
