"use client";

import React, { useState, useMemo } from "react";
import { astro } from "iztro";
import { X, Star, Moon, Info, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";

// 星星解释字典（AI 简易解盘数据库）
const starDescriptions: Record<string, string> = {
  "紫微": "【帝王之星】尊贵权威，有领导力，耳根子软，喜听好话。在命宫代表一生贵人运强。",
  "天机": "【智慧之星】反应快，善于谋略，性急多变，容易想太多。适合动脑的工作。",
  "太阳": "【官禄之主】热情博爱，喜欢照顾人，做事积极，但是比较劳碌，容易招惹是非。",
  "武曲": "【财帛之主】刚毅果决，非常有执行力，但是略显孤僻，对钱财敏感，适合经商。",
  "天同": "【福德之主】乐天知命，像小孩子一样，不爱计较，有时候比较懒散，有福气。",
  "廉贞": "【次桃花星】公关能力强，是非分明，很有才华，但是性格多变，容易钻牛角尖。",
  "天府": "【财库之星】稳重保守，善于理财，包容力强，比较爱面子，生活讲究享受。",
  "太阴": "【田宅之主】温柔细心，追求完美，重视家庭，爱干净，适合内勤或艺术工作。",
  "贪狼": "【欲望之星】多才多艺，擅长交际，桃花旺，野心大，喜欢新鲜刺激的事物。",
  "巨门": "【是非之星】口才好，观察力敏锐，心思细腻，但是容易因为嘴快得罪人。",
  "天相": "【印星】宰相之辅，形象好，讲究吃穿，有正义感，耳根软，适合辅助他人的工作。",
  "天梁": "【老人星】慈悲为怀，喜欢照顾人，也是一颗“荫星”，遇到困难容易逢凶化吉。",
  "七杀": "【将星】刚毅勇敢，很有冲劲，不喜欢被管束，一生起伏较大，适合开创性工作。",
  "破军": "【耗星】破坏力强，喜欢推翻重来，很有创意，也是一颗变动之星，先破后立。",
};

export default function ZiWeiApp() {
  const [birthDate, setBirthDate] = useState("1979-05-31"); // 帮你改成你的默认日期
  const [birthTime, setBirthTime] = useState(15); // 帮你改成你的默认时间
  const [gender, setGender] = useState<Gender>("男");
  const [selectedPalace, setSelectedPalace] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const horoscope = useMemo<any>(() => {
    try {
      setErrorMsg(""); // 每次计算前清空错误
      
      // 【关键修复】把 0-23 的小时转换成 0-11 的时辰索引
      // 15点 -> (15+1)/2 = 8 (申时)
      const timeIndex = Math.floor((birthTime + 1) / 2) % 12;

      return astro.bySolar(birthDate, timeIndex, gender, true, "zh-CN");
    } catch (e: any) {
      console.error(e);
      setErrorMsg("排盘失败，请检查日期或刷新页面。");
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
            紫微斗数 <span className="text-xs font-normal text-slate-500 border border-slate-700 rounded px-1 ml-1">AI解析版</span>
          </h1>
        </div>
        <span className="text-xs text-slate-500">By Gemini</span>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* 如果有错误，显示红色提示框 */}
        {errorMsg && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-center">
                {errorMsg}
            </div>
        )}

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
                    {horoscope ? `${horoscope.solarDate} · ${horoscope.lunarDate}` : '请选择时间开始排盘'}
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
                        
                        {/* AI 解析区域 */}
                        <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                            <h3 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> 简易解盘
                            </h3>
                            {selectedPalace.majorStars.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedPalace.majorStars.map((star: any) => (
                                        starDescriptions[star.name] && (
                                            <div key={star.name} className="text-xs text-slate-300 leading-relaxed">
                                                <span className="text-purple-400 font-bold">【{star.name}】</span>
                                                {starDescriptions[star.name]}
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-400">
                                    这是“空宫”，通常代表这个宫位的不确定性较大，主要参考对宫（对面的宫位）的星星来判断。
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> 星曜列表
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