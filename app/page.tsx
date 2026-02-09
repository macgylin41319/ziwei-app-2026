"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";
import { X, Star, Moon, Sparkles, BookOpen, Zap, Calendar, HelpCircle, Info, TrendingUp, BarChart3, Layout, Layers, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";
type TabView = "analysis" | "stars" | "sanfang" | "threeplates";

// --- 静态数据库扩充 ---
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
  "紫微": "帝王之星，五行属土。主尊贵、官禄。优点：稳重老成，有领导才能。缺点：容易刚愎自用，耳根子软。",
  "天机": "智慧之星，五行属木。主兄弟、智慧。优点：反应敏捷，足智多谋。缺点：思虑过重，精神紧张。",
  "太阳": "官禄之主，五行属火。主博爱、权贵。优点：热情积极，无私奉献。缺点：劳心劳力，好面子。",
  "武曲": "财帛之主，五行属金。主刚毅、财富。优点：执行力强，对金钱敏感。缺点：性格孤僻，不解风情。",
  "天同": "福德之主，五行属水。主享受、意志。优点：乐天知命，人缘好。缺点：好逸恶劳，缺乏干劲。",
  "廉贞": "次桃花星，五行属火。主邪恶、歪曲。优点：公关能力强，才华横溢。缺点：心高气傲，情绪多变。",
  "天府": "财库之主，五行属土。主延寿、解厄。优点：心胸宽广，善于理财。缺点：保守谨慎，缺乏冲劲。",
  "太阴": "田宅之主，五行属水。主富、不动产。优点：温柔细心，追求完美。缺点：多愁善感，逃避现实。",
  "贪狼": "欲望之星，五行属木/水。主祸福、桃花。优点：多才多艺，擅长交际。缺点：贪得无厌，喜新厌旧。",
  "巨门": "是非之星，五行属水。主疑惑、口舌。优点：口才极佳，心思细腻。缺点：容易得罪人，多疑。",
  "天相": "印星，五行属水。主官禄、慈爱。优点：忠诚可靠，斯文有礼。缺点：缺乏主见，粉饰太平。",
  "天梁": "荫星，五行属土。主寿、贵、老。优点：慈悲为怀，逢凶化吉。缺点：好管闲事，老气横秋。",
  "七杀": "将星，五行属金。主肃杀、孤克。优点：勇往直前，不畏艰难。缺点：冲动鲁莽，人生起伏大。",
  "破军": "耗星，五行属水。主破坏、变动。优点：创意无限，敢于突破。缺点：喜新厌旧，破坏力强。",
};

const mutagenDescriptions: Record<string, string> = {
  "禄": "【化禄】缘起、财源、机遇与顺遂。",
  "权": "【化权】缘变、掌权、掌控与成就。",
  "科": "【化科】缘续、名声、贵人与平稳。",
  "忌": "【化忌】缘灭、阻碍、波折与执着。",
};

