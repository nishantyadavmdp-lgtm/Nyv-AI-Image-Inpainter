import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Editor } from './components/Editor';

export default function App() {
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <Editor onBackToHome={() => setShowEditor(false)} />;
  }

  return <LandingPage onLaunchApp={() => setShowEditor(true)} />;
}