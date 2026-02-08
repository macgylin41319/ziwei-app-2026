"use client";

import React, { useState, useMemo } from "react";
import { astro } from "iztro";
import { X, Star, Moon, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";

export default function ZiWeiApp() {
  const [birthDate, setBirthDate] = useState("1998-08-16");
  const [birthTime, setBirthTime] = useState(14);
  const [gender, setGender] = useState<Gender>("女");
  // 这里把 FunctionalPalace 换成了 any，解决了报错
  const [selectedPalace, setSelectedPalace] = useState<any>(null);

  const horoscope = useMemo(() => {
    try {
      return astro.bySolar(birthDate, birthTime, gender, true, "zh-CN");
    } catch (e) {
      return null;
    }
  }, [birthDate, birthTime, gender]);

  const gridPositions: Record<string, string> = {
    "巳": "md:col-start-1 md:row-start-1",
    "午": "md:col-start-2 md:row-start-1",
    "未": "md:col-start-3 md:row-start-1",
    "申": "md:col-start-4 md:row-start-1",
    "辰": "md:col-start-1 md:row-start-2",
    "酉": "md:col-start-4 md:row-start-2",
    "卯": "md:col-start-1 md:row-start-3",
    "戌": "md:col-start-4 md:row-start-3",
    "寅": "md:col-start-1 md:row-start-4",
    "丑": "md:col-start-2 md:row-start-4",
    "子": "md:col-start-3 md:row-start-4",
    "亥": "md:col-start-4 md:row-start-4",
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-purple-500/30">
      <header className="fixed top-0 w-full z-10 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Moon className="text-purple-400 w-6 h-6" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
            紫微斗数 <span className="text-xs font-normal text-slate-500 border border-slate-700 rounded px-1 ml-1">PRO</span>
          </h1>
        </div>
        <span className="text-xs text-slate-500">By Gemini</span>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5 shadow-xl">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">公历日期</label>
                <input 
                    type="date" 
                    value={birthDate} 
                    onChange={e => setBirthDate(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">出生时辰</label>
                <select 
                    value={birthTime} 
                    onChange={e => setBirthTime(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                    {Array.from({length: 24}).map((_, i) => (
                        <option key={i} value={i}>{i}:00 - {i}:59 ({getTimeZhi(i)})</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">性别</label>
                <div className="flex bg-slate-800 rounded-md p-1 border border-slate-700 h-[38px]">
                    {(['男', '女'] as Gender[]).map(g => (
                        <button 
                            key={g}
                            onClick={() => setGender(g)}
                            className={`flex-1 rounded text-sm transition-all ${gender === g ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-end">
                <div className="w-full text-center text-xs text-slate-500 pb-2">
                    {horoscope ? `${horoscope.solarDate} · ${horoscope.lunarDate}` : '请选择时间'}
                </div>
            </div>
        </section>

        {horoscope && (
          <div className="relative w-full aspect-auto md:aspect-square max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-3 md:gap-1 h-auto md:h-[700px]">
              <div className="hidden md:flex col-start-2 col-end-4 row-start-2 row-end-4 bg-slate-900/40 border border-slate-800 rounded-lg flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
                  <div className="text-3xl font-serif text-slate-200 mb-2">{horoscope.solarDate}</div>
                  <div className="text-purple-400 text-sm mb-4 font-mono tracking-widest">{horoscope.chineseDate}</div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 w-full max-w-[200px]">
                      <div className="bg-slate-800/50 py-1 rounded">局：{horoscope.fiveElements}</div>
                      <div className="bg-slate-800/50 py-1 rounded">命主：{horoscope.soul}</div>
                      <div className="bg-slate-800/50 py-1 rounded">身主：{horoscope.body}</div>
                      <div className="bg-slate-800/50 py-1 rounded">生肖：{horoscope.zodiac}</div>
                  </div>
              </div>

              {horoscope.palaces.map((palace: any, index: number) => {
                 const isLifePalace = palace.name === '命宫';
                 const isBodyPalace = palace.name === '身宫';
                 return (
                  <motion.div
                    key={index}
                    layoutId={`palace-${index}`}
                    onClick={() => setSelectedPalace(palace)}
                    className={`
                        ${gridPositions[palace.earthlyBranch]} 
                        relative bg-slate-800/80 hover:bg-slate-700/80 cursor-pointer
                        border ${isLifePalace ? 'border-purple-500 shadow-[0_0_15px_-3px_rgba(168,85,247,0.4)]' : 'border-white/5'} 
                        rounded-lg p-3 flex flex-col justify-between min-h-[140px] md:min-h-0 transition-all group
                    `}
                  >
                    <div className="flex justify-between items-start border-b border-white/5 pb-2 mb-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold tracking-widest ${isLifePalace ? 'text-purple-300' : 'text-slate-300'}`}>
                                {palace.name}
                            </span>
                            {isBodyPalace && <span className="text-[10px] bg-indigo-900 text-indigo-300 px-1 rounded">身</span>}
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                    </div>

                    <div className="flex-1 content-start flex flex-wrap gap-x-2 gap-y-1">
                        {palace.majorStars.map((star: any) => (
                            <span key={star.name} className={`text-sm font-bold ${['庙','旺'].includes(star.brightness) ? 'text-red-400' : 'text-slate-200'}`}>
                                {star.name}<sup className="text-[8px] ml-[1px] opacity-60 font-normal scale-75 inline-block text-slate-400">{star.brightness}</sup>
                                {star.mutagen && (
                                    <span className={`
                                        ml-1 text-[9px] px-[3px] rounded-sm
                                        ${star.mutagen === '禄' && 'bg-green-900/60 text-green-400'}
                                        ${star.mutagen === '权' && 'bg-amber-900/60 text-amber-400'}
                                        ${star.mutagen === '科' && 'bg-blue-900/60 text-blue-400'}
                                        ${star.mutagen === '忌' && 'bg-red-900/60 text-red-400'}
                                    `}>{star.mutagen}</span>
                                )}
                            </span>
                        ))}
                        {palace.minorStars.map((star: any) => (
                            <span key={star.name} className="text-xs text-slate-400 scale-95 origin-left">{star.name}</span>
                        ))}
                    </div>

                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5">
                        <div className="flex flex-col text-[9px] text-slate-500">
                           <span>{palace.changsheng12} · {palace.boshi12}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-mono text-purple-300/80">{palace.decadal.range[0]} - {palace.decadal.range[1]}</div>
                        </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedPalace && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedPalace(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {selectedPalace.name} 
                                    <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                                        {selectedPalace.heavenlyStem}{selectedPalace.earthlyBranch}宫
                                    </span>
                                </h2>
                            </div>
                            <button onClick={() => setSelectedPalace(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> 主星坐守
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPalace.majorStars.length > 0 ? (
                                        selectedPalace.majorStars.map((star: any) => (
                                            <div key={star.name} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex-1 min-w-[100px]">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-bold ${['庙','旺'].includes(star.brightness) ? 'text-red-400' : 'text-slate-200'}`}>
                                                        {star.name}
                                                    </span>
                                                    <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">{star.brightness}</span>
                                                </div>
                                                {star.mutagen && (
                                                    <div className={`text-xs mt-1 font-bold ${star.mutagen === '禄' && 'text-green-400'} ${star.mutagen === '权' && 'text-amber-400'} ${star.mutagen === '科' && 'text-blue-400'} ${star.mutagen === '忌' && 'text-red-400'}`}>
                                                        化{star.mutagen}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 text-sm italic py-2">命无正曜</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">辅星</h3>
                                <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                                    {selectedPalace.minorStars.map((star: any) => (
                                        <span key={star.name} className="bg-slate-800/50 px-2 py-1 rounded border border-white/5">{star.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
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