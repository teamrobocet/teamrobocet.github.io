import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import clubLogo from '../assets/images/robocet_trimmed.webp';
import './Hero.css';

const TOTAL_FRAMES = 77;

function useTypewriter(text, speed = 90, startDelay = 400, startTrigger = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTrigger) return;
    let timeout;
    let charIndex = 0;

    const type = () => {
      if (charIndex < text.length) {
        setDisplayed(text.substring(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(type, speed);
      } else {
        setDone(true);
      }
    };

    timeout = setTimeout(type, startDelay);

    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, startTrigger]);

  return { displayed, done };
}

const Hero = ({ isLoading = false }) => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const isInitializedRef = useRef(false);

  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const descText = "The flagship robotics club of College of Engineering Trivandrum. Designing autonomous systems, intelligent robotics, and inspiring the next generation of engineers.";
  const { displayed: typedDesc, done: descDone } = useTypewriter(descText, 30, 400, !isLoading);

  // Draw frame to canvas with object-fit: cover and object-position: 70% center
  const drawFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const canvasRatio = w / h;
    const imgRatio = imgW / imgH;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = w;
      drawH = w / imgRatio;
      drawX = 0;
      drawY = (h - drawH) * 0.5;
    } else {
      drawH = h;
      drawW = h * imgRatio;
      drawY = 0;
      // 70% horizontal alignment matches the robot's placement on the right
      drawX = (w - drawW) * 0.7;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Preload all 77 WebP frames (ONLY ON DESKTOP)
  useEffect(() => {
    if (!isDesktop) return;

    const loadedImages = [];
    let firstLoaded = false;

    const onFirstLoad = () => {
      if (!firstLoaded) {
        firstLoaded = true;
        isInitializedRef.current = true;
        drawFrame(0);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(3, '0');
      img.src = `${process.env.PUBLIC_URL}/robot-frames/frame_${padded}.webp`;
      if (i === 1) {
        img.onload = onFirstLoad;
      }
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, [drawFrame, isDesktop]);

  // Handle Canvas Resize (ONLY ON DESKTOP)
  useEffect(() => {
    if (!isDesktop) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;

      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, isDesktop]);

  // Butter-Smooth rAF Lerp Loop & Cursor Tracking (ONLY ON DESKTOP)
  useEffect(() => {
    if (!isDesktop) return;

    let rafId = null;

    const animateLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.005) {
        // Smooth exponential lerp
        currentFrameRef.current += diff * 0.2;
        const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
        drawFrame(frameIndex);
      }
      rafId = requestAnimationFrame(animateLoop);
    };

    rafId = requestAnimationFrame(animateLoop);

    const onMouseMove = (e) => {
      // Only track when hero section is in view
      if (window.scrollY > (window.innerHeight || 800)) return;

      // Position mapping:
      // When cursor moves left (clientX -> 0), ratio -> 0:
      // Frame 0: Robot looks directly forward toward screen & text!
      // When cursor moves right (clientX -> innerWidth), ratio -> 1:
      // Frame 76: Robot turns head away
      const ratio = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      targetFrameRef.current = ratio * (TOTAL_FRAMES - 1);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [drawFrame, isDesktop]);

  return (
    <section ref={heroRef} id="home" className="mainframe-hero relative w-full h-screen flex flex-col !justify-start pt-24 pb-10 md:!justify-center md:pt-0 md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden text-white">
      {/* High-Performance Canvas for WebP Image Sequence (Desktop) */}
      {isDesktop && (
        <canvas
          ref={canvasRef}
          className="mainframe-hero-canvas absolute inset-0 w-full h-full"
        />
      )}

      {/* Auto-playing Video for Mobile */}
      {!isDesktop && (
        <video
          className="mainframe-hero-video-mobile absolute inset-0 w-full h-full object-cover opacity-80"
          src={`${process.env.PUBLIC_URL}/Hero_mob2.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Hero Content Container */}
      <div className="mainframe-hero-content max-w-xl relative z-10 w-full flex flex-col h-full justify-between md:h-auto md:justify-start">
        <div className="top-content">
          {/* Largely Sized RoboCET Club Logo (Hidden on Mobile) */}
          <div className="hero-club-logo-wrap !hidden md:!inline-flex">
            <img src={clubLogo} alt="RoboCET Logo" className="hero-club-logo-img" />
          </div>

          {/* Hero Description - Clean Monochrome */}
          <p className="hero-club-desc min-h-[4rem]">
            {typedDesc}
            {!descDone && <span className="hero-cursor" style={{ height: '0.8em', marginLeft: '4px' }} />}
          </p>
        </div>

        {/* Action Buttons - Pure Black & White */}
        <div className={`hero-club-actions mb-4 md:mb-0 transition-opacity duration-1000 ${descDone ? 'opacity-100' : 'opacity-0'}`}>
          <a href="#events" className="hero-btn-primary">
            <span>Discover Events</span>
            <ArrowRight size={16} />
          </a>
          
          <a href="#about" className="hero-btn-secondary">
            <span>About Club</span>
          </a>

          <Link to="/sponsor" className="hero-btn-sponsor">
            <Sparkles size={15} />
            <span>Sponsor Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
