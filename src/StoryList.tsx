import React, { useState, useEffect } from 'react';
import './StoryList.scss';

function Home() {
  const storyList = [1,2,3,4]
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImageLoading, setImageLoading] = useState(true);
  const [isFetchingData, setFetchingData] = useState(true);
  const [currentImg, setCurrentImg] = useState('');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [modalData, setModalData] = useState([{ download_url: ''}])
  function updateImage (url: string, index: number) {
    setImageLoading(true)
    setCurrentImg(url)
    setCurrentImgIndex(index)
    console.log('isImageLoading', isImageLoading);
    
  }
  function onSuccess (res: Array<{ download_url: ''}>) {
    console.log('res', res)
    setModalData(res)
    setTimeout(() => {
      updateImage(res[0].download_url, 0)
    }, 0);
  }
  function fetchStory (index: number) {
    console.log('Index fetch', index)
    const url = `https://picsum.photos/v2/list?page=${index}&limit=${index}`
    fetch(url, {
      method: 'GET',
    }).then((res) => {
      res.json().then((body) => onSuccess(body))
      setFetchingData(false)
    })
  }
  function handleListSelection (index: number) {
    setCurrentProfileIndex(index)
    fetchStory(index)
    setImageLoading(true)
    setModalVisible(true)
  }
  function handleClick (event: {clientX: any, clientY: any}) {
    const x = event.clientX;
    console.log('adcsd ', x, window.innerWidth);
    if (x < window.innerWidth / 2) {
      if (currentImgIndex > 0) {
        updateImage(modalData[currentImgIndex - 1].download_url, currentImgIndex - 1)
      } else if (currentProfileIndex > 1) {
        handleListSelection(currentProfileIndex - 1)
      } else {
        setModalVisible(false)
        setModalData([])
      }
    } else {
      if (currentImgIndex < modalData.length - 1) {
        updateImage(modalData[currentImgIndex + 1].download_url, currentImgIndex + 1)
      } else if (currentProfileIndex < storyList.length) {
        handleListSelection(currentProfileIndex + 1)
      } else {
        setModalVisible(false)
        setModalData([])
      }
    }
    
  }
  return (
    <div className="story-list">
      {
        storyList.map(function (index) {
          return <div className="icon">
          <img src={`https://picsum.photos/200?random=${index}`} alt="" onClick={() => handleListSelection(index)} />
        </div>
        })
      }
      {
        isModalVisible && !isFetchingData &&
        <div className="story-list__modal">
          <div className="story-list__modal--content">
            { isImageLoading && <div className="loader"></div> }
            <div className="story-image">
              <img src={currentImg} alt=""
                onClick={(e) => handleClick(e)}
                onLoad={() => { console.log('loaded'); setImageLoading(false)}}
                className={isImageLoading ? 'loading-image' : ''}
              />
            </div>
            <div className="stepper-container">
              {
                modalData.map(function (item, index) {
                  return <div className={`stepper ${index <= currentImgIndex ? 'active' : ''}`}></div>
                })
              }
            </div>
          </div>
        </div>
      }
      {
        isModalVisible && isFetchingData &&
        <div className="story-list__modal">
          <div className="story-list__modal--content">
            <div className="loader"></div>
          </div>
        </div>
      }
    </div>
  );
}

export default Home;
