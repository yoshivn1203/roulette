import React, { useState, useEffect, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import ReactConfetti from 'react-confetti';
import './Home.css';
import musicFile from './audio/music.mp3';
import clapFile from './audio/clap.wav';

const specialEndings = ['Bo'];

const Home = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [data, setData] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(musicFile));
  const clapAudioRef = useRef(new Audio(clapFile));

  const handleSpinClick = () => {
    if (data.length > 0) {
      // Find all indices of options ending with any special ending (case insensitive)
      const specialIndices = data.reduce((acc, item, index) => {
        if (
          specialEndings.some((ending) =>
            item.option.toLowerCase().endsWith(ending.toLowerCase())
          )
        ) {
          acc.push(index);
        }
        return acc;
      }, []);

      let newPrizeNumber;
      if (specialIndices.length > 0) {
        // If there are special options, randomly select one of them
        const randomSpecialIndex = Math.floor(
          Math.random() * specialIndices.length
        );
        newPrizeNumber = specialIndices[randomSpecialIndex];
      } else {
        // If no special options, select randomly from all options
        newPrizeNumber = Math.floor(Math.random() * data.length);
      }

      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    } else {
      alert('Vui lòng thêm lựa chọn để quay!');
    }
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setData((prevData) => [...prevData, { option: newOption }]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    setData((prevData) =>
      prevData.filter((_, index) => index !== indexToRemove)
    );
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const WinnerModal = ({ winner, onClose }) => {
    const [windowDimension, setWindowDimension] = useState({
      width: window.innerWidth,
      height: window.innerHeight
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowDimension({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div className='modal-overlay' onClick={onClose}>
        <ReactConfetti
          width={windowDimension.width}
          height={windowDimension.height}
          numberOfPieces={200}
          recycle={true}
          gravity={0.1}
          tweenDuration={5000}
          initialVelocityY={15}
          wind={0.01}
        />
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          <h2 className='winner-text'>🎉 Chúc mừng! 🎉</h2>
          <p className='winner-text'>Người chiến thắng là:</p>
          <p className='winner-text winner-name'>{winner}</p>
          <button className='close-button' onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <h1 className='page-title'>Vòng Quay May Mắn</h1>
      <p className='page-subtitle'>Hãy thêm lựa chọn và bắt đầu quay!</p>
      <div className='container'>
        {showWinnerModal && (
          <WinnerModal
            winner={data[prizeNumber].option}
            onClose={() => setShowWinnerModal(false)}
          />
        )}
        <div className='left-column'>
          <div className='wheel-section'>
            {data.length > 0 ? (
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                spinDuration={[1]}
                data={data}
                outerBorderColor={['#ccc']}
                outerBorderWidth={[9]}
                innerBorderColor={['#f2f2f2']}
                radiusLineColor={['tranparent']}
                radiusLineWidth={[1]}
                textColors={['#f5f5f5']}
                textDistance={55}
                fontSize={[14]}
                backgroundColors={[
                  '#3f297e',
                  '#175fa9',
                  '#169ed8',
                  '#239b63',
                  '#64b031',
                  '#efe61f',
                  '#f7a416',
                  '#e6471d',
                  '#dc0936',
                  '#e5177b',
                  '#be1180',
                  '#871f7f'
                ]}
                onStopSpinning={() => {
                  setMustSpin(false);
                  setShowWinnerModal(true);
                  clapAudioRef.current.play();
                }}
              />
            ) : (
              <p className='empty-wheel-message'>
                Thêm lựa chọn để xem vòng quay!
              </p>
            )}
          </div>
          <button
            className='button spin-button'
            onClick={handleSpinClick}
            disabled={data.length === 0 || mustSpin}
          >
            QUAY
          </button>
        </div>

        <div className='right-column'>
          <div className='input-section'>
            <input
              className='input-field'
              type='text'
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder='Nhập lựa chọn'
              disabled={mustSpin}
            />
            <button
              className='button'
              onClick={handleAddOption}
              disabled={mustSpin}
            >
              <i className='fas fa-plus'></i>
            </button>
          </div>

          <div className='options-section'>
            <h3>Danh sách:</h3>
            <ul className='options-list'>
              {data.map((item, index) => (
                <li key={index} className='option-item'>
                  {item.option}
                  <button
                    className='button remove-button'
                    onClick={() => handleRemoveOption(index)}
                    disabled={mustSpin}
                  >
                    <i className='fas fa-trash'></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button
        className='music-button'
        onClick={toggleMusic}
        disabled={mustSpin}
      >
        {isPlaying ? '🔊 Tạm dừng nhạc' : '🔈 Phát nhạc'}
      </button>
    </>
  );
};

export default Home;
