"use client";

import React, { useState, useMemo } from "react";
import { astro } from "iztro";
import { X, Star, Moon, Sparkles, BookOpen, Zap, Calendar, HelpCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";

// --- 静态数据库 ---
const palaceDefinitions: Record<string, string> = {
  "命宫": "【核心】代表你的个性、天赋、外貌和一生的总运势。是整个命盘的控制中心。",
  "兄弟": "【人际】代表兄弟姐妹、亲密朋友、合作伙伴的关系，也可看现金流的周转。",
  "夫妻": "【感情】代表配偶的个性、相貌，以及你们的相处模式和恋爱运势。",
  "子女": "【后代】代表子女的性格、数量、缘分，也代表你的才华表现和桃花运。",
  "财帛": "【财富】代表你的理财能力、赚钱模式、正财运以及对金钱的态度。",
  "疾厄": "【健康】代表你的身体体质、易患疾病，也代表潜意识和深层心态。",
  "迁移": "【外出】代表你外出发展的运势、给人的第一印象，以及在外的人际关系。",
  "交友": "【社交】代表普通朋友、同事、下属的支持度，以及你的社交圈层。",
  "官禄": "【事业】代表你的工作能力、适合的职业类型、职位高低和创业运势。",
  "田宅": "【资产】代表不动产、居住环境、家庭氛围，也是你的“财库”所在。",
  "福德": "【精神】代表你的精神享受、兴趣爱好、抗压能力和晚年的福气。",
  "父母": "【长辈】代表父母缘分、长辈提携运，也代表相貌遗传和文书运。",
};

const starDescriptions: Record<string, string> = {
  "紫微": "【帝王星】尊贵、有领导力。优点：稳重有威严；缺点：容易刚愎自用。",
  "天机": "【智慧星】机智、多变。优点：反应快、足智多谋；缺点：想太多、精神紧张。",
  "太阳": "【官禄主】博爱、热情。优点：积极乐观；缺点：劳心劳力，易招是非。",
  "武曲": "【财帛主】刚毅、果决。优点：对金钱敏感；缺点：性格孤僻、不解风情。",
  "天同": "【福星】温顺、乐天。优点：不爱计较；缺点：容易懒散。",
  "廉贞": "【次桃花】公关、才华。优点：社交强；缺点：情绪多变。",
  "天府": "【库星】稳重、包容。优点：大将之风；缺点：保守爱面子。",
  "太阴": "【田宅主】温柔、细腻。优点：心思细密；缺点：多愁善感。",
  "贪狼": "【欲望星】多才、交际。优点：擅长应酬；缺点：贪得无厌。",
  "巨门": "【口舌星】口才、深思。优点：分析力强；缺点：容易得罪人。",
  "天相": "【印星】公正、辅助。优点：忠诚可靠；缺点：缺乏主见。",
  "天梁": "【荫星】慈悲、照顾。优点：逢凶化吉；缺点：好管闲事。",
  "七杀": "【将星】肃杀、冲劲。优点：勇往直前；缺点：冲动鲁莽。",
  "破军": "【耗星】破坏、创新。优点：创意无限；缺点：喜新厌旧。",
};

const mutagenDescriptions: Record<string, string> = {
  "禄": "【化禄】财源滚滚，机会增多。",
  "权": "【化权】掌权升职，控制欲强。",
  "科": "【化科】名声在外，考运亨通。",
  "忌": "【化忌】阻碍亏欠，多费心神。",
};

export default function ZiWeiApp() {
  const [birthDate, setBirthDate] = useState("1979-05-31");
  const [birthTime, setBirthTime] = useState(15);
  const [gender, setGender] = useState<Gender>("男");
  const [selectedPalace, setSelectedPalace] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false); // 控制说明书弹窗
  const [errorMsg, setErrorMsg] = useState("");

  const horoscope = useMemo<any>(() => {
    try {
      setErrorMsg("");
      const timeIndex = Math.floor((birthTime + 1) / 2) % 12;
      return astro.bySolar(birthDate, timeIndex, gender, true, "zh-CN");
    } catch (e: any) {
      console.error(e);
      setErrorMsg("排盘失败，请检查日期。");
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
    <div className="min-h-screen bg-[#fdfbf7] text-[#4a4238] font-sans selection:bg-amber-200">
      
      {/* 顶栏：增加了“说明”按钮 */}
      <header className="fixed top-0 w-full z-10 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e5e0d8] px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#8b5e3c] rounded-full flex items-center justify-center text-[#fdfbf7]">
            <Moon className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#5c4033] tracking-widest">
            紫微斗数 <span className="text-xs font-normal text-[#8b5e3c] border border-[#8b5e3c] rounded px-1 ml-1">AI大师版</span>
          </h1>
        </div>
        <button 
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1 text-xs text-[#8b5e3c] hover:bg-[#f3efe9] px-2 py-1 rounded transition-colors"
        >
            <HelpCircle className="w-4 h-4" />
            <span>说明书</span>
        </button>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center text-sm">
                {errorMsg}
            </div>
        )}

        {/* 出生信息输入卡片 */}
        <section className="mb-8 bg-[#fffefc] p-6 rounded-2xl border border-[#e6e2dc] shadow-[0_4px_20px_-4px_rgba(139,94,60,0.1)]">
            <div className="flex items-center gap-2 mb-4 border-b border-[#f0ebe5] pb-2">
                <Calendar className="w-5 h-5 text-[#8b5e3c]" />
                <h2 className="text-lg font-bold text-[#5c4033]">出生信息</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">公历日期</label>
                    <input 
                        type="date" 
                        value={birthDate} 
                        onChange={e => setBirthDate(e.target.value)}
                        className="bg-[#f9f7f5] border border-[#e5e0d8] rounded-lg px-4 py-2.5 text-sm text-[#4a4238] focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/30 transition-all font-medium"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">出生时辰</label>
                    <select 
                        value={birthTime} 
                        onChange={e => setBirthTime(Number(e.target.value))}
                        className="bg-[#f9f7f5] border border-[#e5e0d8] rounded-lg px-4 py-2.5 text-sm text-[#4a4238] focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]/30 appearance-none font-medium"
                    >
                        {Array.from({length: 24}).map((_, i) => (
                            <option key={i} value={i}>{i}:00 - {i}:59 ({getTimeZhi(i)})</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">性别</label>
                    <div className="flex bg-[#f9f7f5] rounded-lg p-1 border border-[#e5e0d8] h-[42px]">
                        {(['男', '女'] as Gender[]).map(g => (
                            <button 
                                key={g}
                                onClick={() => setGender(g)}
                                className={`flex-1 rounded-md text-sm font-medium transition-all ${gender === g ? 'bg-[#8b5e3c] text-white shadow-md' : 'text-[#8b5e3c] hover:bg-[#eaddd3]'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {horoscope && (
          <div className="relative w-full aspect-auto md:aspect-square max-w-[900px] mx-auto">
            {/* 四柱八字展示区 */}
            <div className="mb-8 hidden md:grid grid-cols-4 gap-4 text-center">
                 <div className="bg-[#fffefc] p-4 rounded-xl border border-[#e6e2dc] shadow-sm flex flex-col items-center">
                    <span className="text-xs text-[#9ca3af] mb-1">年柱</span>
                    <span className="text-xl font-serif font-bold text-[#5c4033]">{horoscope.chineseDate.split(' ')[0] || '年'}</span>
                 </div>
                 <div className="bg-[#fffefc] p-4 rounded-xl border border-[#e6e2dc] shadow-sm flex flex-col items-center">
                    <span className="text-xs text-[#9ca3af] mb-1">月柱</span>
                    <span className="text-xl font-serif font-bold text-[#5c4033]">{horoscope.chineseDate.split(' ')[1] || '月'}</span>
                 </div>
                 <div className="bg-[#fffefc] p-4 rounded-xl border border-[#e6e2dc] shadow-sm flex flex-col items-center">
                    <span className="text-xs text-[#9ca3af] mb-1">日柱</span>
                    <span className="text-xl font-serif font-bold text-[#5c4033]">{horoscope.chineseDate.split(' ')[2] || '日'}</span>
                 </div>
                 <div className="bg-[#fffefc] p-4 rounded-xl border border-[#e6e2dc] shadow-sm flex flex-col items-center">
                    <span className="text-xs text-[#9ca3af] mb-1">时柱</span>
                    <span className="text-xl font-serif font-bold text-[#5c4033]">{horoscope.chineseDate.split(' ')[3] || '时'}</span>
                 </div>
            </div>

            {/* 紫微排盘 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-3 md:gap-2 h-auto md:h-[700px]">
              {/* 中宫信息 */}
              <div className="hidden md:flex col-start-2 col-end-4 row-start-2 row-end-4 bg-[#fdfbf7] border-2 border-[#e6e2dc] rounded-2xl flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
                  <div className="text-3xl font-serif font-bold text-[#5c4033] mb-2">{horoscope.solarDate}</div>
                  <div className="text-[#8b5e3c] text-sm mb-6 font-medium tracking-widest bg-[#f3efe9] px-3 py-1 rounded-full">{horoscope.lunarDate}</div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-[#6b5d52] w-full max-w-[240px]">
                      <div className="bg-white border border-[#e6e2dc] py-1.5 rounded shadow-sm">局：{horoscope.fiveElements}</div>
                      <div className="bg-white border border-[#e6e2dc] py-1.5 rounded shadow-sm">命主：{horoscope.soul}</div>
                      <div className="bg-white border border-[#e6e2dc] py-1.5 rounded shadow-sm">身主：{horoscope.body}</div>
                      <div className="bg-white border border-[#e6e2dc] py-1.5 rounded shadow-sm">生肖：{horoscope.zodiac}</div>
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
                        relative cursor-pointer transition-all group
                        bg-white hover:bg-[#fffdfa] hover:shadow-md
                        border rounded-xl p-3 flex flex-col justify-between min-h-[140px] md:min-h-0
                        ${isLifePalace ? 'border-[#8b5e3c] border-2 shadow-[0_0_15px_-5px_rgba(139,94,60,0.3)]' : 'border-[#e6e2dc]'}
                    `}
                  >
                    <div className="flex justify-between items-start border-b border-[#f3efe9] pb-2 mb-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold tracking-widest ${isLifePalace ? 'text-[#b91c1c] bg-[#fee2e2] px-1 rounded' : 'text-[#5c4033]'}`}>
                                {palace.name}
                            </span>
                            {isBodyPalace && <span className="text-[10px] bg-[#e0e7ff] text-[#3730a3] px-1 rounded">身</span>}
                        </div>
                        <span className="text-[10px] text-[#9ca3af] font-serif">{palace.heavenlyStem}{palace.earthlyBranch}</span>
                    </div>

                    <div className="flex-1 content-start flex flex-wrap gap-x-2 gap-y-1">
                        {palace.majorStars.map((star: any) => (
                            <span key={star.name} className={`text-sm font-bold ${['庙','旺'].includes(star.brightness) ? 'text-[#b91c1c]' : 'text-[#4a4238]'}`}>
                                {star.name}<sup className="text-[8px] ml-[1px] opacity-60 font-normal scale-75 inline-block text-[#9ca3af]">{star.brightness}</sup>
                                {star.mutagen && (
                                    <span className={`
                                        ml-1 text-[9px] px-[3px] rounded-sm text-white
                                        ${star.mutagen === '禄' && 'bg-[#15803d]'}
                                        ${star.mutagen === '权' && 'bg-[#b45309]'}
                                        ${star.mutagen === '科' && 'bg-[#1d4ed8]'}
                                        ${star.mutagen === '忌' && 'bg-[#b91c1c]'}
                                    `}>{star.mutagen}</span>
                                )}
                            </span>
                        ))}
                        {palace.minorStars.map((star: any) => (
                            <span key={star.name} className="text-xs text-[#6b7280] scale-95 origin-left">{star.name}</span>
                        ))}
                    </div>

                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-[#f3efe9]">
                        <div className="flex flex-col text-[9px] text-[#9ca3af]">
                           <span>{palace.changsheng12} · {palace.boshi12}</span>
                        </div>
                        <div className="text-right">
                            {/* 大限展示区：这里显示 10 年大运的范围 */}
                            <div className="text-xs font-mono text-[#8b5e3c] font-bold bg-[#f3efe9] px-1 rounded">
                                大限: {palace.decadal.range[0]} - {palace.decadal.range[1]}
                            </div>
                        </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 说明书弹窗 (新增) */}
      <AnimatePresence>
        {showHelp && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#4a4238]/60 backdrop-blur-sm"
                onClick={() => setShowHelp(false)}
            >
                <motion.div 
                    initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                    className="bg-[#fffefc] w-full max-w-lg rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4 border-b border-[#f3efe9] pb-4">
                            <h2 className="text-xl font-bold text-[#5c4033] flex items-center gap-2">
                                <Info className="w-5 h-5 text-[#8b5e3c]" /> 紫微斗数说明
                            </h2>
                            <button onClick={() => setShowHelp(false)}><X className="w-5 h-5 text-[#9ca3af]" /></button>
                        </div>
                        <div className="space-y-4 text-sm text-[#4a4238] leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                            <p className="font-bold text-[#8b5e3c]">【紫微斗数简介】</p>
                            <p>紫微斗数是一种起源于中国的传统命理学...透过分析个人出生的时间和地点，推算出「命盘」。</p>
                            
                            <div className="bg-[#f9f7f5] p-3 rounded-lg border border-[#e5e0d8]">
                                <p className="font-bold text-[#5c4033] mb-1">宫位说明：</p>
                                <p>命盘包含十二个「宫位」，代表人生的不同方面（如命宫、财帛宫等）。<br/>👉 您可直接点选宫位查询解说。</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#f0fdf4] p-3 rounded-lg border border-[#dcfce7]">
                                    <p className="font-bold text-[#166534] mb-1">大限 (大运)</p>
                                    <p className="text-xs text-[#14532d]">人生每十年的运势。命盘中每个格子右下角的数字（如 2-11）即代表该大限的年龄段。</p>
                                </div>
                                <div className="bg-[#fff7ed] p-3 rounded-lg border border-[#ffedd5]">
                                    <p className="font-bold text-[#9a3412] mb-1">小限与流年</p>
                                    <p className="text-xs text-[#7c2d12]">流年看外部环境，小限看内在运气。目前版本主要展示本命盘结构。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 宫位详情弹窗 */}
      <AnimatePresence>
        {selectedPalace && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4a4238]/60 backdrop-blur-sm"
                onClick={() => setSelectedPalace(null)}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1 }} y={{ scale: 0 }}
                    className="bg-[#fffefc] w-full max-w-md rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-[#f3efe9] pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[#5c4033] flex items-center gap-2">
                                    {selectedPalace.name} 
                                    <span className="text-sm font-normal text-[#8b5e3c] bg-[#f3efe9] px-2 py-0.5 rounded-full font-serif">
                                        {selectedPalace.heavenlyStem}{selectedPalace.earthlyBranch}宫
                                    </span>
                                </h2>
                            </div>
                            <button onClick={() => setSelectedPalace(null)} className="p-2 hover:bg-[#f3efe9] rounded-full transition-colors">
                                <X className="w-5 h-5 text-[#9ca3af]" />
                            </button>
                        </div>
                        
                        {/* 大限提示 (新增) */}
                        <div className="mb-4 p-3 bg-[#f0fdf4] border border-[#dcfce7] rounded-lg flex items-start gap-2">
                             <Calendar className="w-4 h-4 text-[#166534] mt-0.5" />
                             <div>
                                 <h3 className="text-xs font-bold text-[#166534] mb-1">大限（{selectedPalace.decadal.range[0]} - {selectedPalace.decadal.range[1]} 岁）</h3>
                                 <p className="text-xs text-[#14532d] leading-relaxed">
                                     这是您 {selectedPalace.decadal.range[0]} 岁到 {selectedPalace.decadal.range[1]} 岁期间的行运宫位。在这十年间，您的运势重心会受到【{selectedPalace.name}】以及宫内星曜的影响。
                                 </p>
                             </div>
                        </div>

                        {/* 宫位定义 */}
                        <div className="mb-4 p-3 bg-[#eff6ff] border border-[#dbeafe] rounded-lg">
                             <h3 className="text-xs font-bold text-[#1e40af] mb-1 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> 宫位定义
                            </h3>
                            <p className="text-xs text-[#374151] leading-relaxed">
                                {palaceDefinitions[selectedPalace.name] || "暂无解释"}
                            </p>
                        </div>

                        {/* 命理分析 */}
                        <div className="mb-6 p-4 bg-[#fdf2f8] border border-[#fbcfe8] rounded-xl">
                            <h3 className="text-sm font-bold text-[#be185d] mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> 命理分析
                            </h3>
                            {selectedPalace.majorStars.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedPalace.majorStars.map((star: any) => (
                                        <div key={star.name}>
                                            {starDescriptions[star.name] && (
                                                <div className="text-xs text-[#374151] leading-relaxed mb-1">
                                                    <span className="text-[#be185d] font-bold">【{star.name}】</span>
                                                    {starDescriptions[star.name]}
                                                </div>
                                            )}
                                            {star.mutagen && mutagenDescriptions[star.mutagen] && (
                                                <div className="text-xs text-[#92400e] bg-[#fffbeb] p-2 rounded border border-[#fde68a] mt-1 flex gap-2">
                                                    <Zap className="w-3 h-3 mt-0.5 shrink-0" />
                                                    <span>
                                                        <span className="font-bold">附加能量：</span>
                                                        {mutagenDescriptions[star.mutagen]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-[#6b7280]">
                                    此为【空宫】，请参考对面的宫位。
                                </div>
                            )}
                        </div>

                        {/* 星曜列表 (保持不变) */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> 主星坐守
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPalace.majorStars.length > 0 ? (
                                        selectedPalace.majorStars.map((star: any) => (
                                            <div key={star.name} className="bg-white p-3 rounded-lg border border-[#e5e0d8] shadow-sm flex-1 min-w-[100px]">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-bold ${['庙','旺'].includes(star.brightness) ? 'text-[#b91c1c]' : 'text-[#4a4238]'}`}>
                                                        {star.name}
                                                    </span>
                                                    <span className="text-[10px] bg-[#f3efe9] px-1.5 py-0.5 rounded text-[#6b7280]">{star.brightness}</span>
                                                </div>
                                                {star.mutagen && (
                                                    <div className={`text-xs mt-1 font-bold ${star.mutagen === '禄' && 'text-[#15803d]'} ${star.mutagen === '权' && 'text-[#b45309]'} ${star.mutagen === '科' && 'text-[#1d4ed8]'} ${star.mutagen === '忌' && 'text-[#b91c1c]'}`}>
                                                        化{star.mutagen}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[#9ca3af] text-sm italic py-2">命无正曜</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-[#60a5fa] uppercase tracking-wider mb-2">辅星</h3>
                                <div className="flex flex-wrap gap-2 text-sm text-[#4b5563]">
                                    {selectedPalace.minorStars.map((star: any) => (
                                        <span key={star.name} className="bg-[#f3f4f6] px-2 py-1 rounded border border-[#e5e7eb]">{star.name}</span>
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