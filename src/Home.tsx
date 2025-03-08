import React from 'react';
import './Home.scss';
import StoryList from './StoryList'

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        Instagram
      </header>
      <StoryList />
    </div>
  );
}

export default Home;
