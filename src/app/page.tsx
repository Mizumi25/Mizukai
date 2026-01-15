'use client'

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './nikon-zr.css';

// Import images
import HomePreview from '../../public/nav/home-preview.jpg';
import AboutPreview from '../../public/nav/about-preview.jpg';
import ServicesPreview from '../../public/nav/services-preview.jpg';
import WorksPreview from '../../public/nav/works-preview.jpg';
import Profile from '../../public/images/profile.jpg';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const zoomSectionRef = useRef<HTMLElement>(null);
  const zoomInnerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const aboutBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Zoom section pinning - like Nikon reference
    const zoomSection = zoomSectionRef.current;
    const zoomInner = zoomInnerRef.current;
    
    if (zoomSection && zoomInner) {
      // Pin the inner content while scrolling through the section
      ScrollTrigger.create({
        trigger: zoomSection,
        start: 'top top',
        end: 'bottom bottom',
        pin: zoomInner,
        pinSpacing: false,
      });
    }

    // About section - pin background and scale
    const aboutSection = aboutSectionRef.current;
    const aboutBg = aboutBgRef.current;
    
    if (aboutSection && aboutBg) {
      ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top top',
        end: 'bottom bottom',
        pin: aboutBg,
        pinSpacing: false,
      });

      // Scale the background as you scroll
      gsap.to(aboutBg.querySelector('.bg-scale'), {
        scale: 1,
        scrollTrigger: {
          trigger: aboutSection,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });
    }

    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.anime');
    animatedElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => el.classList.add('on'),
      });
    });

    // Voice parallax - EXACT Nikon method (clones already exist in HTML)
    const articles = document.querySelectorAll('#nikon-voice article');
    
    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('top', entry.isIntersecting);
          console.log('TOP Observer:', entry.target.className, 'isIntersecting:', entry.isIntersecting);
        });
      },
      { root: null, rootMargin: '0% 0% -100% 0%', threshold: 0 }
    );

    const bottomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('bottom', !entry.isIntersecting);
        });
      },
      { root: null, rootMargin: '-100% 0% 0% 0%', threshold: 0 }
    );

    const inObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('in', entry.isIntersecting);
          console.log('IN Observer:', entry.target.className, 'isIntersecting:', entry.isIntersecting);
        });
      },
      { root: null, rootMargin: '-100% 0% 0% 0%', threshold: 0 }
    );

    articles.forEach((article) => {
      topObserver.observe(article);
      bottomObserver.observe(article);
      inObserver.observe(article);

      const clone = article.querySelector('.clone');
      const scrollarea = clone?.querySelector('.scrollarea');
      
      if (clone) {
        topObserver.observe(clone);
        bottomObserver.observe(clone);
        inObserver.observe(clone);
      }
      
      if (scrollarea) {
        topObserver.observe(scrollarea);
        bottomObserver.observe(scrollarea);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      topObserver.disconnect();
      bottomObserver.disconnect();
      inObserver.disconnect();
    };
  }, []);

  return (
    <div className="nikon-page">
      {/* Background Video */}
      <div id="nikon-bg-video">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/Home/LogoIntro.mp4"
        />
      </div>

      {/* Main Visual Section */}
      <section id="nikon-mv">
        <div className="inner">
          <h1 className="title">
            <span className="text-white text-2xl md:text-4xl font-light tracking-[0.3em]">PORTFOLIO</span>
          </h1>
          <h2 className="tagline">
            <span className="text-white text-3xl md:text-5xl font-serif">その先が見たいんだ。</span>
          </h2>
          <h2 className="logo">
            <span className="text-white text-xl md:text-2xl tracking-widest an">MIZUMI</span>
          </h2>
        </div>
        <div id="nikon-news">
          <ul>
            <li>
              <time className="an" dateTime="2024-01-01">2024.01.01</time>
              <h3 className="sans">
                <a href="#works">Welcome to my portfolio</a>
              </h3>
            </li>
          </ul>
        </div>
      </section>

      {/* Lead Section */}
      <section id="nikon-lead">
        <div className="inner">
          <div className="txt">
            <h2 className="tagline anime">
              <span className="text-white text-3xl md:text-4xl font-serif">その先が見たいんだ。</span>
            </h2>
            <p className="anime">
              この手を引いて走り出したら<br />
              きみとぼくはどこまで行けるだろう
            </p>
            <p className="anime">
              知らない道をあえて選んで<br />
              見たことない世界に飛び込んで<br />
              ふたり一緒ならきっと楽しい
            </p>
            <p className="anime">
              ぼくはこの手を引いて走り出す<br />
              次の景色をきみと見たい
            </p>
          </div>
        </div>
      </section>

      {/* Zoom Section - PINNED */}
      <section id="nikon-zoom" ref={zoomSectionRef}>
        <div className="inner" ref={zoomInnerRef}>
          <h2 className="logo">
            <span className="text-white text-4xl md:text-6xl tracking-[0.15em] font-light pc">PORTFOLIO</span>
            <span className="text-white text-3xl tracking-[0.15em] font-light sp">PORTFOLIO</span>
          </h2>
        </div>
      </section>

      {/* About Section - PINNED BACKGROUND */}
      <section id="nikon-about" ref={aboutSectionRef}>
        <div className="bg" ref={aboutBgRef}>
          <div className="bg-scale" style={{ transform: 'scale(0)' }}>
            <Image 
              src={HomePreview} 
              alt="Background" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="inner">
          <div className="txt">
            <h2 className="ttl anime">
              シネマカメラの<br />新しい選択肢
            </h2>
            <p className="anime">
              映画の世界で磨きあげられた<br />
              REDが生み出す、シネマルックな色。<br />
              豊かな階調と、自然な肌を描き出す力。
            </p>
            <p className="anime">
              そこで出会うのは<br />
              Nikonの光学技術と信頼。<br />
              ワンオペを支える自在さ、現場に応える頼もしさ。
            </p>
            <p className="anime">
              二つの力が重なったとき<br />
              シネマカメラは新しい姿へと進化する。
            </p>
            <p className="anime">
              REDのルックを。<br />
              Nikonの技術で。
            </p>
            <p className="anime">
              これまでにない自由と<br />
              軽やかさをまとって。
            </p>
            <p className="anime">
              さあ、シネマカメラの<br />
              次の景色を見にいこう。
            </p>

            {/* Concept Film */}
            <div className="movie anime brackets mt-16 cursor-pointer group">
              <div className="relative overflow-hidden">
                <Image 
                  src={AboutPreview} 
                  alt="Concept Film" 
                  className="w-full object-cover"
                />
                <video 
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  src="/videos/Home/DeCodeShowcase.mp4"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="btn-play">
                  <div>
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span className="text-white text-xs mt-1 block an">PLAY MOVIE</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex justify-between items-end">
                  <div>
                    <h3 className="dot an text-3xl md:text-5xl">
                      CONCEPT FILM
                      <span className="block text-base mt-2 font-serif">コンセプトフィルム</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spec Section */}
      <section id="nikon-spec">
        <div className="inner">
          <h2 className="dot an anime">SPEC</h2>
          <h3 className="ttl anime">
            シネマルックを<br />RAWでも撮って出しでも。
          </h3>
          <ul className="specs">
            <li className="spec brackets anime">
              <div>
                <h4>R3D NE<br className="sp" /> 内部収録</h4>
                <p>REDと同じ<br className="sp" />カラーサイエンスで<br />シネマのような<br className="sp" />色と階調を実現</p>
              </div>
            </li>
            <li className="spec brackets anime">
              <div>
                <h4>N-RAW /<br className="sp" /> Apple ProRes RAW HQ<br />内部収録</h4>
                <p>映像制作をより<br className="sp" />自由に変える<br />プロ仕様の内部記録</p>
              </div>
            </li>
            <li className="spec brackets anime">
              <div>
                <h4>ベースISO感度<br />ISO 800 / 6400</h4>
                <p>2種類のベースISO感度で<br />暗所もハイライトも自在</p>
              </div>
            </li>
            <li className="spec brackets anime">
              <div>
                <h4>LUTを撮影画面に適用</h4>
                <p>現場で色や<br className="sp" />コントラストを確認し<br />完成イメージを<br className="sp" />描きながら撮影</p>
              </div>
            </li>
            <li className="spec brackets anime">
              <div>
                <h4>多彩な<br className="sp" />フォーマット</h4>
                <p>8bitから12bitまで<br className="sp" />幅広い記録形式を備え<br />柔軟なワークフローに<br className="sp" />対応</p>
              </div>
            </li>
            <li className="spec brackets anime">
              <div>
                <h4>RED監修<br className="sp" />イメージング<br className="sp" />レシピ</h4>
                <p>9種類のプリセットで<br className="sp" />誰でも<br className="pc" />ワンタッチで<br className="sp" />映画のようなカットに</p>
              </div>
            </li>
          </ul>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-7 mt-12">
            <div className="relative flex-1 cursor-pointer group anime">
              <div className="relative overflow-hidden rounded-lg">
                <Image src={ServicesPreview} alt="Short Film" className="w-full object-cover aspect-square" />
                <video 
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  src="/videos/Home/DeCodeShowcase.mp4"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              </div>
              <div className="mt-4">
                <h3 className="dot an text-2xl md:text-3xl">SHORT FILM<span className="font-serif text-base ml-2">ショートフィルム</span></h3>
              </div>
            </div>
            <div className="relative flex-1 cursor-pointer group anime">
              <div className="relative overflow-hidden rounded-lg">
                <Image src={WorksPreview} alt="Behind the Scene" className="w-full object-cover aspect-square" />
                <video 
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  src="/videos/Home/LogoIntro.mp4"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              </div>
              <div className="mt-4">
                <h3 className="dot an text-2xl md:text-3xl">BEHIND THE SCENE<span className="font-serif text-base ml-2">舞台裏</span></h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="nikon-product">
        <div className="inner">
          <div className="flex">
            <div className="img">
              <Image 
                src={Profile} 
                alt="Product" 
                className="anime w-full"
              />
            </div>
            <div className="txt">
              <h2 className="dot an anime">PRODUCT</h2>
              <h3 className="ttl anime">
                ワンオペを極めた<br />シネマカメラ
              </h3>
              <ul>
                <li className="anime">
                  <div>
                    <h5 className="sans">高解像・高輝度・広色域</h5>
                    <h4>4.0型 大画面モニター</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">軽快に持ち出せる軽量設計</h5>
                    <h4>約630g</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">AI技術で多彩なシーンに対応</h5>
                    <h4>優れたAF・9種類の被写体検出</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">手持ちでも安定した撮影</h5>
                    <h4>ボディー内5軸手ブレ補正</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">長回しの撮影でも熱停止しにくく</h5>
                    <h4>ファンレス放熱設計</h4>
                  </div>
                </li>
                <li className="anime">
                  <div>
                    <h5 className="sans">音割れしにくく幅広い音域を</h5>
                    <h4>32bit float録音対応</h4>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <a href="#" className="btn-link anime">
                  <span>製品詳細</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Section - EXACT Nikon Structure */}
      <section id="nikon-voice">
        <div className="header">
          <div className="inner">
            <h2 className="an">
              <span className="dot">DEVELOPER&apos;S VOICE</span>
            </h2>
          </div>
        </div>

        {/* Article 1 - EXACT Nikon structure with article_inner + clone */}
        <article>
          <div className="bg">
            <Image src={HomePreview} alt="Developer" fill className="object-cover" />
          </div>
          
          {/* Hidden article_inner (Nikon method) */}
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating beautiful<br className="sp" />user experiences<br />
                  that bring ideas to life
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">DEVELOPER&apos;S VOICE</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={AboutPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Web Developer / Digital Artist</b>Mizumi</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🎨</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">A passionate 22-year-old Filipino developer specializing in creating aesthetic minimalist modern UI with exceptional user experiences. Proficient in full stack web development with a strong preference for front-end technologies.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my approach to UI design, bringing a unique aesthetic to every project.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Aesthetic minimalist modern UI<br />Creating beautiful user interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Front-End Development<br />React, Next.js and TypeScript</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Full Stack Solutions<br />From concept to deployment</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Clone - This will be shown (Nikon method) */}
          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating beautiful<br className="sp" />user experiences<br />
                  that bring ideas to life
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">DEVELOPER&apos;S VOICE</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={AboutPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Web Developer / Digital Artist</b>Mizumi</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🎨</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">A passionate 22-year-old Filipino developer specializing in creating aesthetic minimalist modern UI with exceptional user experiences. Proficient in full stack web development with a strong preference for front-end technologies.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my approach to UI design, bringing a unique aesthetic to every project.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Aesthetic minimalist modern UI<br />Creating beautiful user interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Front-End Development<br />React, Next.js and TypeScript</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Full Stack Solutions<br />From concept to deployment</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Article 2 - Full Stack Developer */}
        <article>
          <div className="bg">
            <Image src={AboutPreview} alt="Full Stack" fill className="object-cover" />
          </div>
          
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Full stack solutions<br className="sp" />from concept<br />
                  to deployment
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">FULL STACK DEVELOPER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={ServicesPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={ServicesPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Developer</b>Complete Solutions</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🚀</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Building complete web applications from database design to front-end implementation with modern technologies and best practices.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Backend Specialist</b>Server Architecture</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">⚙️</a></li>
                              <li><a href="#" target="_blank">🔧</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Experienced in server-side development, API design, and database management for scalable web applications.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Backend Development<br />Server architecture and APIs</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Database Design<br />Efficient data management</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Deployment<br />CI/CD and cloud services</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Performance<br />Optimization and scaling</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Full stack solutions<br className="sp" />from concept<br />
                  to deployment
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">FULL STACK DEVELOPER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={ServicesPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={ServicesPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Full Stack Developer</b>Complete Solutions</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">💻</a></li>
                              <li><a href="#" target="_blank">🚀</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Building complete web applications from database design to front-end implementation with modern technologies and best practices.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Backend Specialist</b>Server Architecture</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">⚙️</a></li>
                              <li><a href="#" target="_blank">🔧</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Experienced in server-side development, API design, and database management for scalable web applications.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Backend Development<br />Server architecture and APIs</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Database Design<br />Efficient data management</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Deployment<br />CI/CD and cloud services</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Performance<br />Optimization and scaling</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Article 3 - Digital Artist */}
        <article>
          <div className="bg">
            <Image src={ServicesPreview} alt="Digital Art" fill className="object-cover" />
          </div>
          
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating visual art<br className="sp" />and illustrations<br />
                  that inspire
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">DIGITAL ARTIST</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={WorksPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my UI design approach.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Illustrator</b>Creative Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🖌️</a></li>
                              <li><a href="#" target="_blank">🎭</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Skilled in Adobe Photoshop and digital illustration techniques for web and print media.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Photoshop<br />Professional editing and design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Creative Direction<br />Visual storytelling approach</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Art Integration<br />Blending art with UI design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Creating visual art<br className="sp" />and illustrations<br />
                  that inspire
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">DIGITAL ARTIST</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={WorksPreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/DeCodeShowcase.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={WorksPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Digital Artist</b>Visual Storytelling</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎨</a></li>
                              <li><a href="#" target="_blank">✏️</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating digital illustrations and exploring creative mediums. My artistic background influences my UI design approach.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>Illustrator</b>Creative Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🖌️</a></li>
                              <li><a href="#" target="_blank">🎭</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Skilled in Adobe Photoshop and digital illustration techniques for web and print media.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>Digital Illustrations<br />Visual art and creative design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Photoshop<br />Professional editing and design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>Creative Direction<br />Visual storytelling approach</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Art Integration<br />Blending art with UI design</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>

        {/* Article 4 - UI/UX Designer */}
        <article>
          <div className="bg">
            <Image src={WorksPreview} alt="UI/UX" fill className="object-cover" />
          </div>
          
          <div className="article_inner hidden">
            <div className="head_ttl">
              <div>
                <h2>
                  Designing experiences<br className="sp" />that users love<br />
                  and remember
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">UI/UX DESIGNER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={HomePreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={AboutPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UI/UX Designer</b>User-Centered Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎯</a></li>
                              <li><a href="#" target="_blank">📱</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating intuitive and engaging user experiences through thoughtful minimalist design with aesthetic appeal.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UX Researcher</b>User Psychology</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🔍</a></li>
                              <li><a href="#" target="_blank">📊</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Understanding user behavior and needs to create interfaces that provide exceptional usability and satisfaction.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>User Experience UX<br />Intuitive and accessible design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Minimalist Design<br />Clean and purposeful interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>User Research<br />Understanding behavior patterns</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Interaction Design<br />Engaging user flows</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="clone">
            <div className="head_ttl">
              <div>
                <h2>
                  Designing experiences<br className="sp" />that users love<br />
                  and remember
                </h2>
              </div>
            </div>

            <div className="blur">
              <div className="scrollarea">
                <div className="head">
                  <div className="inner">
                    <div className="contents">
                      <h3 className="dot an anime">UI/UX DESIGNER</h3>
                      <h2 className="anime">Mizumi みずみ</h2>
                      <h4 className="sans anime">James Rafty D. Libago</h4>

                      <div className="movie brackets anime btn_movie hover_video">
                        <div>
                          <Image src={HomePreview} alt="movie" width={887} height={537} />
                          <video src="/videos/Home/LogoIntro.mp4" muted loop playsInline />
                          <div className="btn_play">
                            <div className="anime">
                              <div>
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                                <h4 className="an">PLAY MOVIE</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="body">
                  <div className="inner">
                    <div className="contents">
                      <div className="movie anime btn_movie">
                        <Image src={AboutPreview} alt="Mizumi" width={1670} height={1080} />
                        <div className="txt">
                          <h3 className="anime"></h3>
                          <div className="btns">
                            <div className="btn_play small">
                              <div className="anime">
                                <div>
                                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                  <h4 className="an">PLAY INTERVIEW</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UI/UX Designer</b>User-Centered Design</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🎯</a></li>
                              <li><a href="#" target="_blank">📱</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Creating intuitive and engaging user experiences through thoughtful minimalist design with aesthetic appeal.</p>
                        </div>
                      </div>

                      <div className="profile">
                        <div className="head">
                          <div className="img anime">
                            <Image src={Profile} alt="Mizumi" width={130} height={130} />
                          </div>
                          <div className="txt">
                            <h3 className="sans anime"><b>UX Researcher</b>User Psychology</h3>
                            <ul className="sns anime">
                              <li><a href="#" target="_blank">🔍</a></li>
                              <li><a href="#" target="_blank">📊</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="profile_body sans">
                          <p className="anime">Understanding user behavior and needs to create interfaces that provide exceptional usability and satisfaction.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comment inner">
                <ol>
                  <li className="act">
                    <div className="anime" style={{backgroundImage: `url(${AboutPreview.src})`}}>
                      <div className="txt">
                        <b className="an">1</b>
                        <h3>User Experience UX<br />Intuitive and accessible design</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${ServicesPreview.src})`}}>
                      <div className="txt">
                        <b className="an">2</b>
                        <h3>Minimalist Design<br />Clean and purposeful interfaces</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${HomePreview.src})`}}>
                      <div className="txt">
                        <b className="an">3</b>
                        <h3>User Research<br />Understanding behavior patterns</h3>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="anime" style={{backgroundImage: `url(${WorksPreview.src})`}}>
                      <div className="txt">
                        <b className="an">4</b>
                        <h3>Interaction Design<br />Engaging user flows</h3>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Pickup Section */}
      <section id="nikon-pickup">
        <div className="inner">
          <h2 className="dot an anime">PICK UP</h2>
          <ul className="links">
            <li className="anime">
              <a href="#">
                <Image src={HomePreview} alt="Pickup 1" className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src={AboutPreview} alt="Pickup 2" className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src={ServicesPreview} alt="Pickup 3" className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src={WorksPreview} alt="Pickup 4" className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src={HomePreview} alt="Pickup 5" className="rounded-lg" />
              </a>
            </li>
            <li className="anime">
              <a href="#">
                <Image src={AboutPreview} alt="Pickup 6" className="rounded-lg" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer id="nikon-footer">
        <div className="inner">
          <ul className="sns">
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </li>
          </ul>
          <div className="copy sans mt-16">
            © 2024 Mizumi Kaito. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
