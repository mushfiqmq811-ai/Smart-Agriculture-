import React from 'react';
import { Leaf, Radio, Languages } from 'lucide-react';
import { translations } from '../translations';

export default function Header({lang,setLang,demoMode,setDemoMode}){
 const t=translations[lang];
 return <header className="header">
   <div className="brand-wrap">
    <div className="brand-mark"><Leaf size={24}/></div>
    <div><div className="brand"><h1>AGRI<span>VISION</span></h1><em>DSS</em></div><p className="subtitle">{t.subTitle} · Bangladesh</p></div>
   </div>
   <div className="header-actions">
    <div className="data-status"><span className={demoMode?'dot demo-dot':'dot'}></span><span>{demoMode?'Simulation':'Live data'}</span></div>
    <button className="control-btn" onClick={()=>setDemoMode(!demoMode)}><Radio size={16}/>{demoMode?'Use live':'Demo mode'}</button>
    <button className="control-btn" onClick={()=>setLang(lang==='en'?'bn':'en')}><Languages size={16}/>{lang==='en'?'বাংলা':'English'}</button>
   </div>
 </header>
}
