"use client";

import React, { useState, useMemo, useEffect } from "react";
import { astro } from "iztro";

// --- 图标组件 ---
const IconGrid = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>;
const IconStar = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconSmile = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;

type Gender = "男" | "女";
type TabView = "pan" | "ming" | "character";

// --- 🌟 深度解析数据库 (核心内容) ---
const starAnalysisDB: Record<string, { title: string; ming: string; character: string; pros: string[]; cons: string[] }> = {
  "紫微": {
    title: "帝王之星",
    ming: "紫微星坐命，一生多贵人助。您天生具有领袖气质，在此生的人生剧本中，往往扮演决策者或核心人物的角色。不论从事何种行业，都容易成为该领域的佼佼者。若有左辅、右弼同宫，则格局宏大；若无吉星辅佐，则可能感到孤独劳碌，要在精神上多修养。",
    character: "您的性格稳重敦厚，举止庄重，有不怒自威的气质。自尊心极强，爱面子，做任何事都追求完美。虽然外表看起来很坚强，但耳根子其实有点软，喜欢听好话。",
    pros: ["领导力强", "稳重踏实", "聪明好学", "有责任感"],
    cons: ["刚愎自用", "耳根子软", "眼高手低", "容易孤独"]
  },
  "天机": {
    title: "智多星",
    ming: "天机星坐命，主要靠智慧和技艺立身。您的一生变动较多，适合在动中求财。由于心思细腻，非常适合从事策划、设计、IT、研究等需要动脑的工作。您与家人的缘分可能比较独特，早年可能离家发展。",
    character: "您的脑子转得飞快，反应敏捷，足智多谋。心地善良，喜欢钻研宗教或哲学。但有时心思太重，容易想太多，导致精神紧张，甚至失眠。做事有时候缺乏恒心，容易见异思迁。",
    pros: ["机智灵敏", "心地善良", "善于分析", "多才多艺"],
    cons: ["思虑过重", "精神紧张", "博而不精", "缺乏定力"]
  },
  "太阳": {
    title: "奉献者",
    ming: "太阳星坐命，代表燃烧自己照亮别人。您的一生都在为他人操劳，属于劳碌命，但这种劳碌往往能换来名声和地位。如果是白天出生（寅时至未时），格局更佳，更有威严；晚上出生则较为辛苦。",
    character: "您热情博爱，光明磊落，藏不住话，喜怒哀乐都写在脸上。非常有正义感，看到不平之事喜欢出头。但有时因为太心直口快，容易在无意中得罪人。好面子，喜欢排场。",
    pros: ["热情积极", "博爱无私", "光明磊落", "有号召力"],
    cons: ["劳心劳力", "死要面子", "好管闲事", "心直口快"]
  },
  "武曲": {
    title: "财帛主",
    ming: "武曲星坐命，一生与钱财缘分极深。您刚毅果决，非常有执行力，适合经商、金融或军警职。您的人生信条是实干，不喜欢空谈。中年以后财运通常会越来越好，但要注意劳逸结合。",
    character: "您性格刚强，做事干脆利落，讲信用，重承诺。对数字和金钱非常敏感。但性格中稍微缺乏一点浪漫情调，有时让人觉得不解风情，甚至有点孤僻。",
    pros: ["刚毅果决", "执行力强", "诚实守信", "理财有道"],
    cons: ["性格孤僻", "固执己见", "不解风情", "待人严苛"]
  },
  "天同": {
    title: "福星",
    ming: "天同星坐命，主福寿双全。您的一生比较平顺，少有大风大浪。您是一颗福星，但这福气往往来自于“先苦后甜”。早年可能需要经历一些波折，才能激发出您的潜能，晚年运势极佳。",
    character: "您性格温和，平易近人，像小孩子一样有童心。乐天知命，不爱与人计较，人缘非常好。但有时因为太容易知足，会显得缺乏进取心，做事有点懒散，需要鞭策。",
    pros: ["温和善良", "乐天知命", "知足常乐", "贵人运旺"],
    cons: ["好逸恶劳", "缺乏干劲", "优柔寡断", "容易软弱"]
  },
  "廉贞": {
    title: "次桃花",
    ming: "廉贞星坐命，才华横溢，格局多变。您的一生充满色彩，既可能在大机构掌握大权，也可能在艺术领域大放异彩。廉贞是一颗复杂的星，遇吉则吉，遇凶则凶，关键看同宫的星曜组合。",
    character: "您是非分明，很有主见，甚至有点心高气傲。社交能力极强，公关手腕高超。情感丰富，很有魅力，但也容易陷入情感纠葛。性格多变，有时让人捉摸不透。",
    pros: ["才华横溢", "社交能手", "是非分明", "进取心强"],
    cons: ["心高气傲", "情绪多变", "钻牛角尖", "猜疑心重"]
  },
  "天府": {
    title: "财库",
    ming: "天府星坐命，稳重踏实，一生衣食无忧。您天生具有大将之风，善于守成和管理。不像紫微那样高高在上，您更接地气，更懂得享受生活。适合在现有体制下稳步晋升。",
    character: "您心胸宽广，包容力强，做事稳扎稳打。善于理财，对生活品质有要求。但性格略显保守，缺乏开创精神。外表随和，内心其实很有算计，城府较深。",
    pros: ["稳重踏实", "心胸宽广", "善于管理", "包容力强"],
    cons: ["保守谨慎", "缺乏冲劲", "爱惜羽毛", "城府较深"]
  },
  "太阴": {
    title: "田宅主",
    ming: "太阴星坐命，主富，尤其是不动产运势极佳。您的一生追求平稳和美，适合从事内勤、房地产、艺术或护理等工作。男命太阴由于性格温柔，更受异性欢迎。",
    character: "您性格温柔细腻，追求完美，有洁癖。重视家庭，很有艺术鉴赏力。但性格比较内向，容易多愁善感，遇到困难有时会选择逃避，缺乏决断力。",
    pros: ["温柔体贴", "心思细腻", "有艺术感", "重情重义"],
    cons: ["多愁善感", "优柔寡断", "逃避现实", "洁癖严重"]
  },
  "贪狼": {
    title: "欲望之星",
    ming: "贪狼星坐命，多才多艺，是第一大桃花星。您的一生充满了机遇和变动，适合从事公关、娱乐、演艺或投机性行业。您的欲望较强，这既是您前进的动力，也可能是烦恼的根源。",
    character: "您擅长交际应酬，八面玲珑，很有个人魅力。多才多艺，学东西很快，但往往博而不精。好奇心强，喜欢新鲜刺激的事物。野心大，不甘平庸。",
    pros: ["多才多艺", "擅长交际", "灵巧机变", "适应力强"],
    cons: ["贪得无厌", "喜新厌旧", "投机取巧", "容易浮躁"]
  },
  "巨门": {
    title: "暗星",
    ming: "巨门星坐命，主要靠嘴巴吃饭。您的一生容易招惹是非口舌，但也非常适合从事律师、讲师、销售、顾问等需要口才的职业。若能化是非为力量，往往能有大成就。",
    character: "您口才极佳，观察力敏锐，心思缜密。善于分析和研究，看问题往往能一针见血。但性格中带有多疑的成分，容易把事情往坏处想，有时显得比较消极。",
    pros: ["口才极佳", "分析力强", "心思缜密", "观察入微"],
    cons: ["多疑敏感", "口舌是非", "容易得罪人", "消极负面"]
  },
  "天相": {
    title: "印星",
    ming: "天相星坐命，主官禄，是宰相之辅。您的一生适合辅佐他人，做副手或幕僚最为出色。衣食丰足，讲究吃穿。您的人际关系通常很好，因为您总是乐于助人。",
    character: "您形象好，气质佳，举止斯文。公正无私，很有正义感，看到别人有困难会主动帮忙。但缺乏主见，容易随波逐流，耳根子软，容易被环境影响。",
    pros: ["公正无私", "形象优雅", "忠诚可靠", "乐于助人"],
    cons: ["缺乏主见", "粉饰太平", "随波逐流", "优柔寡断"]
  },
  "天梁": {
    title: "荫星",
    ming: "天梁星坐命，主寿，有逢凶化吉之能。您的一生可能会遇到一些惊险，但最终都能化险为夷。您适合从事医药、保险、社会服务或公职。您有长者风范，喜欢照顾别人。",
    character: "您成熟稳重，心地善良，慈悲为怀。做事很有原则，但也喜欢说教，有时候让人觉得老气横秋。非常正直，看不惯虚伪的事情。孤芳自赏，享受孤独。",
    pros: ["慈悲为怀", "成熟稳重", "正直无私", "逢凶化吉"],
    cons: ["好管闲事", "老气横秋", "固执己见", "孤高自赏"]
  },
  "七杀": {
    title: "将星",
    ming: "七杀星坐命，主肃杀，是孤独的将领。您的一生起伏较大，必须要经历艰辛才能成功。您适合离开家乡发展，白手起家。在乱世或竞争激烈的环境中，您最能发挥才干。",
    character: "您刚毅勇敢，非常有冲劲，不畏艰难。性格急躁，喜怒无常，不喜欢被管束。独来独往，为了目标可以不顾一切。做事干脆，但有时显得太冲动鲁莽。",
    pros: ["刚毅勇敢", "勇往直前", "不畏艰难", "有魄力"],
    cons: ["冲动鲁莽", "独断专行", "缺乏耐心", "人生起伏"]
  },
  "破军": {
    title: "耗星",
    ming: "破军星坐命，主破坏和消耗。您的一生变动极大，甚至是颠覆性的。您是天生的改革者，喜欢打破旧传统，建立新秩序。先破后立是您的人生常态。",
    character: "您非常有创意，敢于冒险，不按常理出牌。性格冲动，情绪化严重。喜新厌旧，对喜欢的东西很执着，不喜欢的理都不理。具有很强的反叛精神。",
    pros: ["创意无限", "敢于突破", "开创精神", "不畏强权"],
    cons: ["破坏力强", "反复无常", "难以驾驭", "喜新厌旧"]
  }
};

