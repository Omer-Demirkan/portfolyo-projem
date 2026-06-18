import React, { useState, useMemo } from 'react';
import './App.css';

const BackgroundParticles = ({ activeColor }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10
    }));
  }, []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            backgroundColor: activeColor !== 'transparent' ? `${activeColor}66` : 'rgba(148, 163, 184, 0.4)',
            boxShadow: activeColor !== 'transparent' ? `0 0 10px ${activeColor}88` : '0 0 8px rgba(148, 163, 184, 0.6)'
          }}
        />
      ))}
    </div>
  );
};

const SpaceBattle = () => {
  return (
    <div className="space-battle-container">
      <div className="ship-wrapper ship-dreams">
        <span className="ship-label" style={{ color: '#38bdf8', borderColor: '#0ea5e9' }}>Hayallerim</span>
        <div className="ship-svg">
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 38L20 48L25 38Z" fill="#38bdf8" opacity="0.8"/>
            <path d="M5 35L20 25L35 35L20 38L5 35Z" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5"/>
            <path d="M20 4L32 35L20 30L8 35L20 4Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2"/>
            <path d="M20 12L25 24L20 22L15 24L20 12Z" fill="#38bdf8" opacity="0.6"/>
          </svg>
        </div>
      </div>

      <div className="laser-beam"></div>

      <div className="ship-wrapper ship-anxiety">
        <span className="ship-label" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Gelecek Kaygısı</span>
        <div className="ship-svg">
          <svg width="60" height="35" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 15C20 8 25 4 30 4C35 4 40 8 40 15" fill="#fca5a5" opacity="0.4" stroke="#ef4444" strokeWidth="1.5"/>
            <ellipse cx="30" cy="18" rx="25" ry="7" fill="#1e293b" stroke="#ef4444" strokeWidth="2"/>
            <circle cx="16" cy="18" r="1.5" fill="#ef4444" style={{animation: 'blink 0.5s infinite'}}/>
            <circle cx="30" cy="20" r="1.5" fill="#ef4444" style={{animation: 'blink 0.5s infinite 0.2s'}}/>
            <circle cx="44" cy="18" r="1.5" fill="#ef4444" style={{animation: 'blink 0.5s infinite 0.4s'}}/>
          </svg>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.3 });
  const [activeColor, setActiveColor] = useState('transparent');
  const [activeNode, setActiveNode] = useState(null);

  const [clickCount, setClickCount] = useState(0); 
  const [glitchStage, setGlitchStage] = useState(0);
  const [hasGlitchOccurred, setHasGlitchOccurred] = useState(false); 

  const playCyberpunkSound = (type = 'click') => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'reset') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } 
    else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.8);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(); osc.stop(ctx.currentTime + 0.8);
    }
    else if (type === 'truck') {
      osc.type = 'square'; 
      osc.frequency.setValueAtTime(65, ctx.currentTime); 
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 1.5);
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start(); osc.stop(ctx.currentTime + 1.5);
    }
  };

  const nodesData = [
    { id: 'root', label: 'Ömer Demirkan', x: 0, y: 0, color: '#3b82f6', type: 'root' },

    { id: 'kimim', label: 'Ben Kimim?', x: -600, y: -400, color: '#f59e0b', type: 'category' },
    { id: 'k1', label: 'Başlangıç: 2003', x: -900, y: -600, color: '#fcd34d', type: 'leaf' },
    { id: 'k1_desc', label: '2003 yılında Diyarbakır doğumlu. Dünyaya geliş ve sisteme ilk login işlemi.', x: -1250, y: -600, color: '#fcd34d', type: 'info', parent: 'k1' },
    { id: 'k2', label: 'Eğitim: BAUN', x: -800, y: -200, color: '#fcd34d', type: 'leaf' },
    { id: 'k2_desc', label: 'Balıkesir Üniversitesi, Bilgisayar Mühendisliği (CENG). Algoritmalarla hayatın çelişkileri arasında köprü kurulan o akademik üs.', x: -1150, y: -200, color: '#fcd34d', type: 'info', parent: 'k2' },

    { id: 'sem', label: 'SEM Modülü', x: 0, y: -600, color: '#06b6d4', type: 'category' },
    { id: 'sem_lang', label: 'Yazılım Dilleri', x: -300, y: -800, color: '#0ea5e9', type: 'sub-category' },
    { id: 'sl1', label: 'Python', x: -500, y: -1000, color: '#38bdf8', type: 'leaf' },
    { id: 'sl1_desc', label: 'PyQt5 ile arayüzler yazdığım, veri çekip grafik algoritmaları kurduğum ana silahım.', x: -850, y: -1000, color: '#38bdf8', type: 'info', parent: 'sl1' },
    { id: 'sl2', label: 'C# & Java', x: -100, y: -1050, color: '#38bdf8', type: 'leaf' },
    { id: 'sl2_desc', label: 'Nesne Yönelimli Programlama (OOP) kaleleri. Bitmek bilmeyen o "public static void main" satırları.', x: -100, y: -1300, color: '#38bdf8', type: 'info', parent: 'sl2' },
    { id: 'sem_web', label: 'Web & Arayüz', x: 300, y: -800, color: '#0ea5e9', type: 'sub-category' },
    { id: 'sw1', label: 'HTML & CSS', x: 500, y: -1000, color: '#38bdf8', type: 'leaf' },
    { id: 'sw1_desc', label: 'Bir div\'i ortalamanın karmaşık bir algoritma kurmaktan daha zor olabildiğini öğreten yapılar.', x: 850, y: -1000, color: '#38bdf8', type: 'info', parent: 'sw1' },

    { id: 'projeler', label: 'Projeler', x: 600, y: -400, color: '#8b5cf6', type: 'category' },
    { id: 'p1', label: 'AI Rota Asistanı', x: 900, y: -600, color: '#c4b5fd', type: 'leaf' },
    { id: 'p1_desc', label: 'Graph Theory kullanarak Balıkesir için konuma dayalı toplu taşıma rota asistanı tasarladığım Python projesi.', x: 1250, y: -600, color: '#c4b5fd', type: 'info', parent: 'p1' },
    { id: 'p2', label: 'Finans Paneli', x: 1000, y: -400, color: '#c4b5fd', type: 'leaf' },
    { id: 'p2_desc', label: 'BIST ve global piyasalardan veri çeken PyQt5 yazılımı. SMA ve F/K çarpanlarını anlık izliyorum.', x: 1350, y: -400, color: '#c4b5fd', type: 'info', parent: 'p2' },
    { id: 'p3', label: 'Dijital Sayaç', x: 900, y: -200, color: '#c4b5fd', type: 'leaf' },
    { id: 'p3_desc', label: 'Breadboard üzerinde 74xx serisi mantık kapılarıyla kurduğum donanım projesi. Lehim kokusunun başladığı yer.', x: 1250, y: -200, color: '#c4b5fd', type: 'info', parent: 'p3' },

    { id: 'kariyer', label: 'Kariyerim', x: 800, y: 100, color: '#f43f5e', type: 'category' },
    { id: 'kar1', label: '14-16 Yaş', x: 1100, y: -100, color: '#fb7185', type: 'leaf' },
    { id: 'kar1_desc', label: 'Kuyumculuk sektöründe çalıştığım dönem. Paranın zaman değerine, piyasaya ve ekonomiye olan ilgimin ateşlendiği o ilk altın tozlu yıllar.', x: 1450, y: -100, color: '#fb7185', type: 'info', parent: 'kar1' },
    { id: 'kar2', label: '16-21 Yaş', x: 1200, y: 100, color: '#fb7185', type: 'leaf' },
    { id: 'kar2_desc', label: 'Sahaya iniş ve aktif ticaret hayatı. İnsan ilişkileri, risk yönetimi ve kar-zarar döngüsünün bizzat içinde pişmek.', x: 1550, y: 100, color: '#fb7185', type: 'info', parent: 'kar2' },
    { id: 'kar3', label: 'Kırmızı Hap', x: 1100, y: 300, color: '#fb7185', type: 'leaf' },
    { id: 'kar3_desc', label: 'Ticaretin Matrix\'inde kalmak yerine Kırmızı Hapı seçtiğim an: Sistemi baştan yazmak için Bilgisayar Mühendisi olmaya karar verişim.', x: 1450, y: 300, color: '#fb7185', type: 'info', parent: 'kar3' },

    { id: 'hedefler', label: 'Hedeflerim', x: 600, y: 500, color: '#0ea5e9', type: 'category' },
    { id: 'h1', label: 'Bankacılık', x: 900, y: 500, color: '#7dd3fc', type: 'leaf' },
    { id: 'h1_desc', label: 'Mezuniyet sonrası bir bankanın finans departmanına girip kurumsal yapıları ve para akışını öğrenmek.', x: 1250, y: 500, color: '#7dd3fc', type: 'info', parent: 'h1' },
    { id: 'h2', label: 'Yatırım Şirketi', x: 1000, y: 700, color: '#7dd3fc', type: 'leaf' },
    { id: 'h2_desc', label: 'Öğrenilen verilerle kendi Yatırım Şirketimi kurmak. Kodları artık kendi portföyüm için çalıştırmak.', x: 1350, y: 700, color: '#7dd3fc', type: 'info', parent: 'h2' },
    { id: 'h3', label: 'Garaj Evrimi', x: 800, y: 900, color: '#7dd3fc', type: 'leaf' },
    { id: 'h3_desc', label: 'İlk maaşla Fluence -> Konfor alanı Passat -> Ve nihai patron aracı BMW G20 geçişi.', x: 1150, y: 900, color: '#7dd3fc', type: 'info', parent: 'h3' },

    { id: 'ilgi', label: 'İlgi Alanları', x: -600, y: 400, color: '#10b981', type: 'category' },
    { id: 'i_eko', label: 'Ekonomi', x: -800, y: 200, color: '#059669', type: 'sub-category' },
    { id: 'i_eko1', label: 'Makroekonomi', x: -1100, y: 100, color: '#34d399', type: 'leaf' },
    { id: 'i_eko1_desc', label: 'Borç döngüleri ve Fed faiz kararlarının piyasa üzerindeki illüzyonlarını incelemek.', x: -1450, y: 100, color: '#34d399', type: 'info', parent: 'i_eko1' },
    { id: 'i_eko2', label: 'Mikroekonomi', x: -1000, y: 300, color: '#34d399', type: 'leaf' },
    { id: 'i_eko2_desc', label: 'Arz-talep mekanizmaları ve bireysel firmaların davranışsal modellerini algoritmik bir bakışla incelemek.', x: -1350, y: 300, color: '#34d399', type: 'info', parent: 'i_eko2' },
    
    { id: 'i_kua', label: 'Kuantum Fiziği', x: -900, y: 500, color: '#047857', type: 'sub-category' },
    { id: 'i_kua1', label: 'Qubit & Bilişim', x: -1200, y: 500, color: '#6ee7b7', type: 'leaf' },
    { id: 'i_kua1_desc', label: 'Süperpozisyon durumundaki kuantum bilgisayar sistemleri tam bir beyin yakma seansı.', x: -1550, y: 500, color: '#6ee7b7', type: 'info', parent: 'i_kua1' },
    { id: 'i_kua2', label: 'Kuantum Kedisi', x: -1100, y: 700, color: '#6ee7b7', type: 'leaf' },
    { id: 'i_kua2_desc', label: 'Schrödinger\'in Kedisi. Yazdığım kodlar da genelde test edene kadar "hem çalışıyor hem çalışmıyor" durumunda.', x: -1450, y: 700, color: '#6ee7b7', type: 'info', parent: 'i_kua2' },

    { id: 'i_kul', label: 'Kültür & Sinema', x: -700, y: 700, color: '#10b981', type: 'sub-category' },
    { id: 'i_kul1', label: 'Finans Sineması', x: -900, y: 900, color: '#6ee7b7', type: 'leaf' },
    { id: 'i_kul1_desc', label: 'The Big Short izleyip, küresel krizlerdeki sistem açıklarını ve açgözlülük mekaniklerini analiz etmek.', x: -1250, y: 900, color: '#6ee7b7', type: 'info', parent: 'i_kul1' },
    { id: 'i_kul2', label: 'Distopya & AI', x: -600, y: 1000, color: '#6ee7b7', type: 'leaf' },
    { id: 'i_kul2_desc', label: 'Blade Runner ve Ex Machina ile yapay zekanın etik ve toplumsal sınırlarını sorgulamak.', x: -950, y: 1000, color: '#6ee7b7', type: 'info', parent: 'i_kul2' },

    { id: 'travmalar', label: 'Gerçekler & Oyun', x: 0, y: 700, color: '#ef4444', type: 'category' },
    { id: 't1', label: 'Fenerbahçe', x: -300, y: 900, color: '#fca5a5', type: 'leaf' },
    { id: 't1_desc', label: 'Nordsjaelland deplasmanında yenilen o 6 gol... Finansal krizleri tahmin edip bu defansın ne yapacağını edememek.', x: -650, y: 900, color: '#fca5a5', type: 'info', parent: 't1' },
    { id: 't2', label: 'Dijital Kaçış', x: 0, y: 1000, color: '#fca5a5', type: 'leaf' },
    { id: 't2_desc', label: 'Sistem yorduğunda ETS 2\'de Balıkesir\'den İskandinavya\'ya gece sürüşüne çıkmak.', x: 0, y: 1250, color: '#fca5a5', type: 'info', parent: 't2' },
    { id: 't3', label: 'Tekstil Stajı', x: 300, y: 900, color: '#fca5a5', type: 'leaf' },
    { id: 't3_desc', label: 'Babamın atölyesinde çalışmak. Makroekonomiyi kitaplardan, mikroekonomiyi kumaş toplarını taşırken öğrenmek.', x: 650, y: 900, color: '#fca5a5', type: 'info', parent: 't3' }
  ];

  const linksData = [
    { source: 'root', target: 'kimim', type: 'solid' }, { source: 'root', target: 'sem', type: 'solid' },
    { source: 'root', target: 'projeler', type: 'solid' }, { source: 'root', target: 'kariyer', type: 'solid' },
    { source: 'root', target: 'ilgi', type: 'solid' }, { source: 'root', target: 'hedefler', type: 'solid' },
    { source: 'root', target: 'travmalar', type: 'solid' },
    
    { source: 'kimim', target: 'k1', type: 'solid' }, { source: 'k1', target: 'k1_desc', type: 'solid' },
    { source: 'kimim', target: 'k2', type: 'solid' }, { source: 'k2', target: 'k2_desc', type: 'solid' },
    { source: 'sem', target: 'sem_lang', type: 'solid' }, { source: 'sem', target: 'sem_web', type: 'solid' },
    { source: 'sem_lang', target: 'sl1', type: 'solid' }, { source: 'sl1', target: 'sl1_desc', type: 'solid' },
    { source: 'sem_lang', target: 'sl2', type: 'solid' }, { source: 'sl2', target: 'sl2_desc', type: 'solid' },
    { source: 'sem_web', target: 'sw1', type: 'solid' }, { source: 'sw1', target: 'sw1_desc', type: 'solid' },
    
    { source: 'projeler', target: 'p1', type: 'solid' }, { source: 'p1', target: 'p1_desc', type: 'solid' },
    { source: 'projeler', target: 'p2', type: 'solid' }, { source: 'p2', target: 'p2_desc', type: 'solid' },
    { source: 'projeler', target: 'p3', type: 'solid' }, { source: 'p3', target: 'p3_desc', type: 'solid' },
    
    { source: 'kariyer', target: 'kar1', type: 'solid' }, { source: 'kar1', target: 'kar1_desc', type: 'solid' },
    { source: 'kariyer', target: 'kar2', type: 'solid' }, { source: 'kar2', target: 'kar2_desc', type: 'solid' },
    { source: 'kariyer', target: 'kar3', type: 'solid' }, { source: 'kar3', target: 'kar3_desc', type: 'solid' },
    
    { source: 'hedefler', target: 'h1', type: 'solid' }, { source: 'h1', target: 'h1_desc', type: 'solid' },
    { source: 'hedefler', target: 'h2', type: 'solid' }, { source: 'h2', target: 'h2_desc', type: 'solid' },
    { source: 'hedefler', target: 'h3', type: 'solid' }, { source: 'h3', target: 'h3_desc', type: 'solid' },
    
    { source: 'travmalar', target: 't1', type: 'solid' }, { source: 't1', target: 't1_desc', type: 'solid' },
    { source: 'travmalar', target: 't2', type: 'solid' }, { source: 't2', target: 't2_desc', type: 'solid' },
    { source: 'travmalar', target: 't3', type: 'solid' }, { source: 't3', target: 't3_desc', type: 'solid' },
    
    { source: 'ilgi', target: 'i_eko', type: 'solid' }, { source: 'ilgi', target: 'i_kua', type: 'solid' }, { source: 'ilgi', target: 'i_kul', type: 'solid' },
    { source: 'i_eko', target: 'i_eko1', type: 'solid' }, { source: 'i_eko1', target: 'i_eko1_desc', type: 'solid' },
    { source: 'i_eko', target: 'i_eko2', type: 'solid' }, { source: 'i_eko2', target: 'i_eko2_desc', type: 'solid' },
    { source: 'i_kua', target: 'i_kua1', type: 'solid' }, { source: 'i_kua1', target: 'i_kua1_desc', type: 'solid' },
    { source: 'i_kua', target: 'i_kua2', type: 'solid' }, { source: 'i_kua2', target: 'i_kua2_desc', type: 'solid' },
    { source: 'i_kul', target: 'i_kul1', type: 'solid' }, { source: 'i_kul1', target: 'i_kul1_desc', type: 'solid' },
    { source: 'i_kul', target: 'i_kul2', type: 'solid' }, { source: 'i_kul2', target: 'i_kul2_desc', type: 'solid' },

    { source: 'kar1', target: 'i_eko', type: 'dashed' },
    { source: 'kar3', target: 'k2', type: 'dashed' },
    { source: 'p2', target: 'i_eko2', type: 'dashed' },
    { source: 'h2', target: 'i_eko1', type: 'dashed' }
  ];

  const handleNodeClick = (node) => {
    if (node.type === 'info' || glitchStage > 0) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 5 && !hasGlitchOccurred) {
      playCyberpunkSound('error'); 
      setGlitchStage(1); 
      setHasGlitchOccurred(true); 
      return; 
    }

    setActiveColor(node.color);
    playCyberpunkSound('click');

    if (activeNode === node.id) {
      resetSystem();
    } else {
      setActiveNode(node.id);
      let newZoom = node.type === 'root' ? 0.8 : node.type === 'leaf' ? 1.1 : 0.9;
      
      if (node.type === 'leaf') {
        const infoNode = nodesData.find(n => n.parent === node.id);
        if (infoNode) {
          const centerX = (node.x + infoNode.x) / 2;
          const centerY = (node.y + infoNode.y) / 2;
          setCamera({ x: centerX, y: centerY, zoom: newZoom });
        } else {
          setCamera({ x: node.x, y: node.y, zoom: newZoom });
        }
      } else {
        setCamera({ x: node.x, y: node.y, zoom: newZoom });
      }
    }
  };

  const resetSystem = () => {
    playCyberpunkSound('reset');
    setActiveNode(null);
    setActiveColor('transparent');
    setCamera({ x: 0, y: 0, zoom: 0.3 }); 
  };

  return (
    <div className="viewport" style={{ '--active-color': activeColor !== 'transparent' ? `${activeColor}44` : 'transparent' }}>
      
      <BackgroundParticles activeColor={activeColor} />
      <SpaceBattle />

      <button className="reset-btn" onClick={resetSystem}>
        ⌂ Tam Haritayı Gör
      </button>

      {glitchStage > 0 && (
        <div className="glitch-overlay">
          {glitchStage === 1 && (
            <>
              <h1 className="glitch-text">SİSTEM UYARISI: FENERBAHÇE MAÇI BAŞLADI</h1>
              <p className="glitch-subtext">Kritik bağlantı kuruluyor. Nordsjaelland deplasmanındayız... Beklenmeyen bir ağ aktivitesi tespit edildi.</p>
              <button className="glitch-btn" onClick={() => { playCyberpunkSound('error'); setGlitchStage(2); }}>
                [ MAÇI İZLE ]
              </button>
            </>
          )}

          {glitchStage === 2 && (
            <>
              <h1 className="glitch-text" style={{ color: '#ff0000' }}>ERROR 404: DEFANS BULUNAMADI</h1>
              <p className="glitch-subtext">Maç Kaybedildi (6-0). Sistem bütünlüğü çöküyor... Stres seviyesi kritik eşiği aştı!</p>
              <p className="blinking-text">ACİL DURUM PROTOKOLÜ: SİSTEMİ KURTARMAK İÇİN ETS 2'YE GİRİLMELİ!</p>
              <button className="glitch-btn safe" onClick={() => { playCyberpunkSound('truck'); setGlitchStage(0); }}>
                [ ETS 2'Yİ BAŞLAT VE SİSTEMİ KURTAR ]
              </button>
            </>
          )}
        </div>
      )}

      <div 
        className="canvas" 
        style={{ transform: `scale(${camera.zoom}) translate(${-camera.x}px, ${-camera.y}px)` }}
      >
        <svg className="svg-lines" width="10000" height="10000" style={{ position: 'absolute', top: '-5000px', left: '-5000px', pointerEvents: 'none', overflow: 'visible' }}>
          <g transform="translate(5000, 5000)">
            {linksData.map((link, idx) => {
              const sourceNode = nodesData.find(n => n.id === link.source);
              const targetNode = nodesData.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isTargetInfo = targetNode.type === 'info';
              const isLinkVisible = !isTargetInfo || activeNode === sourceNode.id;
              const isDashed = link.type === 'dashed';

              return (
                <line 
                  key={idx}
                  x1={sourceNode.x} y1={sourceNode.y} 
                  x2={targetNode.x} y2={targetNode.y} 
                  className={`${isDashed ? "svg-line-dashed" : "svg-line-solid"} ${!isLinkVisible ? "hidden" : ""}`}
                  style={{ opacity: isLinkVisible ? 1 : 0 }}
                />
              );
            })}
          </g>
        </svg>

        {nodesData.map(node => {
          const isInfo = node.type === 'info';
          const isVisible = !isInfo || activeNode === node.parent;

          const bgColor = isInfo ? `${node.color}22` : (node.type === 'leaf' ? 'transparent' : node.color);
          const shadowColor = isInfo ? `0 0 15px ${node.color}44` : '';
          const transformAnim = isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -40%) scale(0.8)';

          return (
            <div
              key={node.id}
              className={`node ${node.type} ${isInfo && !isVisible ? 'hidden' : ''}`}
              style={{ 
                left: `${node.x}px`, 
                top: `${node.y}px`,
                backgroundColor: bgColor,
                borderColor: node.color,
                color: isInfo ? '#f8fafc' : (node.type === 'leaf' ? node.color : '#fff'),
                boxShadow: shadowColor,
                opacity: isVisible ? 1 : 0, 
                visibility: isVisible ? 'visible' : 'hidden', 
                pointerEvents: isVisible ? 'auto' : 'none', 
                transform: transformAnim
              }}
              onClick={() => handleNodeClick(node)}
            >
              {node.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;