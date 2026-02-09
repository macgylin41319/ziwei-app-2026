"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";

// --- 简单图标组件 ---
const IconGrid = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>;
const IconStar = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconSmile = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;

type Gender = "男" | "女";
type TabView = "pan" | "ming" | "character";

// --- 静态数据库 ---
const siHuaRules: Record<string, string[]> = {
  "甲": ["廉贞", "破军", "武曲", "太阳"], "乙": ["天机", "天梁", "紫微", "太阴"],
  "丙": ["天同", "天机", "文昌", "廉贞"], "丁": ["太阴", "天同", "天机", "巨门"],
  "戊": ["贪狼", "太阴", "右弼", "天机"], "己": ["武曲", "贪狼", "天梁", "文曲"],
  "庚": ["太阳", "武曲", "太阴", "天同"], "辛": ["巨门", "太阳", "文曲", "文昌"],
  "壬": ["天梁", "紫微", "左辅", "武曲"], "癸": ["破军", "巨门", "太阴", "贪狼"],
};

const characterAnalysis: Record<string, any> = {
  "紫微": { title: "领袖型", desc: "紫微星坐命的人，天生具有领袖气质。你稳重、有威严，喜欢主导局面。你的自尊心很强，有时会显得有些高傲，但内心其实很渴望被认可。", pros: "稳重、有领导力、有责任感。", cons: "刚愎自用、耳根子软、爱面子。" },
  "天机": { title: "智多星", desc: "天机星坐命的人，脑子转得特别快。你机智多谋，善于分析和策划。你的心思很细腻，但也容易想太多，导致精神紧张。", pros: "反应敏捷、足智多谋、善于分析。", cons: "思虑过重、精神紧张、多愁善感。" },
  "太阳": { title: "奉献型", desc: "太阳星坐命的人，像太阳一样热情博爱。你喜欢照顾别人，做事积极主动，很有正义感。你坦率直接，藏不住话。", pros: "热情积极、博爱无私、坦率直接。", cons: "劳心劳力、好面子、容易招惹是非。" },
  "武曲": { title: "实干家", desc: "武曲星坐命的人，刚毅果决，非常有执行力。你对金钱和数字很敏感，理财能力强。你性格比较直爽，不喜欢拐弯抹角。", pros: "刚毅果决、执行力强、对金钱敏感。", cons: "性格孤僻、不解风情、固执己见。" },
  "天同": { title: "乐天派", desc: "天同星坐命的人，是天生的福星。你性格温和，乐天知命，不喜欢与人争执。你很有童心，喜欢享受生活。", pros: "温和善良、乐天知命、人缘好。", cons: "好逸恶劳、缺乏干劲、容易软弱。" },
  "廉贞": { title: "公关高手", desc: "廉贞星坐命的人，才华横溢，擅长交际。你是非分明，很有主见，但也容易钻牛角尖。你的情感丰富，很有魅力。", pros: "公关能力强、才华横溢、是非分明。", cons: "心高气傲、情绪多变、钻牛角尖。" },
  "天府": { title: "大掌柜", desc: "天府星坐命的人，稳重踏实，很有包容力。你善于理财和管理，做事通过稳扎稳打。你比较爱面子，生活讲究品味。", pros: "稳重踏实、心胸宽广、善于理财。", cons: "保守谨慎、爱面子、缺乏冲劲。" },
  "太阴": { title: "完美主义", desc: "太阴星坐命的人，温柔细腻，追求完美。你重视家庭，爱干净，很有艺术天分。你的性格比较内向，容易多愁善感。", pros: "温柔细腻、追求完美、重视家庭。", cons: "多愁善感、洁癖、逃避现实。" },
  "贪狼": { title: "多才多艺", desc: "贪狼星坐命的人，多才多艺，擅长交际应酬。你的欲望比较强，野心大，喜欢新鲜刺激的事物。你的桃花运通常不错。", pros: "多才多艺、擅长交际、灵巧机变。", cons: "贪得无厌、喜新厌旧、投机取巧。" },
  "巨门": { title: "名嘴", desc: "巨门星坐命的人，口才极佳，观察力敏锐。你心思缜密，善于分析和研究。但你也容易因为嘴巴太厉害而得罪人。", pros: "口才极佳、分析力强、心思缜密。", cons: "多疑、容易得罪人、口舌是非。" },
  "天相": { title: "辅助者", desc: "天相星坐命的人，形象好，气质佳。你公正无私，很有正义感，喜欢帮助别人。你适合做辅助性的工作，但有时会显得缺乏主见。", pros: "公正无私、形象好、忠诚可靠。", cons: "缺乏主见、粉饰太平、容易随波逐流。" },
  "天梁": { title: "大哥哥/大姐姐", desc: "天梁星坐命的人，慈悲为怀，喜欢照顾别人。你成熟稳重，很有原则，也喜欢说教。你是一颗荫星，遇到困难容易逢凶化吉。", pros: "慈悲为怀、成熟稳重、逢凶化吉。", cons: "好管闲事、老气横秋、固执己见。" },
  "七杀": { title: "孤胆英雄", desc: "七杀星坐命的人，刚毅勇敢，非常有冲劲。你不喜欢被管束，喜欢独来独往，为了目标可以不顾一切。", pros: "刚毅勇敢、勇往直前、不畏艰难。", cons: "冲动鲁莽、独断专行、人生起伏大。" },
  "破军": { title: "先锋", desc: "破军星坐命的人，破坏力强，喜欢推翻重来。你很有创意，敢于突破传统，不按常理出牌。你的性格比较冲动。", pros: "创意无限、敢于突破、有开创精神。", cons: "破坏力强、喜新厌旧、反复无常。" },
};

