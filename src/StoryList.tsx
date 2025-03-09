import React, { useState } from 'react';
import './StoryList.scss';

function Home() {
  const storyList = [1,2,3,4,5,6,7]
  const [isModalVisible, setModalVisible] = useState(false);
  const [isImageLoading, setImageLoading] = useState(true);
  const [isFetchingData, setFetchingData] = useState(true);
  const [currentImg, setCurrentImg] = useState('');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [modalData, setModalData] = useState([{ download_url: '', author: ''}])
  const [timeoutId, setTimeoutId] = useState(setTimeout(() => '', 0));
  function updateImage (url: string, index: number) {
    setImageLoading(true)
    setCurrentImg(url)
    setCurrentImgIndex(index)
  }
  function onSuccess (res: Array<{ download_url: '', author: ''}>) {
    console.log('res', res)
    setModalData(res)
    updateImage(res[0].download_url, 0)
  }
  function fetchStory (index: number) {
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
  function handleClick (event: {clientX: any}) {
    clearTimeout(timeoutId)
    const x = event.clientX;
    if (x < window.innerWidth / 2) {
      if (currentImgIndex > 0) {
        updateImage(modalData[currentImgIndex - 1].download_url, currentImgIndex - 1)
      } else if (currentProfileIndex > 1) {
        handleListSelection(currentProfileIndex - 1)
      } else {
        setModalVisible(false)
        setModalData([])
        clearTimeout(timeoutId)
      }
    } else {
      if (currentImgIndex < modalData.length - 1) {
        updateImage(modalData[currentImgIndex + 1].download_url, currentImgIndex + 1)
      } else if (currentProfileIndex < storyList.length) {
        handleListSelection(currentProfileIndex + 1)
      } else {
        setModalVisible(false)
        setModalData([])
        clearTimeout(timeoutId)
      }
    }
    
  }
  return (
    <div className="story-list" data-testId="story-list-items">
      {
        storyList.map(function (index) {
          return <div className="icon" >
          <img src={`https://picsum.photos/200?random=${index}`} alt="" data-testId="list-item" onClick={() => handleListSelection(index)} />
        </div>
        })
      }
        <div className={"story-list__modal" + (isModalVisible ? ' visible-modal' : '')}>
          <div className="story-list__modal--content">
            { (isImageLoading || isFetchingData) && <div className="loader"></div> }
            <div className="story-image">
              <img src={currentImg} alt=""
                onClick={(e) => handleClick(e)}
                onLoad={() => { 
                  clearTimeout(timeoutId)
                  setTimeoutId(setTimeout(() => {
                    clearTimeout(timeoutId)
                    handleClick({clientX: window.innerWidth})
                  }, 5000));
                  console.log('timeoutId', timeoutId)
                  setImageLoading(false)
                }}
                className={isImageLoading ? 'loading-image' : ''}
              />
            </div>
            <div className="header">
              <div className='name'>
                <div data-testId="author">{modalData[currentImgIndex]?.author}</div>
                <div className='close-icon' data-testId="close-icon" onClick={() => {setModalVisible(false); setModalData([]); setCurrentImgIndex(0)}}>×</div>
              </div>
              <div className="stepper-container">
                {
                  modalData.map(function (item, index) {
                    return <div className={`stepper`}>
                      { index < currentImgIndex && <div className='active' key={item.download_url}></div>}
                      { index === currentImgIndex && !isImageLoading && <div className='animated-active' key={item.download_url}></div>}
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Home;
