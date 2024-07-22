import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSpring, animated } from 'react-spring';
import './App.css';

const ItemType = 'TAB';

function Tab({ id, title, index, moveTab, setActiveTab, activeTab }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTab(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const springProps = useSpring({
    opacity: activeTab === id ? 1 : 0.6,
    transform: activeTab === id ? 'scale(1.1)' : 'scale(1)',
  });

  return (
    <animated.button
      ref={(node) => ref(drop(node))}
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
      style={springProps}
    >
      {title} (ID: {id})
    </animated.button>
  );
}

function TabContent({ tabId, content, handleChange }) {
  return (
    <div>
      <input type="text" value={content} onChange={(e) => handleChange(tabId, e.target.value)} />
      <p>Girdiğiniz metin: {content}</p>
      <button className="but" onClick={() => alert('Metin kaydedildi: ' + content)}>Kaydet</button>
      <button className="but" onClick={() => handleChange(tabId, '')}>Sil</button>
    </div>
  );
}

function App() {
  const [tabs, setTabs] = useState([{ id: 0, title: 'Sekme 1', content: '' }]);
  const [activeTab, setActiveTab] = useState(0);
  const [nextId, setNextId] = useState(1); // Benzersiz ID'ler için sayaç

  const addTab = () => {
    const newTab = { id: nextId, title: `Sekme ${nextId + 1}`, content: '' };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setNextId(nextId + 1); // ID sayacını arttır
  };

  const removeTab = (id) => {
    const updatedTabs = tabs.filter(tab => tab.id !== id);
    setTabs(updatedTabs);
    if (updatedTabs.length > 0) {
      setActiveTab(updatedTabs[0].id);
    } else {
      setActiveTab(null);
    }
  };

  const moveTab = (fromIndex, toIndex) => {
    const updatedTabs = [...tabs];
    const [movedTab] = updatedTabs.splice(fromIndex, 1);
    updatedTabs.splice(toIndex, 0, movedTab);
    setTabs(updatedTabs);
  };

  const handleChange = (id, value) => {
    const updatedTabs = tabs.map(tab => (tab.id === id ? { ...tab, content: value } : tab));
    setTabs(updatedTabs);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="tab-container">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              id={tab.id}
              title={tab.title}
              index={index}
              moveTab={moveTab}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
          ))}
          <button className="tab-button" onClick={addTab}>Yeni Sekme Ekle</button>
        </div>
        <div className="tab-content">
          {tabs.map((tab, index) => (
            <div key={index} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
              <TabContent tabId={tab.id} content={tab.content} handleChange={handleChange} />
              <button className="but" onClick={() => removeTab(tab.id)}>Sekmeyi Kapat</button>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