export default function ZiWeiApp() {
  const [mounted, setMounted] = useState(false);
  // 初始化默认值（无记忆，刷新即重置）
  const [birthDate, setBirthDate] = useState("2000-01-01"); 
  const [birthTime, setBirthTime] = useState(0);
  const [gender, setGender] = useState<Gender>("女");
  const [activeTab, setActiveTab] = useState<TabView>("pan");

  useEffect(() => { setMounted(true); }, []);

  const horoscope = useMemo<any>(() => {
    if (!mounted) return null;
    try {
      const timeIndex = Math.floor((birthTime + 1) / 2) % 12;
      return astro.bySolar(birthDate, timeIndex, gender, true, "zh-CN");
    } catch (e) { return null; }
  }, [birthDate, birthTime, gender, mounted]);

  const lifePalace = useMemo(() => horoscope?.palaces.find((p: any) => p.name === "命宫"), [horoscope]);
  const mainStars = useMemo(() => lifePalace?.majorStars || [], [lifePalace]);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  // 坐标计算
  const gridPositions: Record<string, string> = {
    "巳": "col-start-1 row-start-1", "午": "col-start-2 row-start-1", "未": "col-start-3 row-start-1", "申": "col-start-4 row-start-1",
    "辰": "col-start-1 row-start-2", "酉": "col-start-4 row-start-2",
    "卯": "col-start-1 row-start-3", "戌": "col-start-4 row-start-3",
    "寅": "col-start-1 row-start-4", "丑": "col-start-2 row-start-4", "子": "col-start-3 row-start-4", "亥": "col-start-4 row-start-4",
  };
  const coords: any = { "巳": [1,1], "午": [2,1], "未": [3,1], "申": [4,1], "辰": [1,2], "酉": [4,2], "卯": [1,3], "戌": [4,3], "寅": [1,4], "丑": [2,4], "子": [3,4], "亥": [4,4] };
  const getCoord = (branch: string) => {
      const [col, row] = coords[branch] || [0,0];
      return `${(col - 0.5) * 25}% ${(row - 0.5) * 25}%`;
  };
  const sanFangBranches = lifePalace ? [lifePalace.earthlyBranch, horoscope.palaces.find((p:any)=>p.name==='官禄')?.earthlyBranch, horoscope.palaces.find((p:any)=>p.name==='财帛')?.earthlyBranch] : [];
  const duiGongBranch = horoscope?.palaces.find((p:any)=>p.name==='迁移')?.earthlyBranch;

  // 简单的八字拆分 (iztro返回的格式通常是: "庚午年 戊子月...")
  const bazi = horoscope?.chineseDate ? horoscope.chineseDate.split(' ') : ["-", "-", "-", "-"];
  const baziYear = bazi[0] || "未知";
  const baziMonth = bazi[1] || "未知";
  const baziDay = bazi[2] || "未知";
  const baziHour = bazi[3] || "未知";

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111] font-sans pb-20 selection:bg-[#e11d48] selection:text-white">
      {/* 顶部输入栏 */}
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30 shadow-sm">
         <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-3 items-center justify-between">
            <h1 className="text-base font-bold text-[#e11d48]">神巴巴紫微 <span className="text-[10px] font-normal text-gray-400">V9.0</span></h1>
            <div className="flex flex-wrap gap-2 text-xs">
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-white border border-[#d1d5db] px-2 py-1 rounded outline-none" />
                <select value={birthTime} onChange={e => setBirthTime(Number(e.target.value))} className="bg-white border border-[#d1d5db] px-2 py-1 rounded outline-none w-20">
                     {Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{i}时</option>)}
                </select>
                <div className="flex border border-[#d1d5db] rounded overflow-hidden">
                     {(['男', '女'] as Gender[]).map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`px-3 py-1 transition-colors ${gender === g ? 'bg-[#e11d48] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{g}</button>
                    ))}
                </div>
            </div>
         </div>
      </header>

      <main className="max-w-4xl mx-auto px-2 py-4 space-y-3">
        {/* Tab 导航 */}
        <div className="bg-white border border-[#e5e7eb] rounded-t-lg flex overflow-hidden">
            {[
                { id: "pan", label: "紫微排盘", icon: IconGrid },
                { id: "ming", label: "命宫分析", icon: IconStar },
                { id: "character", label: "性格分析", icon: IconSmile }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as TabView)} className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === tab.id ? "bg-[#fff1f2] text-[#e11d48] border-b-2 border-[#e11d48]" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}>
                    <tab.icon/><span>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* 核心内容 */}
        <div className="bg-white border border-[#e5e7eb] border-t-0 rounded-b-lg min-h-[500px] p-2">
            
            {/* 排盘模式 */}
            {activeTab === "pan" && horoscope && (
                <>
                <div className="relative grid grid-cols-4 grid-rows-4 gap-0 h-[520px] border border-[#d1d5db] bg-[#fff1f2] select-none">
                    {/* 背景连线 */}
                    <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        {sanFangBranches.length === 3 && (
                            <polygon points={`${getCoord(sanFangBranches[0])}, ${getCoord(sanFangBranches[1])}, ${getCoord(sanFangBranches[2])}`} fill="rgba(225, 29, 72, 0.03)" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="1" />
                        )}
                        {lifePalace && duiGongBranch && (
                            <line x1={getCoord(lifePalace.earthlyBranch)} y1={getCoord(duiGongBranch)} x2={getCoord(lifePalace.earthlyBranch).split(' ')[0]} y2={getCoord(lifePalace.earthlyBranch).split(' ')[1]} stroke="rgba(225, 29, 72, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
                        )}
                    </svg>

                    {/* 【核心升级】中宫信息 (仿照截图 247/右图) */}
                    <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-white/95 border border-[#d1d5db] flex flex-col p-3 z-20 overflow-hidden text-xs relative">
                        <div className="absolute top-2 right-2 opacity-5 pointer-events-none font-serif text-6xl">命</div>
                        
                        {/* 1. 日期 */}
                        <div className="space-y-1 mb-3">
                            <div className="flex text-[#374151]"><span className="w-8 text-gray-400">公历</span><span>{horoscope.solarDate}</span></div>
                            <div className="flex text-[#374151]"><span className="w-8 text-gray-400">农历</span><span>{horoscope.lunarDate}</span></div>
                        </div>

                        {/* 2. 八字四柱 (核心模仿点) */}
                        <div className="grid grid-cols-5 gap-1 mb-3 text-center">
                            <div className="flex flex-col justify-center text-gray-400 text-[10px]">
                                <span>{gender === '女' ? '坤' : '乾'}</span><span>造</span>
                            </div>
                            <div><div className="text-gray-400 text-[10px] scale-90">年柱</div><div className="font-bold">{baziYear}</div></div>
                            <div><div className="text-gray-400 text-[10px] scale-90">月柱</div><div className="font-bold">{baziMonth}</div></div>
                            <div><div className="text-gray-400 text-[10px] scale-90">日柱</div><div className="font-bold">{baziDay}</div></div>
                            <div><div className="text-gray-400 text-[10px] scale-90">时柱</div><div className="font-bold">{baziHour}</div></div>
                        </div>

                        {/* 3. 命身主信息 */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3 text-[#374151]">
                            <div className="flex"><span className="w-8 text-gray-400">命宫</span><span>{lifePalace?.earthlyBranch}</span></div>
                            <div className="flex"><span className="w-8 text-gray-400">身宫</span><span>{horoscope.palaces.find((p:any)=>p.name==='身宫')?.earthlyBranch}</span></div>
                            <div className="flex"><span className="w-8 text-gray-400">命主</span><span>{horoscope.soul}</span></div>
                            <div className="flex"><span className="w-8 text-gray-400">身主</span><span>{horoscope.body}</span></div>
                        </div>

                        {/* 4. 运势流 (分色显示) */}
                        <div className="mt-auto space-y-1 pt-2 border-t border-dashed border-gray-200 font-bold">
                            <div className="flex items-center text-[#16a34a]">
                                <span className="w-8 font-normal opacity-70">大运</span>
                                <span>{lifePalace?.decadal.range[0]}-{lifePalace?.decadal.range[1]} <span className="text-[10px] opacity-70">(第1大限)</span></span>
                            </div>
                            <div className="flex items-center text-[#2563eb]">
                                <span className="w-8 font-normal opacity-70">流年</span>
                                <span>{horoscope.solarDate.split('-')[0]}年</span>
                            </div>
                            <div className="flex items-center text-[#d97706]">
                                <span className="w-8 font-normal opacity-70">流月</span>
                                <span>农历{horoscope.lunarDate.split('年')[1]?.split('月')[0]}月</span>
                            </div>
                        </div>
                    </div>

                    {/* 十二宫位 (高密度展示) */}
                    {horoscope.palaces.map((palace: any, index: number) => (
                        <div key={index} className={`${gridPositions[palace.earthlyBranch]} bg-white border border-[#d1d5db] relative p-0.5 flex flex-col justify-between z-20 hover:bg-gray-50 transition-colors cursor-pointer`}>
                            <div className="flex justify-between items-start border-b border-[#e5e7eb] pb-0.5 mb-0.5">
                                <span className={`text-[11px] font-bold leading-none ${palace.name === '命宫' ? 'text-white bg-[#e11d48] px-1 py-0.5' : 'text-[#e11d48] px-0.5'}`}>{palace.name}</span>
                                <span className="text-[9px] text-[#9ca3af] scale-90 origin-right leading-none">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-0.5 content-start overflow-hidden px-0.5">
                                <div className="flex flex-wrap gap-x-1 gap-y-0 leading-none">
                                    {palace.majorStars.map((s: any) => (
                                        <span key={s.name} className={`text-[11px] font-bold tracking-tighter ${['庙','旺'].includes(s.brightness) ? 'text-[#dc2626]' : 'text-[#374151]'}`}>
                                            {s.name}{s.mutagen && <span className={`text-[8px] px-0.5 ml-px text-white rounded-sm ${s.mutagen === '忌' ? 'bg-[#059669]' : 'bg-[#dc2626]'}`}>{s.mutagen}</span>}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-x-0.5 gap-y-0 leading-none mt-auto opacity-80">
                                    {palace.minorStars.map((s: any) => (
                                        <span key={s.name} className="text-[9px] text-[#4b5563] scale-[0.85] origin-left tracking-tighter">{s.name}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-end border-t border-[#e5e7eb] pt-0.5 mt-0.5 leading-none px-0.5">
                                <span className="text-[9px] text-[#6b7280] scale-90 origin-left">{palace.changsheng12}</span>
                                <span className="text-[9px] font-bold text-[#4b5563] scale-90 origin-right">{palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 飞星四化速查表 */}
                <div className="mt-2 border border-[#d1d5db] text-[10px]">
                    <div className="grid grid-cols-11 bg-[#f9fafb] text-center font-bold border-b border-[#d1d5db] leading-relaxed py-1">
                        <div className="col-span-1 border-r border-[#d1d5db]">天干</div>
                        <div className="col-span-10 grid grid-cols-4">
                            <span className="text-[#dc2626]">化禄</span><span className="text-[#dc2626]">化权</span><span className="text-[#dc2626]">化科</span><span className="text-[#059669]">化忌</span>
                        </div>
                    </div>
                    {Object.entries(siHuaRules).map(([stem, stars], i) => (
                        <div key={stem} className={`grid grid-cols-11 text-center leading-relaxed ${i % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'}`}>
                            <div className="col-span-1 border-r border-[#d1d5db] border-b border-[#e5e7eb] font-bold text-gray-600">{stem}</div>
                            <div className="col-span-10 grid grid-cols-4 border-b border-[#e5e7eb]">
                                {stars.map((star, j) => (
                                    <span key={j} className={`border-r border-[#e5e7eb] last:border-r-0 ${j===3 ? 'text-[#059669]':'text-[#374151]'}`}>{star}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}

            {/* 命宫/性格分析 (保持简洁) */}
            {(activeTab === "ming" || activeTab === "character") && lifePalace && (
                <div className="space-y-4 p-2 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                            <span className="bg-[#e11d48] text-white text-xs px-2 py-1 rounded">主星</span>
                            <h3 className="font-bold text-gray-800 text-lg">
                                {mainStars.length > 0 ? mainStars.map((s:any)=>s.name).join("、") : "命无正曜"}
                            </h3>
                        </div>
                         {activeTab === "ming" && mainStars.map((s: any) => (
                             <div key={s.name} className="mb-4 last:mb-0">
                                 <h4 className="font-bold text-[#e11d48] text-sm mb-1">【{s.name}】格局分析</h4>
                                 <p className="text-sm text-gray-600 leading-relaxed text-justify">{characterAnalysis[s.name]?.desc}</p>
                             </div>
                         ))}
                         {activeTab === "character" && (
                             <div className="grid grid-cols-2 gap-4">
                                 <div><h4 className="font-bold text-gray-700 text-sm mb-2">优势</h4>
                                 <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">{mainStars.map((s:any)=><li key={s.name}>{characterAnalysis[s.name]?.pros}</li>)}</ul></div>
                                 <div><h4 className="font-bold text-gray-700 text-sm mb-2">注意</h4>
                                 <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">{mainStars.map((s:any)=><li key={s.name}>{characterAnalysis[s.name]?.cons}</li>)}</ul></div>
                             </div>
                         )}
                     </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

function getTimeZhi(hour: number) {
  const zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const index = Math.floor((hour + 1) / 2) % 12;
  return zhi[index];
}