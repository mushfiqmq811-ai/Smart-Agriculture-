import React, {useState} from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FarmerMode from './components/FarmerMode';
import CropDoctor from './components/CropDoctor';
import GisMap from './components/GisMap';
import RiskOutlook from './components/RiskOutlook';
import ResearcherMode from './components/ResearcherMode';

export default function App(){
  const [activeTab,setActiveTab]=useState('dashboard');
  const [lang,setLang]=useState('bn');
  const [demoMode,setDemoMode]=useState(false);
  const content={
    dashboard:<Dashboard demoMode={demoMode} setActiveTab={setActiveTab}/>,
    farmer:<FarmerMode/>, doctor:<CropDoctor/>, irrigation:<FarmerMode/>,
    risk:<RiskOutlook/>, map:<GisMap/>, researcher:<ResearcherMode/>,
    sources:<ResearcherMode/>, status:<ResearcherMode statusOnly/>
  };
  return <div className="app">
    <Header {...{lang,setLang,demoMode,setDemoMode}}/>
    <Navbar {...{activeTab,setActiveTab,lang}}/>
    <main>{content[activeTab]}</main>
    <footer><b>AGRI-VISION DSS</b> · Precision agriculture decision support · Bangladesh-focused · Data provenance visible</footer>
  </div>
}