const siHuaRules: Record<string, string[]> = {
  "甲": ["廉贞", "破军", "武曲", "太阳"], "乙": ["天机", "天梁", "紫微", "太阴"],
  "丙": ["天同", "天机", "文昌", "廉贞"], "丁": ["太阴", "天同", "天机", "巨门"],
  "戊": ["贪狼", "太阴", "右弼", "天机"], "己": ["武曲", "贪狼", "天梁", "文曲"],
  "庚": ["太阳", "武曲", "太阴", "天同"], "辛": ["巨门", "太阳", "文曲", "文昌"],
  "壬": ["天梁", "紫微", "左辅", "武曲"], "癸": ["破军", "巨门", "太阴", "贪狼"],
};

export default function ZiWeiApp() {
  const [mounted, setMounted] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState(0);
  const [gender, setGender] = useState<Gender>("女");
  const [activeTab, setActiveTab] = useState<TabView>("pan");

  useEffect(() => { 
      setMounted(true);
      // 默认日期（客户端渲染时设置，避免 hydration mismatch）
      setBirthDate("1995-08-16");
      setBirthTime(14);
  }, []);

  const horoscope = useMemo<any>(() => {
    if (!mounted || !birthDate) return null;
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

  // 八字拆分
  const bazi = horoscope?.chineseDate ? horoscope.chineseDate.split(' ') : ["-", "-", "-", "-"];

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#333] font-sans pb-20 selection:bg-[#e11d48] selection:text-white">
      {/* 顶部输入栏 */}
      <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30 shadow-sm">
         <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-3 items-center justify-between">
            <h1 className="text-base font-bold text-[#e11d48]">神巴巴紫微 <span className="text-[10px] font-normal text-gray-400">V9.1</span></h1>
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
        {/* 基本信息 - 粉丝表头 */}
        {horoscope && (
        <section className="bg-white border border-[#e5e7eb] rounded-t-lg overflow-hidden text-xs shadow-sm">
            <div className="bg-[#fff1f2] px-3 py-2 border-b border-[#fecdd3] font-bold text-[#e11d48] flex items-center gap-2">
                <span>📋 基本信息</span>
            </div>
            <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-y-2 text-gray-700">
                <div><span className="text-gray-400 mr-2">公历</span>{horoscope.solarDate}</div>
                <div><span className="text-gray-400 mr-2">农历</span>{horoscope.lunarDate}</div>
                <div><span className="text-gray-400 mr-2">八字</span><span className="font-mono tracking-wide">{bazi.join(' ')}</span></div>
                <div><span className="text-gray-400 mr-2">局数</span><span className="text-[#e11d48] font-bold">{horoscope.fiveElements}</span></div>
                <div><span className="text-gray-400 mr-2">生肖</span>{horoscope.zodiac}</div>
                <div><span className="text-gray-400 mr-2">命主</span>{horoscope.soul}</div>
                <div><span className="text-gray-400 mr-2">身主</span>{horoscope.body}</div>
            </div>
        </section>
        )}

        {/* Tab 导航 */}
        <div className="bg-white border border-[#e5e7eb] flex overflow-hidden sticky top-[50px] z-20 shadow-sm">
            {[
                { id: "pan", label: "紫微排盘", icon: IconGrid },
                { id: "ming", label: "命宫分析", icon: IconStar },
                { id: "character", label: "性格分析", icon: IconSmile }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as TabView)} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${activeTab === tab.id ? "bg-[#e11d48] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                    <tab.icon/><span>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* 核心内容 */}
        <div className="bg-white border border-[#e5e7eb] border-t-0 rounded-b-lg min-h-[500px] p-2 relative">
            
            {/* 1. 排盘模式 */}
            {activeTab === "pan" && horoscope && (
                <>
                <div className="relative grid grid-cols-4 grid-rows-4 gap-0 h-[500px] border border-[#d1d5db] bg-[#fff1f2] select-none">
                    {/* 背景连线 */}
                    <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        {sanFangBranches.length === 3 && (
                            <polygon points={`${getCoord(sanFangBranches[0])}, ${getCoord(sanFangBranches[1])}, ${getCoord(sanFangBranches[2])}`} fill="rgba(225, 29, 72, 0.05)" stroke="rgba(225, 29, 72, 0.3)" strokeWidth="1" />
                        )}
                        {lifePalace && duiGongBranch && (
                            <line x1={getCoord(lifePalace.earthlyBranch)} y1={getCoord(duiGongBranch)} x2={getCoord(lifePalace.earthlyBranch).split(' ')[0]} y2={getCoord(lifePalace.earthlyBranch).split(' ')[1]} stroke="rgba(225, 29, 72, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
                        )}
                    </svg>

                    {/* 中宫详细信息 (深度复刻版) */}
                    <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-white/95 border border-[#d1d5db] flex flex-col p-2 z-20 overflow-hidden text-xs relative">
                        <div className="absolute top-2 right-2 opacity-5 pointer-events-none font-serif text-6xl">命</div>
                        
                        {/* 四柱八字 */}
                        <div className="grid grid-cols-5 gap-0.5 mb-2 text-center bg-gray-50 py-2 border border-gray-100 rounded">
                            <div className="flex flex-col justify-center text-gray-400 text-[10px] border-r border-gray-200">
                                <span>{gender === '女' ? '坤' : '乾'}</span><span>造</span>
                            </div>
                            <div><div className="text-gray-400 text-[9px]">年柱</div><div className="font-bold text-[#374151]">{bazi[0] || '-'}</div></div>
                            <div><div className="text-gray-400 text-[9px]">月柱</div><div className="font-bold text-[#374151]">{bazi[1] || '-'}</div></div>
                            <div><div className="text-gray-400 text-[9px]">日柱</div><div className="font-bold text-[#374151]">{bazi[2] || '-'}</div></div>
                            <div><div className="text-gray-400 text-[9px]">时柱</div><div className="font-bold text-[#374151]">{bazi[3] || '-'}</div></div>
                        </div>

                        {/* 命身主 */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-[#374151] px-2">
                            <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span>命宫</span><span className="font-bold">{lifePalace?.earthlyBranch}</span></div>
                            <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span>身宫</span><span className="font-bold">{horoscope.palaces.find((p:any)=>p.name==='身宫')?.earthlyBranch}</span></div>
                            <div className="flex justify-between"><span>命主</span><span className="font-bold">{horoscope.soul}</span></div>
                            <div className="flex justify-between"><span>身主</span><span className="font-bold">{horoscope.body}</span></div>
                        </div>

                        {/* 三色运势流 (V9.0 精华) */}
                        <div className="mt-auto space-y-1 pt-2 border-t border-gray-200 font-bold px-1">
                            <div className="flex items-center text-[#16a34a] bg-green-50 px-2 py-0.5 rounded">
                                <span className="w-8 font-normal text-[10px] opacity-70">大运</span>
                                <span>{lifePalace?.decadal.range[0]}-{lifePalace?.decadal.range[1]}岁</span>
                            </div>
                            <div className="flex items-center text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded">
                                <span className="w-8 font-normal text-[10px] opacity-70">流年</span>
                                <span>{horoscope.solarDate.split('-')[0]}年</span>
                            </div>
                            <div className="flex items-center text-[#d97706] bg-orange-50 px-2 py-0.5 rounded">
                                <span className="w-8 font-normal text-[10px] opacity-70">流月</span>
                                <span>农历{horoscope.lunarDate.split('年')[1]?.split('月')[0]}月</span>
                            </div>
                        </div>
                    </div>

                    {/* 十二宫位 */}
                    {horoscope.palaces.map((palace: any, index: number) => (
                        <div key={index} className={`${gridPositions[palace.earthlyBranch]} bg-white border border-[#d1d5db] relative p-0.5 flex flex-col justify-between z-20 hover:bg-gray-50`}>
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

                {/* 飞星四化表 */}
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

            {/* 2. 命宫分析 (深度解析) */}
            {activeTab === "ming" && lifePalace && (
                <div className="space-y-4 p-2 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="font-bold text-[#e11d48] text-lg mb-4 flex items-center gap-2">
                            <IconStar/> 命宫格局深度解析
                        </h3>
                        {mainStars.length > 0 ? mainStars.map((s: any) => {
                             const analysis = starAnalysisDB[s.name];
                             return (
                                 <div key={s.name} className="mb-6 last:mb-0">
                                     <div className="flex items-center gap-2 mb-2">
                                         <span className="bg-[#e11d48] text-white text-xs px-2 py-1 rounded font-bold">{s.name}</span>
                                         <span className="text-gray-500 text-sm font-bold">[{analysis?.title || "影响深远"}]</span>
                                     </div>
                                     <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-7 text-justify border-l-4 border-[#e11d48]">
                                         {analysis?.ming || "此星曜能量独特，对您的人生轨迹有深远影响。建议结合三方四正综合判断。"}
                                     </div>
                                 </div>
                             )
                        }) : (
                            <div className="bg-gray-50 p-6 rounded-lg text-center border-l-4 border-gray-400">
                                <div className="text-xl font-bold text-gray-500 mb-2">命无正曜</div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    您的命宫没有主星，这在紫微斗数中称为“命无正曜”。<br/>
                                    这意味着您的性格可塑性极强，容易受环境和他人影响。<br/>
                                    <strong>建议：</strong>请参考对宫【迁移宫】的星曜，那往往是您在外展现出的真实性格。同时，这也代表您宜出外发展，借力使力。
                                </p>
                            </div>
                        )}
                     </div>
                </div>
            )}

            {/* 3. 性格分析 (优缺点列表) */}
            {activeTab === "character" && lifePalace && (
                <div className="space-y-4 p-2 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="font-bold text-[#e11d48] text-lg mb-4 flex items-center gap-2">
                            <IconSmile/> 性格优缺一览
                        </h3>
                        
                        {mainStars.length > 0 ? mainStars.map((s: any) => {
                            const analysis = starAnalysisDB[s.name];
                            return (
                                <div key={s.name} className="mb-8 last:mb-0">
                                    <div className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2 flex justify-between">
                                        <span>{s.name}星性格特质</span>
                                        <span className="text-xs text-gray-400 font-normal">[{analysis?.title}]</span>
                                    </div>
                                    
                                    <div className="mb-4 text-sm text-gray-600 leading-relaxed">
                                        {analysis?.character}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 p-4 rounded border border-green-100">
                                            <h4 className="font-bold text-green-700 text-xs mb-2 uppercase">Positive / 优势</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                {analysis?.pros.map((p, i) => <li key={i}>{p}</li>) || <li>暂无数据</li>}
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded border border-red-100">
                                            <h4 className="font-bold text-red-700 text-xs mb-2 uppercase">Negative / 盲点</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                {analysis?.cons.map((c, i) => <li key={i}>{c}</li>) || <li>暂无数据</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>命无正曜，性格多变。</p>
                                <p className="text-sm mt-2">您的性格更多取决于后天环境的塑造。</p>
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