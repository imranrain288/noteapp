import React, { useEffect, createContext, useContext } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

const CRDTContext = createContext();

export const useCRDT = () => {
  const context = useContext(CRDTContext);
  if (!context) {
    throw new Error('useCRDT must be used within a CRDTProvider');
  }
  return context;
};

export const CRDTProvider = ({ children, roomName = 'default-room' }) => {
  const [ydoc, setYdoc] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const [sharedText, setSharedText] = React.useState(null);

  useEffect(() => {
    // Initialize Yjs document
    const doc = new Y.Doc();
    
    // Initialize WebRTC provider for real-time collaboration
    const webrtcProvider = new WebrtcProvider(roomName, doc);
    
    // Get the shared text type from the document
    const ytext = doc.getText('shared-text');

    setYdoc(doc);
    setProvider(webrtcProvider);
    setSharedText(ytext);

    return () => {
      webrtcProvider.destroy();
      doc.destroy();
    };
  }, [roomName]);

  const value = {
    ydoc,
    provider,
    sharedText,
  };

  return (
    <CRDTContext.Provider value={value}>
      {children}
    </CRDTContext.Provider>
  );
};
