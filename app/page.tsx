"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";
import { 
  X, Star, Moon, Sparkles, BookOpen, Zap, Calendar, TrendingUp, 
  Layout, Layers, Compass, ArrowUpCircle, ArrowDownCircle, AlertTriangle,
  Heart, Briefcase, Coins, MapPin, Hash, Palette
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";
type TabView = "analysis" | "stars" | "sanfang" | "threeplates";
type AnalysisMode = "general" | "wealth" | "love" | "career";

// --- 静态数据库 ---
const palaceDefinitions: Record<string, string> = {
  "命宫": "【核心】代表个性、天赋及一生总运势。",
  "兄弟": "【人际】代表手足、知交及资金周转。",
  "夫妻": "【感情】代表配偶特质及恋爱婚姻模式。",
  "子女": "【后代】代表子女缘分、才华及桃花。",
  "财帛": "【财富】代表赚钱模式、财运及理财态度。",
  "疾厄": "【健康】代表体质、易患疾病及内心世界。",
  "迁移": "【外出】代表出外运势、机遇及社交表现。",
  "交友": "【社交】代表平辈互动、下属及人际圈。",
  "官禄": "【事业】代表职业倾向、成就及工作能力。",
  "田宅": "【资产】代表不动产、家宅运及总财库。",
  "福德": "【精神】代表享福、抗压及晚年生活。",
  "父母": "【长辈】代表长辈提携、遗传及文书契约。",
};

const starEncyclopedia: Record<string, string> = {
  "紫微": "帝王之星，五行属土。主尊贵、官禄。优点：稳重老成。缺点：刚愎自用。",
  "天机": "智慧之星，五行属木。主兄弟、智慧。优点：反应敏捷。缺点：思虑过重。",
  "太阳": "官禄之主，五行属火。主博爱、权贵。优点：热情积极。缺点：劳心劳力。",
  "武曲": "财帛之主，五行属金。主刚毅、财富。优点：执行力强。缺点：性格孤僻。",
  "天同": "福德之主，五行属水。主享受、意志。优点：乐天知命。缺点：好逸恶劳。",
  "廉贞": "次桃花星，五行属火。主邪恶、歪曲。优点：公关能力强。缺点：心高气傲。",
  "天府": "财库之主，五行属土。主延寿、解厄。优点：心胸宽广。缺点：保守谨慎。",
  "太阴": "田宅之主，五行属水。主富、不动产。优点：温柔细心。缺点：多愁善感。",
  "贪狼": "欲望之星，五行属木/水。主祸福、桃花。优点：多才多艺。缺点：贪得无厌。",
  "巨门": "是非之星，五行属水。主疑惑、口舌。优点：口才极佳。缺点：容易得罪人。",
  "天相": "印星，五行属水。主官禄、慈爱。优点：忠诚可靠。缺点：缺乏主见。",
  "天梁": "荫星，五行属土。主寿、贵、老。优点：慈悲为怀。缺点：好管闲事。",
  "七杀": "将星，五行属金。主肃杀、孤克。优点：勇往直前。缺点：冲动鲁莽。",
  "破军": "耗星，五行属水。主破坏、变动。优点：创意无限。缺点：喜新厌旧。",
};

// 模拟评分逻辑 - 根据模式调整权重
const calculateScore = (palace: any, mode: AnalysisMode = "general") => {
    let score = 65; // 基础分
    if (!palace) return 0;
    
    // 基础星曜分
    palace.majorStars.forEach((star: any) => {
        if (star.brightness === '庙') score += 12;
        else if (star.brightness === '旺') score += 8;
        else if (star.brightness === '平') score += 0;
        else if (star.brightness === '陷') score -= 8;
        
        // 四化加权
        if (star.mutagen === '禄') score += 15;
        if (star.mutagen === '权') score += 10;
        if (star.mutagen === '科') score += 5;
        if (star.mutagen === '忌') score -= 20;
    });

    // 模式加权 (Shen88 风格的专题优化)
    if (mode === "wealth" && ["财帛", "田宅", "兄弟"].includes(palace.name)) score *= 1.1; // 财运模式加权
    if (mode === "love" && ["夫妻", "交友", "子女"].includes(palace.name)) score *= 1.1;   // 桃花模式加权
    if (mode === "career" && ["官禄", "迁移", "父母"].includes(palace.name)) score *= 1.1; // 事业模式加权

    return Math.min(100, Math.max(20, Math.round(score)));
};

// 开运建议生成器
const getLuckyTips = (horoscope: any) => {
  if (!horoscope) return { color: "红", number: "8", direction: "南" };
  // 简单模拟算法，实际可根据五行喜忌
  const stem = horoscope.solarDate.split("")[0]; // 取年干
  const colors: any = { 甲: "绿", 乙: "蓝", 丙: "红", 丁: "紫", 戊: "黄", 己: "褐", 庚: "白", 辛: "金", 壬: "黑", 癸: "灰" };
  return {
    color: colors[stem] || "红",
    number: Math.floor(Math.random() * 9) + 1,
    direction: ["东", "南", "西", "北"][Math.floor(Math.random() * 4)]
  };
};

export default function ZiWeiApp() {
  const [mounted, setMounted] = useState(false);
  const [birthDate, setBirthDate] = useState("1990-05-31");
  const [birthTime, setBirthTime] = useState(15);
  const [gender, setGender] = useState<Gender>("男");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [selectedPalace, setSelectedPalace] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>("analysis");
  const [selectedStar, setSelectedStar] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("general"); // 新增专题模式

  useEffect(() => { setMounted(true); }, []);

  const horoscope = useMemo<any>(() => {
    if (!mounted) return null;
    try {
      const timeIndex = Math.floor((birthTime + 1) / 2) % 12;
      return astro.bySolar(birthDate, timeIndex, gender, true, "zh-CN");
    } catch (e) { return null; }
  }, [birthDate, birthTime, gender, mounted]);

  const yearlyData = useMemo(() => {
    if (!horoscope || !mounted) return null;
    try { return horoscope.horoscope(targetYear); } catch (e) { return null; }
  }, [horoscope, targetYear, mounted]);

  const lifeTrendData = useMemo(() => {
    if (!horoscope) return [];
    const sortedPalaces = [...horoscope.palaces].sort((a: any, b: any) => a.decadal.range[0] - b.decadal.range[0]);
    return sortedPalaces.map((p: any) => ({
      age: p.decadal.range[0],
      endAge: p.decadal.range[1],
      score: calculateScore(p, analysisMode), // 分数随模式变化
      name: p.name,
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch
    }));
  }, [horoscope, analysisMode]);

  const luckyTips = useMemo(() => getLuckyTips(horoscope), [horoscope]);

  if (!mounted) return <div className="min-h-screen bg-[#fdfbf7]" />;

  const gridPositions: Record<string, string> = {
    "巳": "md:col-start-1 md:row-start-1", "午": "md:col-start-2 md:row-start-1",
    "未": "md:col-start-3 md:row-start-1", "申": "md:col-start-4 md:row-start-1",
    "辰": "md:col-start-1 md:row-start-2", "酉": "md:col-start-4 md:row-start-2",
    "卯": "md:col-start-1 md:row-start-3", "戌": "md:col-start-4 md:row-start-3",
    "寅": "md:col-start-1 md:row-start-4", "丑": "md:col-start-2 md:row-start-4",
    "子": "md:col-start-3 md:row-start-4", "亥": "md:col-start-4 md:row-start-4",
  };

  // 模式配置
  const modeConfig = {
    general: { color: "slate", icon: Layout, label: "综合运势" },
    wealth: { color: "amber", icon: Coins, label: "财运走势" },
    love: { color: "pink", icon: Heart, label: "情感婚姻" },
    career: { color: "blue", icon: Briefcase, label: "事业官禄" },
  };

  const currentTheme = modeConfig[analysisMode];

  return (
    <div className={`min-h-screen font-sans selection:bg-${currentTheme.color}-200 pb-20 bg-slate-50 text-slate-800`}>
      {/* 顶栏 */}
      <header className="fixed top-0 w-full z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg bg-${currentTheme.color}-500 shadow-${currentTheme.color}-200`}>
            <currentTheme.icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none">
              紫微斗数 <span className={`text-[10px] font-normal text-${currentTheme.color}-600 bg-${currentTheme.color}-50 border border-${currentTheme.color}-200 rounded px-1 ml-1 align-top`}>V7.0</span>
            </h1>
            <span className="text-[10px] text-slate-500">Shen88 全能综世版</span>
          </div>
        </div>
        
        {/* 专题模式切换器 (Shen88 核心功能参考) */}
        <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
            {(Object.keys(modeConfig) as AnalysisMode[]).map((mode) => (
                <button 
                    key={mode}
                    onClick={() => setAnalysisMode(mode)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${analysisMode === mode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {modeConfig[mode].label}
                </button>
            ))}
        </div>

        <button onClick={() => setShowHelp(true)} className={`flex items-center gap-1 text-xs font-bold text-${currentTheme.color}-600 bg-${currentTheme.color}-50 hover:bg-${currentTheme.color}-100 px-3 py-1.5 rounded-full transition-colors`}>
          <BookOpen className="w-4 h-4" /> <span>指南</span>
        </button>
      </header>
      
      {/* 移动端模式切换 (仅小屏显示) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-30 flex justify-around p-2 pb-safe">
         {(Object.keys(modeConfig) as AnalysisMode[]).map((mode) => {
             const Icon = modeConfig[mode].icon;
             return (
                <button key={mode} onClick={() => setAnalysisMode(mode)} className={`flex flex-col items-center gap-1 p-2 ${analysisMode === mode ? `text-${modeConfig[mode].color}-600` : 'text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px]">{modeConfig[mode].label}</span>
                </button>
             )
         })}
      </div>

      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* 1. 输入区 & 开运罗盘 */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">公历日期</label>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400">时辰</label>
                    <select value={birthTime} onChange={e => setBirthTime(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm focus:ring-2 outline-none">
                        {Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{i}:00 ({getTimeZhi(i)})</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">流年年份</label>
                    <input type="number" value={targetYear} onChange={e => setTargetYear(Number(e.target.value))} className={`w-full bg-${currentTheme.color}-50 border border-${currentTheme.color}-200 text-${currentTheme.color}-600 font-bold rounded px-3 py-2 text-sm focus:ring-2 outline-none`} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">性别</label>
                    <div className="flex bg-slate-50 rounded p-1 border border-slate-200">
                         {(['男', '女'] as Gender[]).map(g => (
                            <button key={g} onClick={() => setGender(g)} className={`flex-1 text-xs py-1.5 rounded transition-all ${gender === g ? `bg-white text-${currentTheme.color}-600 shadow-sm font-bold` : 'text-slate-400 hover:text-slate-600'}`}>{g}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 开运罗盘 (新增功能) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10"><Compass className="w-16 h-16" /></div>
                 <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500"/> 今日开运指南</h3>
                 <div className="grid grid-cols-3 gap-2 text-center">
                     <div className="bg-slate-50 rounded p-2">
                         <Palette className="w-4 h-4 mx-auto text-slate-400 mb-1"/>
                         <div className="text-[10px] text-slate-400">幸运色</div>
                         <div className="font-bold text-slate-700">{luckyTips.color}</div>
                     </div>
                     <div className="bg-slate-50 rounded p-2">
                         <Hash className="w-4 h-4 mx-auto text-slate-400 mb-1"/>
                         <div className="text-[10px] text-slate-400">幸运数</div>
                         <div className="font-bold text-slate-700">{luckyTips.number}</div>
                     </div>
                     <div className="bg-slate-50 rounded p-2">
                         <MapPin className="w-4 h-4 mx-auto text-slate-400 mb-1"/>
                         <div className="text-[10px] text-slate-400">贵人方</div>
                         <div className="font-bold text-slate-700">{luckyTips.direction}</div>
                     </div>
                 </div>
            </div>
        </section>

        {/* 2. 人生 K 线图 (根据模式动态变化) */}
        {lifeTrendData.length > 0 && (
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg relative overflow-hidden transition-colors duration-500">
             <div className="flex justify-between items-end mb-6">
                <div>
                   <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <currentTheme.icon className={`text-${currentTheme.color}-600`} /> 
                       {modeConfig[analysisMode].label} K 线
                   </h2>
                   <p className="text-xs text-slate-500 mt-1">
                       {analysisMode === 'wealth' && "财帛宫/田宅宫/兄弟宫 联合加权指数"}
                       {analysisMode === 'love' && "夫妻宫/交友宫/子女宫 联合加权指数"}
                       {analysisMode === 'career' && "官禄宫/父母宫/迁移宫 联合加权指数"}
                       {analysisMode === 'general' && "命宫/身宫/福德宫 综合人生运势"}
                   </p>
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>旺运区</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>潜龙区</div>
                </div>
             </div>
             
             {/* SVG Chart */}
             <div className="w-full h-[180px] relative">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" className="overflow-visible">
                   <defs>
                     <linearGradient id={`trendGradient-${analysisMode}`} x1="0" x2="0" y1="0" y2="1">
                       <stop offset="0%" stopColor={analysisMode === 'wealth' ? '#fbbf24' : analysisMode === 'love' ? '#f472b6' : analysisMode === 'career' ? '#60a5fa' : '#94a3b8'} stopOpacity="0.3" />
                       <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                     </linearGradient>
                   </defs>
                   
                   {/* Trend Line */}
                   <path 
                     d={`M ${lifeTrendData.map((d: any, i: number) => 
                        `${(i / (lifeTrendData.length - 1)) * 1000},${200 - (d.score * 1.8)}`
                     ).join(" L ")}`}
                     fill="none"
                     stroke={analysisMode === 'wealth' ? '#d97706' : analysisMode === 'love' ? '#db2777' : analysisMode === 'career' ? '#2563eb' : '#475569'}
                     strokeWidth="3"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   />
                   <path 
                     d={`M 0,200 
                        ${lifeTrendData.map((d: any, i: number) => 
                           `L ${(i / (lifeTrendData.length - 1)) * 1000},${200 - (d.score * 1.8)}`
                        ).join(" ")} 
                        L 1000,200 Z`}
                     fill={`url(#trendGradient-${analysisMode})`}
                   />

                   {/* Points */}
                   {lifeTrendData.map((d: any, i: number) => {
                      const x = (i / (lifeTrendData.length - 1)) * 1000;
                      const y = 200 - (d.score * 1.8);
                      const isHigh = d.score >= 80;
                      return (
                        <g key={i} className="group cursor-pointer">
                           <circle cx={x} cy={y} r={isHigh ? 6 : 3} fill={isHigh ? "#ef4444" : "white"} stroke={isHigh ? "#ef4444" : "#cbd5e1"} strokeWidth="2" className="transition-all group-hover:r-6"/>
                           <foreignObject x={x - 20} y={y - 35} width="40" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                               <div className="bg-slate-800 text-white text-[10px] rounded px-1 py-0.5 text-center shadow-lg">{d.age}岁<br/>{d.score}分</div>
                           </foreignObject>
                        </g>
                      );
                   })}
                </svg>
                {/* X-Axis */}
                <div className="flex justify-between mt-2 px-2 border-t border-slate-100 pt-2">
                   {lifeTrendData.map((d: any, i: number) => (
                      <div key={i} className="text-center w-8">
                         <div className="text-[10px] font-bold text-slate-600">{d.age}</div>
                      </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* 3. 命盘详情 (Grid) */}
        {horoscope && (
          <div className="relative w-full max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 h-auto md:h-[720px]">
              {/* 中宫：详细信息 */}
              <div className="hidden md:flex col-start-2 col-end-4 row-start-2 row-end-4 bg-[#f8f9fa] border-2 border-slate-200 rounded-2xl flex-col items-center justify-center text-center p-6 shadow-inner">
                  <div className={`text-sm font-bold text-${currentTheme.color}-600 bg-${currentTheme.color}-50 px-3 py-1 rounded-full mb-2`}>
                      {horoscope.lunarDate} (农历)
                  </div>
                  <div className="text-3xl font-serif font-bold text-slate-800 mb-1">{targetYear} <span className="text-lg text-slate-500">流年</span></div>
                  <div className="text-xs text-slate-400 mt-2">
                      当前模式：<span className={`font-bold text-${currentTheme.color}-600`}>{modeConfig[analysisMode].label}</span>
                  </div>
              </div>

              {horoscope.palaces.map((palace: any, index: number) => {
                 const isYearlyPalace = yearlyData?.yearly.palaceName === palace.name;
                 const score = calculateScore(palace, analysisMode);
                 // 突出显示当前模式相关的宫位
                 let isModeHighlight = false;
                 if (analysisMode === "wealth" && ["财帛", "田宅", "兄弟"].includes(palace.name)) isModeHighlight = true;
                 if (analysisMode === "love" && ["夫妻", "交友", "子女"].includes(palace.name)) isModeHighlight = true;
                 if (analysisMode === "career" && ["官禄", "迁移", "父母"].includes(palace.name)) isModeHighlight = true;

                 return (
                  <motion.div
                    key={index}
                    onClick={() => { setSelectedPalace(palace); setActiveTab('analysis'); setSelectedStar(null); }}
                    whileHover={{ y: -2 }}
                    className={`
                        ${gridPositions[palace.earthlyBranch]} 
                        relative cursor-pointer bg-white border rounded-xl p-3 flex flex-col justify-between transition-all shadow-sm hover:shadow-lg min-h-[140px] md:min-h-0
                        ${isYearlyPalace ? 'ring-2 ring-orange-400 border-orange-400' : isModeHighlight ? `border-${currentTheme.color}-400 bg-${currentTheme.color}-50/10` : 'border-slate-200'}
                    `}
                  >
                    <div className="flex justify-between items-start border-b border-slate-100 pb-1 mb-1">
                        <div className="flex items-center gap-1">
                            <span className={`text-sm font-bold ${isYearlyPalace ? 'text-[#c2410c]' : isModeHighlight ? `text-${currentTheme.color}-600` : 'text-[#374151]'}`}>{palace.name}</span>
                            {isYearlyPalace && <span className="text-[9px] bg-[#c2410c] text-white px-1.5 py-0.5 rounded-full shadow-sm">流年</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                    </div>

                    <div className="flex-1 content-start flex flex-wrap gap-1">
                        {palace.majorStars.map((s: any) => (
                            <span key={s.name} className={`text-xs font-bold ${['庙','旺'].includes(s.brightness) ? 'text-red-600' : 'text-slate-700'}`}>
                                {s.name}
                                {s.mutagen && <span className={`ml-0.5 text-[8px] text-white px-1 rounded-sm ${s.mutagen === '忌' ? 'bg-green-600' : 'bg-red-500'}`}>{s.mutagen}</span>}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-end mt-1 pt-1 border-t border-slate-100">
                         <span className="text-[9px] text-slate-400 font-bold">{palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
                         <div className="flex items-center gap-1">
                             <span className={`text-[10px] font-bold ${score > 80 ? 'text-red-500' : 'text-slate-400'}`}>{score}</span>
                         </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 4. 详情弹窗 */}
      <AnimatePresence>
        {selectedPalace && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPalace(null)}>
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {selectedPalace.name}宫 
                                <span className="text-xs font-normal text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-0.5">
                                    {selectedPalace.heavenlyStem}{selectedPalace.earthlyBranch}
                                </span>
                            </h2>
                        </div>
                        <button onClick={() => setSelectedPalace(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
                    </div>

                    <div className="flex border-b border-slate-100">
                        {[
                            { id: 'analysis', label: '深度分析', icon: TrendingUp },
                            { id: 'stars', label: '星曜解读', icon: Star },
                            { id: 'sanfang', label: '三方四正', icon: Compass },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabView)} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${activeTab === tab.id ? `text-${currentTheme.color}-600 bg-${currentTheme.color}-50 border-b-2 border-${currentTheme.color}-600` : 'text-slate-500 hover:bg-slate-50'}`}>
                                <tab.icon className="w-3 h-3" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-5 overflow-y-auto flex-1 bg-white">
                        {activeTab === 'analysis' && (
                            <div className="space-y-4">
                                <div className={`bg-${currentTheme.color}-50 p-4 rounded-xl border border-${currentTheme.color}-100`}>
                                    <h3 className={`text-sm font-bold text-${currentTheme.color}-800 mb-2 flex items-center gap-2`}>
                                        <Zap className="w-4 h-4" /> 
                                        {analysisMode === 'wealth' && "财运指数"}
                                        {analysisMode === 'love' && "桃花指数"}
                                        {analysisMode === 'career' && "职场指数"}
                                        {analysisMode === 'general' && "综合指数"}
                                        ：{calculateScore(selectedPalace, analysisMode)}
                                    </h3>
                                    <p className={`text-xs text-${currentTheme.color}-800/80 leading-relaxed`}>
                                        {calculateScore(selectedPalace, analysisMode) > 75 
                                            ? "当前模式下，该宫位显示出强劲的正面能量，是您在该领域取得突破的关键点。" 
                                            : "当前模式下，该宫位能量较为平缓或受阻，建议在该领域采取守势，避免冒进。"}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> 宫位定义
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">{palaceDefinitions[selectedPalace.name]}</p>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'stars' && (
                             <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {selectedPalace.majorStars.map((star: any) => (
                                        <button key={star.name} onClick={() => setSelectedStar(star.name)} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${selectedStar === star.name ? `bg-${currentTheme.color}-600 text-white border-${currentTheme.color}-600` : 'bg-white text-slate-700 border-slate-200'}`}>{star.name}</button>
                                    ))}
                                </div>
                                {selectedStar && starEncyclopedia[selectedStar] ? (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                                        <h4 className="font-bold text-slate-800 mb-2 text-sm flex items-center gap-2"><Star className="w-3 h-3 text-amber-500"/> {selectedStar}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{starEncyclopedia[selectedStar]}</p>
                                    </div>
                                ) : (<div className="text-center py-8 text-xs text-slate-300">点击星曜查看解读</div>)}
                            </div>
                        )}
                         {activeTab === 'sanfang' && (
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400">三合</div><div className="font-bold text-slate-700 text-sm mt-1">官禄位</div></div>
                                <div className={`p-3 bg-${currentTheme.color}-50 rounded-lg border border-${currentTheme.color}-200 ring-2 ring-${currentTheme.color}-100`}><div className={`text-[10px] text-${currentTheme.color}-500 font-bold`}>本宫</div><div className={`font-bold text-${currentTheme.color}-700 text-sm mt-1`}>{selectedPalace.name}</div></div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400">三合</div><div className="font-bold text-slate-700 text-sm mt-1">财帛位</div></div>
                                <div className="col-start-2 p-3 bg-slate-50 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400">对宫</div><div className="font-bold text-slate-700 text-sm mt-1">迁移位</div></div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getTimeZhi(hour: number) {
  const zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const index = Math.floor((hour + 1) / 2) % 12;
  return zhi[index];
}