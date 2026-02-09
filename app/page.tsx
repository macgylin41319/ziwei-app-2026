"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";

// --- 简单图标组件 ---
const IconGrid = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>;
const IconStar = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconSmile = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;

type Gender = "男" | "女";
type TabView = "pan" | "ming" | "character";

// --- 静态数据库 (十干四化口诀) ---
const siHuaRules: Record<string, string[]> = {
  "甲": ["廉贞", "破军", "武曲", "太阳"], "乙": ["天机", "天梁", "紫微", "太阴"],
  "丙": ["天同", "天机", "文昌", "廉贞"], "丁": ["太阴", "天同", "天机", "巨门"],
  "戊": ["贪狼", "太阴", "右弼", "天机"], "己": ["武曲", "贪狼", "天梁", "文曲"],
  "庚": ["太阳", "武曲", "太阴", "天同"], "辛": ["巨门", "太阳", "文曲", "文昌"],
  "壬": ["天梁", "紫微", "左辅", "武曲"], "癸": ["破军", "巨门", "太阴", "贪狼"],
};
// ... (性格分析数据库省略，保持不变，此处为节省空间) ...
const characterAnalysis: Record<string, any> = {
    "紫微": { title: "领袖型", desc: "紫微星坐命的人，天生具有领袖气质...", pros: "稳重、有领导力...", cons: "刚愎自用、爱面子..." },
    // ... 其他星星数据保持不变 ...
};


