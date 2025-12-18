
import React, { useState, useEffect } from 'react';
import { Story, AppState } from './types';
import Header from './components/Header';
import Library from './components/Library';
import StoryGenerator from './components/StoryGenerator';
import StoryReader from './components/StoryReader';
import { getAllStories, saveStoryToDB, deleteStoryFromDB } from './services/storageService';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.LIBRARY);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const storedStories = await getAllStories();
        setStories(storedStories.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("Masallar yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStories();
  }, []);

  const handleStoryCreated = async (story: Story) => {
    try {
      await saveStoryToDB(story);
      setStories(prev => [story, ...prev]);
      setActiveStory(story);
      setCurrentState(AppState.READING);
    } catch (error) {
      console.error("Masal kaydedilirken hata:", error);
      alert("Masal oluşturuldu ama kaydedilirken bir sorun çıktı.");
      // Yine de okuma moduna geçelim ki çocuk masalını görebilsin
      setActiveStory(story);
      setCurrentState(AppState.READING);
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await deleteStoryFromDB(id);
      setStories(stories.filter(s => s.id !== id));
    } catch (error) {
      console.error("Masal silinirken hata:", error);
    }
  };

  const handleStartGenerate = () => {
    setCurrentState(AppState.GENERATING);
  };

  const handleOpenStory = (story: Story) => {
    setActiveStory(story);
    setCurrentState(AppState.READING);
  };

  const handleBackToLibrary = () => {
    setCurrentState(AppState.LIBRARY);
    setActiveStory(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onHome={handleBackToLibrary} 
        onNew={handleStartGenerate}
        showButtons={currentState !== AppState.GENERATING}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-200 font-kids text-xl">Kitaplık hazırlanıyor...</p>
          </div>
        ) : (
          <>
            {currentState === AppState.LIBRARY && (
              <Library 
                stories={stories} 
                onOpen={handleOpenStory} 
                onDelete={deleteStory}
                onStartNew={handleStartGenerate}
              />
            )}

            {currentState === AppState.GENERATING && (
              <StoryGenerator 
                onCancel={handleBackToLibrary} 
                onComplete={handleStoryCreated} 
              />
            )}

            {currentState === AppState.READING && activeStory && (
              <StoryReader 
                story={activeStory} 
                onBack={handleBackToLibrary} 
              />
            )}
          </>
        )}
      </main>

      <footer className="py-6 text-center text-indigo-400/60 text-sm font-medium">
        ✨ Masal Diyarı - Hayallerin Gerçekleştiği Yer ✨
      </footer>
    </div>
  );
};

export default App;
