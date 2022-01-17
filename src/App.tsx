import React, { useState } from 'react';
import { Note } from 'models/note.model';
import Header from 'components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: new Date().toString(),
      title: 'Meetings',
      text: 'Schedult meeting with React',
      color: '#dfdfdf',
      date: new Date().toString(),
    },
  ]);

  return (
    <div className='App'>
      <Header></Header>
    </div>
  );
}

export default App;
