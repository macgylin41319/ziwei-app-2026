"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";
import { Grid, Star, Smile, User, Sun } from "lucide-react";

type Gender = "男" | "女";
type TabView = "pan" | "ming" | "character";

// --- 静态数据库 ---
const characterAnalysis: Record<string, any> = {
  "紫微": { title: "领袖型", desc: "紫微星坐命的人，天生具有领袖气质。你稳重、有威严，喜欢主导局面。你的自尊心很强，有时会显得有些高傲，但内心其实很渴望被认可。在团队中，你往往是那个做最后决定的人。", pros: "稳重、有领导力、有责任感、聪明好学。", cons: "刚愎自用、耳根子软、爱面子、独断专行。" },
  "天机": { title: "智多星", desc: "天机星坐命的人，脑子转得特别快。你机智多谋，善于分析和策划。你的心思很细腻，但也容易想太多，导致精神紧张。你适合从事需要动脑筋的工作。", pros: "反应敏捷、足智多谋、善于分析、心地善良。", cons: "思虑过重、精神紧张、多愁善感、缺乏定力。" },
  "太阳": { title: "奉献型", desc: "太阳星坐命的人，像太阳一样热情博爱。你喜欢照顾别人，做事积极主动，很有正义感。你坦率直接，藏不住话，但也容易因为太心直口快而得罪人。", pros: "热情积极、博爱无私、坦率直接、有正义感。", cons: "劳心劳力、好面子、容易招惹是非、心直口快。" },
  "武曲": { title: "实干家", desc: "武曲星坐命的人，刚毅果决，非常有执行力。你对金钱和数字很敏感，理财能力强。你性格比较直爽，不喜欢拐弯抹角，但有时会让人觉得不够温柔。", pros: "刚毅果决、执行力强、对金钱敏感、讲信用。", cons: "性格孤僻、不解风情、固执己见、缺乏圆滑。" },
  "天同": { title: "乐天派", desc: "天同星坐命的人，是天生的福星。你性格温和，乐天知命，不喜欢与人争执。你很有童心，喜欢享受生活，但也因为太容易知足，有时会显得缺乏进取心。", pros: "温和善良、乐天知命、人缘好、不爱计较。", cons: "好逸恶劳、缺乏干劲、容易软弱、优柔寡断。" },
  "廉贞": { title: "公关高手", desc: "廉贞星坐命的人，才华横溢，擅长交际。你是非分明，很有主见，但也容易钻牛角尖。你的情感丰富，很有魅力，但也容易情绪化。", pros: "公关能力强、才华横溢、是非分明、有进取心。", cons: "心高气傲、情绪多变、钻牛角尖、猜疑心重。" },
  "天府": { title: "大掌柜", desc: "天府星坐命的人，稳重踏实，很有包容力。你善于理财和管理，做事通过稳扎稳打。你比较爱面子，生活讲究品味和享受。", pros: "稳重踏实、心胸宽广、善于理财、有领导力。", cons: "保守谨慎、爱面子、缺乏冲劲、城府较深。" },
  "太阴": { title: "完美主义", desc: "太阴星坐命的人，温柔细腻，追求完美。你重视家庭，爱干净，很有艺术天分。你的性格比较内向，容易多愁善感。", pros: "温柔细腻、追求完美、重视家庭、有艺术感。", cons: "多愁善感、洁癖、逃避现实、优柔寡断。" },
  "贪狼": { title: "多才多艺", desc: "贪狼星坐命的人，多才多艺，擅长交际应酬。你的欲望比较强，野心大，喜欢新鲜刺激的事物。你的桃花运通常不错，很有个人魅力。", pros: "多才多艺、擅长交际、灵巧机变、有野心。", cons: "贪得无厌、喜新厌旧、投机取巧、桃花泛滥。" },
  "巨门": { title: "名嘴", desc: "巨门星坐命的人，口才极佳，观察力敏锐。你心思缜密，善于分析和研究。但你也容易因为嘴巴太厉害而得罪人，或者变得多疑。", pros: "口才极佳、分析力强、心思缜密、观察力敏锐。", cons: "多疑、容易得罪人、口舌是非、消极负面。" },
  "天相": { title: "辅助者", desc: "天相星坐命的人，形象好，气质佳。你公正无私，很有正义感，喜欢帮助别人。你适合做辅助性的工作，但有时会显得缺乏主见。", pros: "公正无私、形象好、忠诚可靠、乐于助人。", cons: "缺乏主见、粉饰太平、容易随波逐流、耳根软。" },
  "天梁": { title: "大哥哥/大姐姐", desc: "天梁星坐命的人，慈悲为怀，喜欢照顾别人。你成熟稳重，很有原则，也喜欢说教。你是一颗荫星，遇到困难容易逢凶化吉。", pros: "慈悲为怀、成熟稳重、逢凶化吉、正直无私。", cons: "好管闲事、老气横秋、固执己见、孤高自赏。" },
  "七杀": { title: "孤胆英雄", desc: "七杀星坐命的人，刚毅勇敢，非常有冲劲。你不喜欢被管束，喜欢独来独往，为了目标可以不顾一切。你的人生往往起伏比较大。", pros: "刚毅勇敢、勇往直前、不畏艰难、有魄力。", cons: "冲动鲁莽、独断专行、人生起伏大、缺乏耐心。" },
  "破军": { title: "先锋", desc: "破军星坐命的人，破坏力强，喜欢推翻重来。你很有创意，敢于突破传统，不按常理出牌。你的性格比较冲动，但也很有开创精神。", pros: "创意无限、敢于突破、有开创精神、不畏强权。", cons: "破坏力强、喜新厌旧、反复无常、难以驾驭。" },
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

  const lifePalace = useMemo(() => {
    if (!horoscope) return null;
    return horoscope.palaces.find((p: any) => p.name === "命宫");
  }, [horoscope]);

  const mainStars = useMemo(() => {
    if (!lifePalace) return [];
    return lifePalace.majorStars;
  }, [lifePalace]);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  const gridPositions: Record<string, string> = {
    "巳": "col-start-1 row-start-1", "午": "col-start-2 row-start-1",
    "未": "col-start-3 row-start-1", "申": "col-start-4 row-start-1",
    "辰": "col-start-1 row-start-2", "酉": "col-start-4 row-start-2",
    "卯": "col-start-1 row-start-3", "戌": "col-start-4 row-start-3",
    "寅": "col-start-1 row-start-4", "丑": "col-start-2 row-start-4",
    "子": "col-start-3 row-start-4", "亥": "col-start-4 row-start-4",
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#333] font-sans pb-24">
      {/* 顶部 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
         <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center justify-center md:justify-between">
            <h1 className="text-lg font-bold text-[#d93025] flex items-center gap-1">
                <Sun className="w-5 h-5"/> 神巴巴紫微
            </h1>
            <div className="flex flex-wrap gap-2 text-xs">
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="bg-slate-100 border border-slate-300 rounded px-2 py-1 outline-none" />
                <select value={birthTime} onChange={e => setBirthTime(Number(e.target.value))} className="bg-slate-100 border border-slate-300 rounded px-2 py-1 outline-none">
                     {Array.from({length: 24}).map((_, i) => <option key={i} value={i}>{i}:00 ({getTimeZhi(i)})</option>)}
                </select>
                <div className="flex bg-slate-100 rounded border border-slate-300 overflow-hidden">
                     {(['男', '女'] as Gender[]).map(g => (
                        <button key={g} onClick={() => setGender(g)} className={`px-3 py-1 transition-colors ${gender === g ? 'bg-[#d93025] text-white' : 'text-slate-600'}`}>{g}</button>
                    ))}
                </div>
            </div>
         </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 基本信息 */}
        {horoscope && (
        <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#fdf0ef] px-4 py-2 border-b border-[#fce4e2] flex items-center gap-2">
                <User className="w-4 h-4 text-[#d93025]" />
                <h2 className="font-bold text-[#d93025] text-sm">基本信息</h2>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-sm">
                <div><span className="text-slate-400 text-xs block">公历</span><span className="font-medium">{horoscope.solarDate}</span></div>
                <div><span className="text-slate-400 text-xs block">农历</span><span className="font-medium">{horoscope.lunarDate}</span></div>
                <div><span className="text-slate-400 text-xs block">八字</span><span className="font-medium tracking-widest">{horoscope.chineseDate?.split(' ').join(' ')}</span></div>
                <div><span className="text-slate-400 text-xs block">生肖</span><span className="font-medium">{horoscope.zodiac}</span></div>
                <div><span className="text-slate-400 text-xs block">五行局</span><span className="font-medium text-[#d93025]">{horoscope.fiveElements}</span></div>
                <div><span className="text-slate-400 text-xs block">命主</span><span className="font-medium">{horoscope.soul}</span></div>
                <div><span className="text-slate-400 text-xs block">身主</span><span className="font-medium">{horoscope.body}</span></div>
            </div>
        </section>
        )}

        {/* 内容区 */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[500px]">
            <div className="flex border-b border-slate-200">
                <button onClick={() => setActiveTab("pan")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === "pan" ? "text-[#d93025] border-b-2 border-[#d93025] bg-[#fffbfb]" : "text-slate-500 hover:bg-slate-50"}`}>
                    <Grid className="w-4 h-4"/> 紫微排盘
                </button>
                <button onClick={() => setActiveTab("ming")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === "ming" ? "text-[#d93025] border-b-2 border-[#d93025] bg-[#fffbfb]" : "text-slate-500 hover:bg-slate-50"}`}>
                    <Star className="w-4 h-4"/> 命宫分析
                </button>
                <button onClick={() => setActiveTab("character")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === "character" ? "text-[#d93025] border-b-2 border-[#d93025] bg-[#fffbfb]" : "text-slate-500 hover:bg-slate-50"}`}>
                    <Smile className="w-4 h-4"/> 性格分析
                </button>
            </div>

            <div className="p-4">
                {activeTab === "pan" && horoscope && (
                    <div className="grid grid-cols-4 grid-rows-4 gap-1 md:gap-2 h-[400px] md:h-[600px] bg-[#f8f9fa] border border-slate-200 p-1">
                        <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-white border border-slate-200 flex flex-col items-center justify-center text-center p-4">
                            <div className="text-2xl font-serif font-bold text-[#d93025] mb-2">紫微命盘</div>
                            <div className="text-xs text-slate-400">Shen88 在线排盘系统</div>
                        </div>
                        {horoscope.palaces.map((palace: any, index: number) => (
                            <div key={index} className={`${gridPositions[palace.earthlyBranch]} bg-white border border-slate-200 relative p-1 md:p-2 flex flex-col justify-between hover:shadow-md transition-shadow`}>
                                <div className="flex justify-between items-start border-b border-slate-100 pb-1">
                                    <span className={`text-xs md:text-sm font-bold ${palace.name === '命宫' ? 'text-white bg-[#d93025] px-1 rounded' : 'text-[#d93025]'}`}>{palace.name}</span>
                                    <span className="text-[10px] text-slate-400 scale-90 origin-right">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                                </div>
                                <div className="flex-1 flex flex-wrap content-start gap-0.5 mt-1">
                                    {palace.majorStars.map((s: any) => (
                                        <span key={s.name} className={`text-[10px] md:text-xs font-bold ${['庙','旺'].includes(s.brightness) ? 'text-[#d93025]' : 'text-slate-700'}`}>
                                            {s.name}{s.mutagen && <span className="text-[8px] bg-red-100 text-red-600 rounded px-0.5 ml-0.5">{s.mutagen}</span>}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-end border-t border-slate-100 pt-1">
                                    <span className="text-[9px] text-slate-400">{palace.changsheng12}</span>
                                    <span className="text-[9px] font-bold text-slate-600">{palace.decadal.range[0]}-{palace.decadal.range[1]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "ming" && lifePalace && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#d93025] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">命</div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">命宫主星：{mainStars.length > 0 ? mainStars.map((s:any) => s.name).join("、") : "命无正曜"}</h3>
                                <p className="text-sm text-slate-500">命宫显示了您先天的命运格局与核心特质。</p>
                            </div>
                        </div>
                        {mainStars.length > 0 ? (
                            mainStars.map((star: any) => (
                                <div key={star.name} className="bg-slate-50 p-4 rounded-lg border-l-4 border-[#d93025]">
                                    <h4 className="font-bold text-[#d93025] mb-2">【{star.name}】坐守命宫</h4>
                                    <p className="text-sm text-slate-700 leading-relaxed">{characterAnalysis[star.name]?.desc || "此星曜拥有独特的能量。"}</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center py-10">
                                <p className="text-slate-600 text-sm">您的命宫没有主星（命无正曜）。</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "character" && lifePalace && (
                    <div className="space-y-6">
                         <div className="text-center mb-6">
                             <h3 className="text-lg font-bold text-slate-800">您的性格关键词</h3>
                             <div className="flex justify-center gap-2 mt-3">
                                 {mainStars.length > 0 ? (
                                     mainStars.map((s: any) => (
                                         <span key={s.name} className="px-3 py-1 bg-[#d93025] text-white text-xs rounded-full shadow-sm">{characterAnalysis[s.name]?.title || s.name}</span>
                                     ))
                                 ) : <span className="px-3 py-1 bg-slate-400 text-white text-xs rounded-full">善变多谋</span>}
                             </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                 <h4 className="font-bold text-slate-700 mb-3">正面特质</h4>
                                 <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                                     {mainStars.length > 0 ? mainStars.map((s:any) => <li key={s.name}>{characterAnalysis[s.name]?.pros}</li>) : <li>善于适应环境，学习能力强。</li>}
                                 </ul>
                             </div>
                             <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                 <h4 className="font-bold text-slate-700 mb-3">潜在弱点</h4>
                                 <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                                     {mainStars.length > 0 ? mainStars.map((s:any) => <li key={s.name}>{characterAnalysis[s.name]?.cons}</li>) : <li>缺乏主见，容易随波逐流。</li>}
                                 </ul>
                             </div>
                         </div>
                    </div>
                )}
            </div>
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