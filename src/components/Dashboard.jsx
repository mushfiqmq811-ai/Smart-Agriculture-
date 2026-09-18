import React,{useEffect,useMemo,useState} from 'react';
import {getWeatherData,getSoilData,getIotData,getSatelliteData} from '../services/apiService';
import {ResponsiveContainer,AreaChart,Area,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,BarChart,Bar} from 'recharts';
import {ArrowRight,ChevronDown,CloudRain,Droplets,Leaf,MapPin,ShieldCheck,Sun,Thermometer,Wind,Info,RefreshCw} from 'lucide-react';

const demoWeather={current:{temperature:28.5,humidity:78,windSpeed:12.4,precipitation:0},dailyForecast:[1,2,3,4,5,6,7].map((d,i)=>({date:`Day ${d}`,maxTemp:31+(i%3),minTemp:23+(i%2),precipitationSum:[0,2.1,15.4,8,.5,3,1.2][i]}))};
const fields=[{id:'F-01',name:'Gazipur Rice Field',crop:'Aman Rice',lat:24.095,lon:90.325,stage:'Tillering'},{id:'F-02',name:'Mymensingh Vegetable Plot',crop:'Vegetables',lat:24.7471,lon:90.4203,stage:'Vegetative'},{id:'F-03',name:'Rajshahi Wheat Field',crop:'Wheat',lat:24.3745,lon:88.6042,stage:'Early growth'}];

