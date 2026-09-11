import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import loadingWebm from '../assets/videos/Loading.webm';
import loadingMp4 from '../assets/videos/Loading.mp4';
import './Preloader.css';

const Preloader = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const heroVideoRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handler);
    else mediaQuery.addListener(handler);
    
    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', handler);
      else mediaQuery.removeListener(handler);
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1800);

    // Safety fallback: maximum 8s timeout in case of slow mobile network
    const fallbackTimer = setTimeout(() => {
      setIsHeroReady(true);
      setMinTimeElapsed(true);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Check if hero video is already cached/buffered (for mobile)
  useEffect(() => {
    if (!isDesktop && heroVideoRef.current && heroVideoRef.current.readyState >= 3) {
      setIsHeroReady(true);
    }
  }, [isDesktop]);

  // Preload desktop frames
  useEffect(() => {
    if (!isDesktop) return;

    let loadedCount = 0;
    const totalFrames = 77;
    let hasErrored = false;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalFrames && !hasErrored) {
        setIsHeroReady(true);
      }
    };

    const onImageError = () => {
      if (!hasErrored) {
        hasErrored = true;
        setIsHeroReady(true); // Fallback to avoid hanging
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const padded = String(i).padStart(3, '0');
      img.onload = onImageLoad;
      img.onerror = onImageError;
      img.src = `${process.env.PUBLIC_URL}/robot-frames/frame_${padded}.webp`;
    }
  }, [isDesktop]);

  // When BOTH the target Hero video is buffered AND min time has passed, complete preloading
  useEffect(() => {
    if (isHeroReady && minTimeElapsed && isPlaying) {
      const exitTimer = setTimeout(() => {
        setIsPlaying(false);
        setTimeout(() => {
          onComplete();
        }, 600); // Allow fade-out animation
      }, 300);

      return () => clearTimeout(exitTimer);
    }
  }, [isHeroReady, minTimeElapsed, isPlaying, onComplete]);

  const handleHeroLoaded = () => {
    setIsHeroReady(true);
  };

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div 
          className="preloader-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Preloader Animation Video with WebM & MP4 fallback */}
          <video 
            className="preloader-video"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src={loadingWebm} type="video/webm" />
            <source src={loadingMp4} type="video/mp4" />
          </video>

          {/* Hidden Hero Video Preloader for Mobile */}
          {!isDesktop && (
            <video
              ref={heroVideoRef}
              src={`${process.env.PUBLIC_URL}/Hero_mob2.mp4`}
              preload="auto"
              muted
              playsInline
              onLoadedData={handleHeroLoaded}
              onCanPlay={handleHeroLoaded}
              onCanPlayThrough={handleHeroLoaded}
              onError={handleHeroLoaded}
              style={{ display: 'none' }}
            />
          )}

          {/* Clean Loading indicator text */}
          <p className="preloader-status-text">
            Initializing Systems...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
