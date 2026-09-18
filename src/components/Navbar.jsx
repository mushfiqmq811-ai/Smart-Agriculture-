import React from 'react';
import { LayoutDashboard, Sprout, Stethoscope, Droplets, TriangleAlert, Map, FlaskConical, Database, Activity } from 'lucide-react';
import { translations } from '../translations';
export default function Navbar({activeTab,setActiveTab,lang}){
 const t=translations[lang].nav;
 const items=[
  ['dashboard',t.dashboard,LayoutDashboard],['farmer',t.farmerMode,Sprout],['doctor',t.doctor,Stethoscope],
  ['irrigation',t.irrigation,Droplets],['risk',t.risk,TriangleAlert],['map',t.map,Map],
  ['researcher',t.researcherMode,FlaskConical],['sources',t.dataSources,Database],['status',t.apiStatus,Activity]
 ];
 return <nav className="navbar"><div className="nav-inner">{items.map(([id,label,Icon])=><button key={id} className={activeTab===id?'active':''} onClick={()=>setActiveTab(id)}><Icon size={16}/><span>{label}</span></button>)}</div></nav>
}
