"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";
import { X, Star, Moon, Sparkles, BookOpen, Zap, Calendar, HelpCircle, Info, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";

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

const mutagenDescriptions: Record<string, string> = {
  "禄": "【化禄】主财源、机遇与顺遂。",
  "权": "【化权】主权力、掌控与成就。",
  "科": "【化科】主名声、贵人与平稳。",
  "忌": "【化忌】主阻碍、波折与执着。",
};

export default function ZiWeiApp() {
  const [mounted, setMounted] = useState(false);
  const [birthDate, setBirthDate] = useState("1979-05-31");
  const [birthTime, setBirthTime] = useState(15);
  const [gender, setGender] = useState<Gender>("男");
  const [targetYear, setTargetYear] = useState(2026);
  const [selectedPalace, setSelectedPalace] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const horoscope = useMemo<any>(() => {
    if (!mounted) return null;
    try {
      const timeIndex = Math.floor((birthTime + 1) / 2) % 12;
      return astro.bySolar(birthDate, timeIndex, gender, true, "zh-CN");
    } catch (e) {
      return null;
    }
  }, [birthDate, birthTime, gender, mounted]);

  const yearlyData = useMemo(() => {
    if (!horoscope || !mounted) return null;
    try {
      return horoscope.horoscope(targetYear);
    } catch (e) {
      return null;
    }
  }, [horoscope, targetYear, mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#fdfbf7]" />;

  const gridPositions: Record<string, string> = {
    "巳": "md:col-start-1 md:row-start-1", "午": "md:col-start-2 md:row-start-1",
    "未": "md:col-start-3 md:row-start-1", "申": "md:col-start-4 md:row-start-1",
    "辰": "md:col-start-1 md:row-start-2", "酉": "md:col-start-4 md:row-start-2",
    "卯": "md:col-start-1 md:row-start-3", "戌": "md:col-start-4 md:row-start-3",
    "寅": "md:col-start-1 md:row-start-4", "丑": "md:col-start-2 md:row-start-4",
    "子": "md:col-start-3 md:row-start-4", "亥": "md:col-start-4 md:row-start-4",
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#4a4238] font-sans selection:bg-amber-200">
      <header className="fixed top-0 w-full z-10 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e5e0d8] px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#8b5e3c] rounded-full flex items-center justify-center text-[#fdfbf7]">
            <Moon className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#5c4033] tracking-widest">
            紫微斗数 <span className="text-xs font-normal text-[#8b5e3c] border border-[#8b5e3c] rounded px-1 ml-1">大师版</span>
          </h1>
        </div>
        <button onClick={() => setShowHelp(true)} className="flex items-center gap-1 text-xs text-[#8b5e3c] hover:bg-[#f3efe9] px-2 py-1 rounded">
          <HelpCircle className="w-4 h-4" /> <span>说明</span>
        </button>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <section className="mb-8 bg-[#fffefc] p-6 rounded-2xl border border-[#e6e2dc] shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#9ca3af] uppercase">公历出生日期</label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-[#f9f7f5] border border-[#e5e0d8] rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#9ca3af] uppercase">出生时辰</label>
                <select value={birthTime} onChange={e => setBirthTime(Number(e.target.value))} className="bg-[#f9f7f5] border border-[#e5e0d8] rounded-lg px-3 py-2 text-sm">
                    {Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{i}:00 ({getTimeZhi(i)}时)</option>)}
                </select>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#9ca3af] uppercase">流年年份</label>
                <input type="number" value={targetYear} onChange={e => setTargetYear(Number(e.target.value))} className="bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2 text-sm font-bold text-[#b45309]" />
            </div>
            <div className="flex items-end">
                <div className="w-full bg-[#8b5e3c] text-white text-center py-2 rounded-lg text-sm shadow-md uppercase tracking-tighter">
                    分析 {targetYear} 年运势
                </div>
            </div>
        </section>

        {horoscope && (
          <div className="relative w-full max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-2 h-auto md:h-[720px]">
              <div className="hidden md:flex col-start-2 col-end-4 row-start-2 row-end-4 bg-[#fdfbf7] border-2 border-[#e6e2dc] rounded-2xl flex-col items-center justify-center text-center p-6">
                  <Sparkles className="w-8 h-8 text-[#b45309] mb-2" />
                  <div className="text-2xl font-serif font-bold text-[#5c4033]">{targetYear} 年运势</div>
                  <div className="text-xs text-[#6b5d52] mt-4 space-y-1">
                      <p>点击外圈宫位查看详情</p>
                      <p className="font-bold text-[#b91c1c]">高亮宫位为流年命宫</p>
                  </div>
              </div>

              {horoscope.palaces.map((palace: any, index: number) => {
                 const isYearlyPalace = yearlyData?.yearly?.palaceName === palace.name;
                 return (
                  <motion.div
                    key={index}
                    onClick={() => setSelectedPalace(palace)}
                    className={`relative cursor-pointer bg-white border rounded-xl p-3 flex flex-col justify-between transition-all
                        ${isYearlyPalace ? 'ring-4 ring-[#b45309]/30 border-[#b45309] shadow-lg scale-105 z-10' : 'border-[#e6e2dc]'}
                    `}
                  >
                    <div className="flex justify-between items-start border-b border-[#f3efe9] pb-1">
                        <div className="flex items-center gap-1">
                            <span className={`text-xs font-bold ${isYearlyPalace ? 'text-[#b45309]' : 'text-[#5c4033]'}`}>{palace.name}</span>
                        </div>
                        <span className="text-[10px] text-[#9ca3af]">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                    </div>
                    <div className="flex-1 py-2 flex flex-wrap gap-1">
                        {palace.majorStars.map((s: any) => (
                            <span key={s.name} className={`text-xs font-bold ${['庙','旺'].includes(s.brightness) ? 'text-[#b91c1c]' : ''}`}>
                                {s.name}
                            </span>
                        ))}
                    </div>
                    <div className="text-[10px] flex justify-between text-[#8b5e3c]">
                        <span>{palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPalace(null)}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-[#5c4033]">{selectedPalace.name}</h2>
                        <button onClick={() => setSelectedPalace(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#fff7ed] p-3 rounded-lg border border-[#ffedd5]">
                            <h3 className="text-xs font-bold text-[#9a3412] mb-1 flex items-center gap-1">
                                <RefreshCcw className="w-3 h-3" /> 流年/大限提示
                            </h3>
                            <p className="text-xs text-[#7c2d12] leading-relaxed">
                                此宫位在 {targetYear} 年及大限期间对您的运势有显著影响。
                            </p>
                        </div>
                        <div className="bg-[#fdf2f8] p-3 rounded-lg border border-[#fbcfe8]">
                             <h3 className="text-xs font-bold text-[#be185d] mb-1">本宫定义</h3>
                             <p className="text-xs text-slate-600">{palaceDefinitions[selectedPalace.name]}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowHelp(false)}>
                <div className="bg-white p-6 rounded-2xl max-w-lg shadow-2xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Info /> 功能说明</h2>
                    <div className="text-sm space-y-3 text-slate-600 leading-relaxed">
                        <p>紫微斗数分析系统已上线。您可以自由切换日期和年份进行排盘。</p>
                        <p>1. **大限**：每个格子下方的数字代表该十年运势的年龄段。</p>
                        <p>2. **流年**：输入流年年份，系统会自动标记出那一年的“运气中心”。</p>
                    </div>
                    <button onClick={() => setShowHelp(false)} className="mt-6 w-full bg-[#8b5e3c] text-white py-2 rounded-lg">我知道了</button>
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