export default function Dashboard({demoMode,setActiveTab}){
 const [field,setField]=useState(fields[0]); const [data,setData]=useState({weather:null,soil:null,iot:null,satellite:null});
 const [loading,setLoading]=useState(true),[error,setError]=useState('');
 const load=async()=>{setLoading(true);setError('');try{
   if(demoMode){setData({weather:demoWeather,soil:{properties:{ph:'6.50',organicCarbon:'14.20',clayContent:'28.5'}},iot:{telemetry:{soilMoisture:42.1,temperature:27.8,humidity:75}},satellite:{ndvi:0.71,source:'Demonstration'}})}
   else {const [weather,soil,iot,satellite]=await Promise.all([getWeatherData(field.lat,field.lon),getSoilData(field.lat,field.lon),getIotData(),getSatelliteData(field.lat,field.lon)]);setData({weather,soil,iot,satellite})}
 }catch(e){setError(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load()},[demoMode,field.id]);
 const weather=data.weather||{}; const iot=data.iot?.telemetry||{}; const soil=data.soil?.properties||{};
 const moisture=Number(iot.soilMoisture??42.1); const temp=Number(iot.temperature??weather.current?.temperature??28.5); const rain=Number(weather.dailyForecast?.[0]?.precipitationSum??0);
 const irrigation=moisture<35 || (moisture<45 && rain<2);
 const chartData=(weather.dailyForecast||demoWeather.dailyForecast).map((d,i)=>({...d,label:i===0?'Today':`D${i+1}`}));
 const soilScore=useMemo(()=>Math.max(0,Math.min(100,Math.round(65+(Number(soil.ph||6.5)-6.5)*8))),[soil.ph]);
 if(loading)return <div className="state"><RefreshCw className="spin" size={22}/><span>Loading field intelligence…</span></div>;
 return <div className="page dashboard-page">
   {error&&<div className="inline-error">Unable to refresh one or more live sources: {error}. Showing available data.</div>}
   <section className="dashboard-top">
    <div><span className="section-kicker">FIELD INTELLIGENCE · {demoMode?'SIMULATION':'LIVE'}</span><h2>Good morning. Here is what your field is telling you.</h2><p>One view for weather, soil, crop condition and actionable decisions.</p></div>
    <label className="field-select"><MapPin size={16}/><select value={field.id} onChange={e=>setField(fields.find(f=>f.id===e.target.value))}>{fields.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select><ChevronDown size={15}/></label>
   </section>

   <section className="field-strip">
    <div><span>FIELD</span><b>{field.name}</b><small>{field.crop} · {field.stage}</small></div>
    <div className="strip-meta"><span>24h status</span><b className="healthy"><ShieldCheck size={15}/> Monitoring normally</b></div>
    <button className="text-btn" onClick={()=>setActiveTab('map')}>Open GIS map <ArrowRight size={15}/></button>
   </section>

   <section className="decision-layout">
    <div className={`decision-card ${irrigation?'attention':''}`}>
      <div className="decision-label"><span className="decision-icon">{irrigation?<Droplets size={20}/>:<ShieldCheck size={20}/>}</span><span>RECOMMENDED ACTION</span></div>
      <h3>{irrigation?'Irrigation recommended':'No irrigation trigger right now'}</h3>
      <p>{irrigation?'Moisture is approaching the advisory threshold and near-term rainfall is limited.':'Current moisture is above the advisory threshold. Continue monitoring and re-check after the next weather update.'}</p>
      <div className="reason-row"><span><Droplets size={14}/> Soil moisture <b>{moisture}%</b></span><span><CloudRain size={14}/> Near-term rain <b>{rain} mm</b></span><span><Thermometer size={14}/> Temperature <b>{temp}°C</b></span></div>
      <button className="outline-btn" onClick={()=>setActiveTab('irrigation')}>View decision logic <ArrowRight size={15}/></button>
    </div>
    <div className="mini-summary"><div className="summary-title">Why this recommendation? <Info size={15}/></div><div className="logic-step"><span>01</span><div><b>Observe</b><small>Moisture + weather signals collected</small></div></div><div className="logic-step"><span>02</span><div><b>Assess</b><small>Thresholds checked against crop context</small></div></div><div className="logic-step"><span>03</span><div><b>Act</b><small>Farmer-facing action generated</small></div></div></div>
   </section>

   <section className="metric-grid">
    <Metric icon={<Droplets/>} label="SOIL MOISTURE" value={`${moisture}%`} note={moisture<35?'Below advisory range':'Within monitored range'} tone={moisture<35?'warn':'good'}/>
    <Metric icon={<Thermometer/>} label="TEMPERATURE" value={`${temp}°C`} note="Current field signal"/>
    <Metric icon={<CloudRain/>} label="RAINFALL" value={`${rain} mm`} note="Next forecast period"/>
    <Metric icon={<Leaf/>} label="VEGETATION" value={data.satellite?.ndvi?Number(data.satellite.ndvi).toFixed(2):'0.71'} note="NDVI / vegetation signal" tone="good"/>
   </section>

   <section className="chart-grid">
    <div className="panel chart-panel"><div className="panel-title"><div><span className="section-kicker">WEATHER INTELLIGENCE</span><h3>7-day field outlook</h3></div><span className="source-chip">Open-Meteo</span></div><div className="chart"><ResponsiveContainer><AreaChart data={chartData}><defs><linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopOpacity=".22"/><stop offset="100%" stopOpacity=".02"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label"/><YAxis/><Tooltip/><Area type="monotone" dataKey="precipitationSum" name="Rain mm" strokeWidth={2} fill="url(#rainFill)"/></AreaChart></ResponsiveContainer></div></div>
    <div className="panel chart-panel"><div className="panel-title"><div><span className="section-kicker">TEMPERATURE</span><h3>Heat trend</h3></div><span className="source-chip">Live normalized</span></div><div className="chart"><ResponsiveContainer><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label"/><YAxis/><Tooltip/><Line type="monotone" dataKey="maxTemp" name="Max °C" strokeWidth={2.5}/><Line type="monotone" dataKey="minTemp" name="Min °C" strokeWidth={2.5}/></LineChart></ResponsiveContainer></div></div>
   </section>

   <section className="lower-grid">
    <div className="panel condition-panel"><div className="panel-title"><div><span className="section-kicker">SOIL INTELLIGENCE</span><h3>Field profile</h3></div><span className="score">{soilScore}/100</span></div><div className="soil-bars"><BarRow label="pH suitability" value={soil.ph||'6.50'} pct={soilScore}/><BarRow label="Organic carbon" value={`${soil.organicCarbon||'14.20'} g/kg`} pct={Math.min(100,Number(soil.organicCarbon||14.2)*4)}/><BarRow label="Clay content" value={`${soil.clayContent||'28.5'}%`} pct={Math.min(100,Number(soil.clayContent||28.5)*2.5)}/></div><small className="provenance">Source: ISRIC SoilGrids · values shown as normalized advisory inputs.</small></div>
    <div className="panel quick-panel"><div className="panel-title"><div><span className="section-kicker">NEXT STEPS</span><h3>Explore the system</h3></div></div><Quick title="Crop Doctor" text="Inspect a crop image for visible symptoms." onClick={()=>setActiveTab('doctor')}/><Quick title="15-day outlook" text="Review early-warning scenarios and assumptions." onClick={()=>setActiveTab('risk')}/><Quick title="Researcher mode" text="Inspect sources, methods and raw signals." onClick={()=>setActiveTab('researcher')}/></div>
   </section>
   <div className="method-note"><Info size={16}/><span><b>Decision-support, not autonomous control.</b> Recommendations are advisory and should be verified with local field observations and official agricultural guidance.</span></div>
 </div>
}
function Metric({icon,label,value,note,tone}){return <div className="metric"><div className="metric-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small className={tone}>{note}</small></div>}
function BarRow({label,value,pct}){return <div className="bar-row"><div><span>{label}</span><b>{value}</b></div><div className="bar"><i style={{width:`${Math.max(5,Math.min(100,pct))}%`}}/></div></div>}
function Quick({title,text,onClick}){return <button className="quick" onClick={onClick}><div><b>{title}</b><small>{text}</small></div><ArrowRight size={17}/></button>}