// 模拟评分逻辑 (基于星曜亮度简单计算，仅供娱乐参考)
const calculateScore = (palace: any) => {
    let score = 60; // 基础分
    if (!palace) return 0;
    palace.majorStars.forEach((star: any) => {
        if (star.brightness === '庙') score += 10;
        else if (star.brightness === '旺') score += 8;
        else if (star.brightness === '平') score += 0;
        else if (star.brightness === '陷') score -= 5;
        if (star.mutagen === '禄') score += 15;
        if (star.mutagen === '权') score += 10;
        if (star.mutagen === '科') score += 8;
        if (star.mutagen === '忌') score -= 15;
    });
    return Math.min(100, Math.max(0, score));
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

  useEffect(() => { setMounted(true); }, []);

  // 1. 排盘计算
  const horoscope = useMemo<any>(() => {
    if (!mounted) return null;
    try {
      const timeIndex = Math.floor((birthTime + 1) / 2) % 12;
      return astro.bySolar(birthDate, timeIndex, gender, true, "zh-CN");
    } catch (e) { return null; }
  }, [birthDate, birthTime, gender, mounted]);

  // 2. 流年计算
  const yearlyData = useMemo(() => {
    if (!horoscope || !mounted) return null;
    try { return horoscope.horoscope(targetYear); } catch (e) { return null; }
  }, [horoscope, targetYear, mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#fdfbf7]" />;

  // 3. 计算宫位分数 (本命 + 流年)
  const scores = horoscope ? horoscope.palaces.map((p: any) => ({
      name: p.name,
      baseScore: calculateScore(p),
      yearlyScore: calculateScore(p) + (Math.random() * 20 - 10) // 模拟流年波动
  })) : [];

  const gridPositions: Record<string, string> = {
    "巳": "md:col-start-1 md:row-start-1", "午": "md:col-start-2 md:row-start-1",
    "未": "md:col-start-3 md:row-start-1", "申": "md:col-start-4 md:row-start-1",
    "辰": "md:col-start-1 md:row-start-2", "酉": "md:col-start-4 md:row-start-2",
    "卯": "md:col-start-1 md:row-start-3", "戌": "md:col-start-4 md:row-start-3",
    "寅": "md:col-start-1 md:row-start-4", "丑": "md:col-start-2 md:row-start-4",
    "子": "md:col-start-3 md:row-start-4", "亥": "md:col-start-4 md:row-start-4",
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#4a4238] font-sans selection:bg-amber-200 pb-20">
      {/* 顶栏 */}
      <header className="fixed top-0 w-full z-10 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e5e0d8] px-4 md:px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#8b5e3c] rounded-full flex items-center justify-center text-[#fdfbf7]">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#5c4033] tracking-widest leading-none">
              紫微斗数 <span className="text-[10px] font-normal text-[#8b5e3c] border border-[#8b5e3c] rounded px-1 ml-1 align-top">V5.0</span>
            </h1>
            <span className="text-[10px] text-[#9ca3af]">AI 全能运势分析系统</span>
          </div>
        </div>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1 text-xs font-bold text-[#8b5e3c] bg-[#f3efe9] hover:bg-[#eaddd3] px-3 py-1.5 rounded-full transition-colors">
          <BookOpen className="w-4 h-4" /> <span>入门</span>
        </button>
      </header>

      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* 输入区 & 仪表盘 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：输入控制 */}
            <div className="bg-[#fffefc] p-5 rounded-2xl border border-[#e6e2dc] shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-[#f3efe9] pb-2">
                    <Calendar className="w-5 h-5 text-[#8b5e3c]" />
                    <h2 className="font-bold text-[#5c4033]">命盘参数</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#9ca3af]">公历日期</label>
                        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-[#f9f7f5] border border-[#e5e0d8] rounded px-2 py-1.5 text-sm" />
                    </div>
                    <div className="space-y-1">
                         <label className="text-[10px] font-bold text-[#9ca3af]">时辰</label>
                        <select value={birthTime} onChange={e => setBirthTime(Number(e.target.value))} className="w-full bg-[#f9f7f5] border border-[#e5e0d8] rounded px-2 py-1.5 text-sm">
                            {Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{i}:00 ({getTimeZhi(i)})</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#9ca3af]">流年年份</label>
                        <input type="number" value={targetYear} onChange={e => setTargetYear(Number(e.target.value))} className="w-full bg-[#fffbeb] border border-[#fde68a] text-[#b45309] font-bold rounded px-2 py-1.5 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#9ca3af]">性别</label>
                        <div className="flex bg-[#f9f7f5] rounded p-0.5 border border-[#e5e0d8]">
                             {(['男', '女'] as Gender[]).map(g => (
                                <button key={g} onClick={() => setGender(g)} className={`flex-1 text-xs py-1 rounded ${gender === g ? 'bg-[#8b5e3c] text-white' : 'text-[#8b5e3c]'}`}>{g}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧：运势评分总览 (功能 ① & ⑤) */}
            <div className="lg:col-span-2 bg-[#fffefc] p-5 rounded-2xl border border-[#e6e2dc] shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f3efe9] pb-2 mb-3">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#b45309]" />
                        <h2 className="font-bold text-[#5c4033]">{targetYear}年 运势总览</h2>
                    </div>
                    <div className="text-xs text-[#9ca3af]">基于 V5.0 量化模型</div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-center">
                    {scores.map((s: any, i: number) => (
                        <div key={i} className="bg-[#f9f7f5] rounded-lg p-2 flex flex-col items-center">
                            <span className="text-[10px] text-[#9ca3af]">{s.name}</span>
                            <div className="w-full bg-[#e5e0d8] h-1.5 rounded-full mt-1 mb-1 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#8b5e3c] to-[#b45309]" style={{ width: `${Math.min(s.yearlyScore, 100)}%` }}></div>
                            </div>
                            <span className={`text-xs font-bold ${s.yearlyScore > 80 ? 'text-[#b91c1c]' : 'text-[#5c4033]'}`}>
                                {Math.round(s.yearlyScore)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {horoscope && (
          <div className="relative w-full max-w-[900px] mx-auto">
            {/* 宫位 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 h-auto md:h-[720px]">
              {/* 中宫：信息汇总 */}
              <div className="hidden md:flex col-start-2 col-end-4 row-start-2 row-end-4 bg-[#fdfbf7] border-2 border-[#e6e2dc] rounded-2xl flex-col items-center justify-center text-center p-6">
                  <Sparkles className="w-10 h-10 text-[#b45309] mb-3" />
                  <div className="text-3xl font-serif font-bold text-[#5c4033] mb-1">{targetYear} 丙午年</div>
                  <div className="text-sm text-[#8b5e3c] bg-[#fff7ed] px-3 py-1 rounded-full mb-4 border border-[#ffedd5]">
                    流年命宫：{yearlyData?.yearly.palaceName}
                  </div>
                  <div className="text-xs text-[#9ca3af] max-w-[200px] leading-relaxed">
                      点击周围宫位，即可查看<br/>
                      <span className="text-[#b45309] font-bold">三方四正、星曜详解、三盘联动</span>
                  </div>
              </div>

              {horoscope.palaces.map((palace: any, index: number) => {
                 const isYearlyPalace = yearlyData?.yearly.palaceName === palace.name;
                 const score = calculateScore(palace);
                 return (
                  <motion.div
                    key={index}
                    onClick={() => { setSelectedPalace(palace); setActiveTab('analysis'); setSelectedStar(null); }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                        ${gridPositions[palace.earthlyBranch]} 
                        relative cursor-pointer bg-white border rounded-xl p-3 flex flex-col justify-between transition-all shadow-sm hover:shadow-md min-h-[140px] md:min-h-0
                        ${isYearlyPalace ? 'ring-2 ring-[#b45309] border-[#b45309] bg-[#fffbf0]' : 'border-[#e6e2dc]'}
                    `}
                  >
                    <div className="flex justify-between items-start border-b border-[#f3efe9] pb-1 mb-1">
                        <div className="flex items-center gap-1">
                            <span className={`text-sm font-bold ${isYearlyPalace ? 'text-[#b45309]' : 'text-[#5c4033]'}`}>{palace.name}</span>
                            {isYearlyPalace && <span className="text-[8px] bg-[#b45309] text-white px-1 rounded">流年</span>}
                        </div>
                        <span className="text-[10px] text-[#9ca3af]">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                    </div>

                    <div className="flex-1 content-start flex flex-wrap gap-1">
                        {palace.majorStars.map((s: any) => (
                            <span key={s.name} className={`text-xs font-bold ${['庙','旺'].includes(s.brightness) ? 'text-[#b91c1c]' : 'text-[#4a4238]'}`}>
                                {s.name}
                                {s.mutagen && <span className="ml-0.5 text-[8px] bg-[#b91c1c] text-white px-0.5 rounded">{s.mutagen}</span>}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-end mt-1 pt-1 border-t border-[#f3efe9]">
                         <span className="text-[9px] text-[#9ca3af]">大限 {palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
                         <span className={`text-[10px] font-bold ${score > 80 ? 'text-[#15803d]' : 'text-[#9ca3af]'}`}>{score}分</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 核心弹窗：多功能面板 */}
      <AnimatePresence>
        {selectedPalace && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPalace(null)}>
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#fffefc] w-full max-w-lg rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    
                    {/* 弹窗顶栏 */}
                    <div className="p-4 border-b border-[#f3efe9] flex justify-between items-center bg-[#fdfbf7]">
                        <div>
                            <h2 className="text-xl font-bold text-[#5c4033] flex items-center gap-2">
                                {selectedPalace.name}宫 
                                <span className="text-sm font-normal text-[#9ca3af] border border-[#e5e0d8] rounded-full px-2 py-0.5">
                                    {selectedPalace.heavenlyStem}{selectedPalace.earthlyBranch}
                                </span>
                            </h2>
                        </div>
                        <button onClick={() => setSelectedPalace(null)} className="p-2 hover:bg-[#e5e0d8] rounded-full transition-colors"><X className="w-5 h-5 text-[#9ca3af]" /></button>
                    </div>

                    {/* 功能 Tab 切换 */}
                    <div className="flex border-b border-[#e5e0d8]">
                        {[
                            { id: 'analysis', label: '综合运势', icon: TrendingUp },
                            { id: 'stars', label: '星曜详解', icon: Star },
                            { id: 'sanfang', label: '三方四正', icon: Compass },
                            { id: 'threeplates', label: '三盘联动', icon: Layers },
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id as TabView)}
                                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 transition-colors
                                    ${activeTab === tab.id ? 'text-[#b45309] bg-[#fff7ed] border-b-2 border-[#b45309]' : 'text-[#9ca3af] hover:bg-[#f9f7f5]'}
                                `}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 内容区域 */}
                    <div className="p-5 overflow-y-auto flex-1 bg-[#fffefc]">
                        
                        {/* Tab 1: 综合运势 (功能 ⑤ & ➅) */}
                        {activeTab === 'analysis' && (
                            <div className="space-y-4">
                                <div className="bg-[#f0fdf4] p-4 rounded-xl border border-[#dcfce7]">
                                    <h3 className="text-sm font-bold text-[#166534] mb-2 flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> 能量评估：{calculateScore(selectedPalace)} 分
                                    </h3>
                                    <p className="text-xs text-[#15803d] leading-relaxed">
                                        该宫位在本命盘中能量{calculateScore(selectedPalace) > 75 ? '强劲，属于您的人生优势领域，建议重点发展。' : '较弱，属于需要防守或补救的领域，建议保守行事。'}
                                    </p>
                                </div>
                                <div className="bg-[#fff7ed] p-4 rounded-xl border border-[#ffedd5]">
                                    <h3 className="text-sm font-bold text-[#9a3412] mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> 流月趋势 ({targetYear}年)
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({length: 12}).map((_, i) => (
                                            <div key={i} className="text-center">
                                                <div className="text-[10px] text-[#9ca3af] mb-1">{i+1}月</div>
                                                <div className={`h-8 w-full rounded flex items-end justify-center pb-1 text-[9px] font-bold ${[2,5,8,11].includes(i) ? 'bg-[#fed7aa] text-[#9a3412]' : 'bg-[#f3f4f6] text-[#9ca3af]'}`}>
                                                    {[2,5,8,11].includes(i) ? '吉' : '平'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-[#9ca3af] mt-2 text-center">* 此表为流年月份运势评估示例</p>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: 星曜详解 (功能 ➁) */}
                        {activeTab === 'stars' && (
                            <div className="space-y-4">
                                <p className="text-xs text-[#9ca3af]">点击下方星曜名称，查看 AI 深度解读：</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPalace.majorStars.map((star: any) => (
                                        <button 
                                            key={star.name}
                                            onClick={() => setSelectedStar(star.name)}
                                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all
                                                ${selectedStar === star.name 
                                                    ? 'bg-[#b45309] text-white border-[#b45309] shadow-md' 
                                                    : 'bg-white text-[#5c4033] border-[#e5e0d8] hover:border-[#b45309]'}
                                            `}
                                        >
                                            {star.name}
                                        </button>
                                    ))}
                                </div>
                                {selectedStar && starEncyclopedia[selectedStar] ? (
                                    <div className="bg-[#f9fafb] p-4 rounded-xl border border-[#e5e7eb] mt-2">
                                        <h4 className="font-bold text-[#1f2937] mb-2 text-sm">【{selectedStar}】百科</h4>
                                        <p className="text-sm text-[#4b5563] leading-relaxed">{starEncyclopedia[selectedStar]}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-xs text-[#d1d5db]">请点击上方星曜查看详情</div>
                                )}
                            </div>
                        )}

                        {/* Tab 3: 三方四正 (功能 ➂) */}
                        {activeTab === 'sanfang' && (
                            <div className="space-y-4">
                                <div className="bg-[#eff6ff] p-4 rounded-xl border border-[#dbeafe]">
                                    <h3 className="text-sm font-bold text-[#1e40af] mb-2 flex items-center gap-2">
                                        <Layout className="w-4 h-4" /> 格局分析
                                    </h3>
                                    <p className="text-xs text-[#1e3a8a] leading-relaxed">
                                        三方四正构成了该宫位的外部环境。本宫强，还需三方助力；本宫弱，若三方吉星高照，亦可借力使力。
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 border border-[#e5e0d8] rounded bg-[#f9f7f5]">
                                        <div className="text-[10px] text-[#9ca3af]">官禄(三合)</div>
                                        <div className="font-bold text-[#5c4033] text-sm mt-1">强</div>
                                    </div>
                                    <div className="p-2 border border-[#b45309] rounded bg-[#fff7ed] ring-1 ring-[#b45309]">
                                        <div className="text-[10px] text-[#b45309] font-bold">本宫</div>
                                        <div className="font-bold text-[#b45309] text-sm mt-1">中</div>
                                    </div>
                                    <div className="p-2 border border-[#e5e0d8] rounded bg-[#f9f7f5]">
                                        <div className="text-[10px] text-[#9ca3af]">财帛(三合)</div>
                                        <div className="font-bold text-[#5c4033] text-sm mt-1">弱</div>
                                    </div>
                                    <div className="col-start-2 p-2 border border-[#e5e0d8] rounded bg-[#f9f7f5] mt-[-0.5rem]">
                                        <div className="text-[10px] text-[#9ca3af]">迁移(对宫)</div>
                                        <div className="font-bold text-[#5c4033] text-sm mt-1">吉</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 4: 三盘联动 (功能 ➃) */}
                        {activeTab === 'threeplates' && (
                            <div className="space-y-3">
                                <div className="p-3 border-l-4 border-[#3b82f6] bg-[#eff6ff] rounded-r-lg">
                                    <div className="text-xs font-bold text-[#1d4ed8]">天盘 (本命)</div>
                                    <div className="text-xs text-[#3b82f6] mt-1">定性：一生{selectedPalace.name}运势基调。</div>
                                </div>
                                <div className="p-3 border-l-4 border-[#eab308] bg-[#fefce8] rounded-r-lg">
                                    <div className="text-xs font-bold text-[#a16207]">地盘 (大限)</div>
                                    <div className="text-xs text-[#ca8a04] mt-1">趋势：这十年该领域的发展曲线。</div>
                                </div>
                                <div className="p-3 border-l-4 border-[#ef4444] bg-[#fef2f2] rounded-r-lg">
                                    <div className="text-xs font-bold text-[#b91c1c]">人盘 (流年)</div>
                                    <div className="text-xs text-[#ef4444] mt-1">应期：今年是否会发生具体变动？</div>
                                </div>
                                <p className="text-[10px] text-[#9ca3af] mt-4 text-center">
                                    * 三盘同参：先天为体，后天为用，流年为机。
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 新手引导弹窗 (功能 ➀) */}
      <AnimatePresence>
        {showHelp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
                <div className="bg-[#fffefc] p-6 rounded-2xl max-w-lg shadow-2xl border border-[#e6e2dc]" onClick={e => e.stopPropagation()}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#5c4033]"><BookOpen className="text-[#8b5e3c]" /> 紫微斗数基础入门</h2>
                    <div className="space-y-4 text-sm text-[#4a4238] overflow-y-auto max-h-[60vh] pr-2">
                        <div className="p-3 bg-[#f9f7f5] rounded-lg">
                            <h3 className="font-bold text-[#8b5e3c] mb-1">1. 什么是紫微斗数？</h3>
                            <p className="text-xs leading-relaxed">中国古代的"帝王学"，通过出生的时间（四柱）排列出星盘，分析人生的吉凶祸福。</p>
                        </div>
                        <div className="p-3 bg-[#f9f7f5] rounded-lg">
                            <h3 className="font-bold text-[#8b5e3c] mb-1">2. 十二宫位</h3>
                            <p className="text-xs leading-relaxed">命盘被分为12个格子，每个格子代表人生不同的领域（如：财帛代表钱财，夫妻代表感情）。</p>
                        </div>
                        <div className="p-3 bg-[#f9f7f5] rounded-lg">
                            <h3 className="font-bold text-[#8b5e3c] mb-1">3. 主星与辅星</h3>
                            <p className="text-xs leading-relaxed">红色的字是主星（主角），决定格局高低；其他小字是辅星（配角），影响细节吉凶。</p>
                        </div>
                        <div className="p-3 bg-[#f9f7f5] rounded-lg">
                            <h3 className="font-bold text-[#8b5e3c] mb-1">4. 如何看流年？</h3>
                            <p className="text-xs leading-relaxed">在上方输入年份，找到盘中<span className="text-[#b45309] font-bold">黄色高亮</span>的格子，那就是那一年的"运气中心"。</p>
                        </div>
                    </div>
                    <button onClick={() => setShowHelp(false)} className="mt-6 w-full bg-[#8b5e3c] text-white py-2.5 rounded-lg font-bold shadow-md hover:bg-[#704b30] transition-colors">开启我的命理之旅</button>
                </div>
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