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
      <div className="post">
        <div className="name">Flexiple</div>
        <img src="https://picsum.photos/400" alt="" />
        <div className="caption">This is a post</div>
      </div>
    </div>
  );
}

export default Home;