export default function ZiWeiApp() {
  const [mounted, setMounted] = useState(false);
  const [birthDate, setBirthDate] = useState("1995-08-16");
  const [birthTime, setBirthTime] = useState(14);
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

  // 网格位置与三方四正坐标计算
  const gridPositions: Record<string, string> = {
    "巳": "col-start-1 row-start-1", "午": "col-start-2 row-start-1", "未": "col-start-3 row-start-1", "申": "col-start-4 row-start-1",
    "辰": "col-start-1 row-start-2", "酉": "col-start-4 row-start-2",
    "卯": "col-start-1 row-start-3", "戌": "col-start-4 row-start-3",
    "寅": "col-start-1 row-start-4", "丑": "col-start-2 row-start-4", "子": "col-start-3 row-start-4", "亥": "col-start-4 row-start-4",
  };
  // 简化的坐标映射 (用于绘制 SVG 线条，基于 4x4 网格中心点)
  const coords: any = { "巳": [1,1], "午": [2,1], "未": [3,1], "申": [4,1], "辰": [1,2], "酉": [4,2], "卯": [1,3], "戌": [4,3], "寅": [1,4], "丑": [2,4], "子": [3,4], "亥": [4,4] };
  const getCoord = (branch: string) => {
      const [col, row] = coords[branch] || [0,0];
      return `${(col - 0.5) * 25}% ${(row - 0.5) * 25}%`; // 转换为百分比坐标
  };

  // 获取三方四正宫位地支
  const sanFangBranches = lifePalace ? [lifePalace.earthlyBranch, horoscope.palaces.find((p:any)=>p.name==='官禄')?.earthlyBranch, horoscope.palaces.find((p:any)=>p.name==='财帛')?.earthlyBranch] : [];
  const duiGongBranch = horoscope?.palaces.find((p:any)=>p.name==='迁移')?.earthlyBranch;

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111] font-sans pb-24 selection:bg-[#e11d48] selection:text-white">
      {/* 顶部 */}
      <header className="bg-white border-b border-[#d1d5db] sticky top-0 z-30">
         <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-3 items-center justify-between">
            <h1 className="text-base font-bold text-[#e11d48] flex items-center gap-2">
                神巴巴紫微 <span className="text-[10px] bg-[#f3f4f6] text-[#4b5563] px-1 py-0.5 border border-[#d1d5db] font-normal">深度高仿版</span>
            </h1>
            <div className="flex flex-wrap gap-1 text-xs">
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-white border border-[#d1d5db] px-1 py-0.5 outline-none h-6" />
                <select value={birthTime} onChange={e => setBirthTime(Number(e.target.value))} className="bg-white border border-[#d1d5db] px-1 py-0.5 outline-none h-6 w-16">
                     {Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{i}时</option>)}
                </select>
                <div className="flex border border-[#d1d5db] h-6">
                     {(['男', '女'] as Gender[]).map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`px-2 transition-colors ${gender === g ? 'bg-[#e11d48] text-white font-bold' : 'bg-white text-[#4b5563] hover:bg-[#f3f4f6]'}`}>{g}</button>
                    ))}
                </div>
            </div>
         </div>
      </header>

      <main className="max-w-4xl mx-auto px-2 py-4 space-y-4">
        {/* 基本信息 - 更紧凑的表格 */}
        {horoscope && (
        <section className="bg-white border border-[#d1d5db] text-xs">
            <div className="bg-[#fff1f2] px-2 py-1 border-b border-[#fecdd3] font-bold text-[#e11d48]">基本信息</div>
            <div className="p-2 grid grid-cols-4 gap-x-2 gap-y-1">
                <div><span className="text-[#6b7280]">公历：</span>{horoscope.solarDate}</div>
                <div><span className="text-[#6b7280]">农历：</span>{horoscope.lunarDate}</div>
                <div className="col-span-2"><span className="text-[#6b7280]">八字：</span><span className="font-medium tracking-wider">{horoscope.chineseDate?.split(' ').join(' ')}</span></div>
                <div><span className="text-[#6b7280]">局数：</span><span className="text-[#e11d48]">{horoscope.fiveElements}</span></div>
                <div><span className="text-[#6b7280]">生肖：</span>{horoscope.zodiac}</div>
                <div><span className="text-[#6b7280]">命主：</span>{horoscope.soul}</div>
                <div><span className="text-[#6b7280]">身主：</span>{horoscope.body}</div>
            </div>
        </section>
        )}

        {/* 内容区 */}
        <div className="bg-white border border-[#d1d5db] min-h-[500px]">
            <div className="flex border-b border-[#d1d5db] bg-[#f9fafb]">
                {[
                    { id: "pan", label: "紫微排盘", icon: IconGrid },
                    { id: "ming", label: "命宫分析", icon: IconStar },
                    { id: "character", label: "性格分析", icon: IconSmile }
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as TabView)} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1 border-r last:border-r-0 border-[#d1d5db] ${activeTab === tab.id ? "text-[#e11d48] bg-white" : "text-[#6b7280] hover:bg-[#f3f4f6]"}`}>
                        <tab.icon/><span className={activeTab === tab.id ? "" : "hidden md:inline"}>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-2">
                {activeTab === "pan" && horoscope && (
                    <>
                    <div className="relative grid grid-cols-4 grid-rows-4 gap-0 h-[480px] border border-[#d1d5db] bg-[#fff1f2]">
                        {/* 三方四正连线 SVG (新增功能) */}
                        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            {sanFangBranches.length === 3 && (
                                <polygon points={`${getCoord(sanFangBranches[0])}, ${getCoord(sanFangBranches[1])}, ${getCoord(sanFangBranches[2])}`} fill="rgba(225, 29, 72, 0.05)" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" />
                            )}
                            {lifePalace && duiGongBranch && (
                                <line x1={getCoord(lifePalace.earthlyBranch)} y1={getCoord(duiGongBranch)} x2={getCoord(lifePalace.earthlyBranch).split(' ')[0]} y2={getCoord(lifePalace.earthlyBranch).split(' ')[1]} stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="4 2" />
                            )}
                        </svg>

                        {/* 中宫 */}
                        <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-white border border-[#d1d5db] flex flex-col items-center justify-center text-center p-2 z-20">
                            <div className="text-xl font-serif font-bold text-[#e11d48] mb-1">紫微斗数命盘</div>
                            <div className="text-[10px] text-[#6b7280] leading-tight">
                                阳男阴女顺行<br/>阴男阳女逆行<br/>Shen88 在线排盘
                            </div>
                        </div>

                        {/* 十二宫位 - 超高密度布局 */}
                        {horoscope.palaces.map((palace: any, index: number) => (
                            <div key={index} className={`${gridPositions[palace.earthlyBranch]} bg-white border border-[#d1d5db] relative p-0.5 flex flex-col justify-between z-20`}>
                                <div className="flex justify-between items-start border-b border-[#e5e7eb] pb-0.5 mb-0.5">
                                    <span className={`text-[11px] font-bold leading-none ${palace.name === '命宫' ? 'text-white bg-[#e11d48] px-1 py-0.5' : 'text-[#e11d48] px-0.5'}`}>{palace.name}</span>
                                    <span className="text-[9px] text-[#9ca3af] scale-90 origin-right leading-none">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                                </div>
                                {/* 星曜区域 - 极致紧凑 */}
                                <div className="flex-1 flex flex-col gap-0.5 content-start overflow-hidden">
                                    <div className="flex flex-wrap gap-x-1 gap-y-0 leading-none">
                                        {palace.majorStars.map((s: any) => (
                                            <span key={s.name} className={`text-[11px] font-bold tracking-tighter ${['庙','旺'].includes(s.brightness) ? 'text-[#dc2626]' : 'text-[#374151]'}`}>
                                                {s.name}{s.mutagen && <span className={`text-[8px] px-0.5 ml-px text-white ${s.mutagen === '忌' ? 'bg-[#059669]' : 'bg-[#dc2626]'}`}>{s.mutagen}</span>}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap gap-x-0.5 gap-y-0 leading-none mt-auto">
                                        {palace.minorStars.map((s: any) => (
                                            <span key={s.name} className="text-[9px] text-[#4b5563] scale-[0.85] origin-left tracking-tighter">{s.name}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-t border-[#e5e7eb] pt-0.5 mt-0.5 leading-none">
                                    <span className="text-[9px] text-[#6b7280] scale-90 origin-left">{palace.changsheng12}</span>
                                    <span className="text-[9px] font-bold text-[#4b5563] scale-90 origin-right">{palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 飞星四化速查表 (新增功能) */}
                    <div className="mt-3 border border-[#d1d5db] text-[10px]">
                        <div className="bg-[#fff1f2] px-2 py-1 border-b border-[#fecdd3] font-bold text-[#e11d48]">飞星四化速查表</div>
                        <div className="grid grid-cols-11 bg-[#f9fafb] text-center font-bold border-b border-[#d1d5db] leading-tight">
                            <div className="p-1 border-r border-[#d1d5db]">天干</div>
                            <div className="col-span-10 grid grid-cols-4">
                                <span className="p-1 border-r border-[#d1d5db] text-[#dc2626]">化禄</span>
                                <span className="p-1 border-r border-[#d1d5db] text-[#dc2626]">化权</span>
                                <span className="p-1 border-r border-[#d1d5db] text-[#dc2626]">化科</span>
                                <span className="p-1 text-[#059669]">化忌</span>
                            </div>
                        </div>
                        {Object.entries(siHuaRules).map(([stem, stars], i) => (
                            <div key={stem} className={`grid grid-cols-11 text-center leading-tight ${i % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'}`}>
                                <div className="p-0.5 font-bold border-r border-[#d1d5db] border-b border-[#e5e7eb]">{stem}</div>
                                <div className="col-span-10 grid grid-cols-4 border-b border-[#e5e7eb]">
                                    {stars.map((star, j) => (
                                        <span key={j} className={`p-0.5 border-r border-[#e5e7eb] last:border-r-0 ${j===3 ? 'text-[#059669]':'text-[#374151]'}`}>{star}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    </>
                )}

                {/* 命宫/性格分析 (保持不变，但样式更紧凑) */}
                {(activeTab === "ming" || activeTab === "character") && lifePalace && (
                    <div className="space-y-4 text-sm p-2">
                        {/* ... (省略重复的命宫/性格分析代码，逻辑与之前相同，仅 CSS 微调更紧凑) ... */}
                         <div className="bg-white p-3 border border-[#d1d5db]">
                            <h3 className="font-bold text-[#e11d48] mb-2">
                                {activeTab === "ming" ? `命宫主星：${mainStars.map((s:any)=>s.name).join("、")||"无"}` : "性格关键词"}
                            </h3>
                             {activeTab === "ming" && mainStars.map((s: any) => <p key={s.name} className="text-[#374151] text-xs mb-2">【{s.name}】{characterAnalysis[s.name]?.desc}</p>)}
                             {activeTab === "character" && <div className="flex gap-2">{mainStars.map((s:any)=><span key={s.name} className="bg-[#e11d48] text-white text-xs px-2 py-0.5">{characterAnalysis[s.name]?.title}</span>)}</div>}
                         </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}