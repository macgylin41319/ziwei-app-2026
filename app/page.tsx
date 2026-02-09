"use client";

import React, { useState, useMemo } from "react";
import { astro } from "iztro";
import { X, Star, Moon, Sparkles, BookOpen, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "男" | "女";

// --- 1. 深度解盘数据库 ---

// 宫位定义：告诉用户这个格子是管什么的
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

// 主星详解：加入性格优缺点
const starDescriptions: Record<string, string> = {
  "紫微": "【帝王星】尊贵、有领导力、耳根软。优点：稳重有威严；缺点：容易刚愎自用，喜听谗言。",
  "天机": "【智慧星】机智、多变、善思考。优点：反应快、足智多谋；缺点：想太多、精神容易紧张。",
  "太阳": "【官禄主】博爱、热情、喜付出。优点：积极乐观、有驱动力；缺点：劳心劳力，容易招惹是非。",
  "武曲": "【财帛主】刚毅、果决、重执行。优点：对金钱敏感、行动力强；缺点：性格孤僻、不解风情。",
  "天同": "【福星】温顺、乐天、重享受。优点：不爱计较、人缘好；缺点：容易懒散、缺乏开创力。",
  "廉贞": "【次桃花】公关、才华、重感情。优点：社交能力强、是非分明；缺点：情绪多变、心高气傲。",
  "天府": "【库星】稳重、包容、善理财。优点：有大将之风、生活讲究；缺点：保守谨慎、爱面子。",
  "太阴": "【田宅主】温柔、细腻、重家庭。优点：心思细密、有艺术感；缺点：多愁善感、洁癖。",
  "贪狼": "【欲望星】多才、交际、重机遇。优点：多才多艺、擅长应酬；缺点：贪得无厌、桃花泛滥。",
  "巨门": "【口舌星】口才、观察、心思深。优点：能言善辩、分析力强；缺点：容易口舌得罪人、多疑。",
  "天相": "【印星】公正、辅助、重形象。优点：忠诚可靠、粉饰太平；缺点：缺乏主见、容易随波逐流。",
  "天梁": "【荫星】慈悲、照顾、重原则。优点：逢凶化吉、长者风范；缺点：好管闲事、老气横秋。",
  "七杀": "【将星】肃杀、冲劲、喜独断。优点：勇往直前、不畏艰难；缺点：冲动鲁莽、一生起伏大。",
  "破军": "【耗星】破坏、创新、喜变化。优点：创意无限、敢于突破；缺点：喜新厌旧、破坏力强。",
};

// 四化详解：这才是紫微斗数的精髓！
const mutagenDescriptions: Record<string, string> = {
  "禄": "【化禄 - 财富与机缘】超级吉星！代表钱财增加、机会增多、人缘变好。在命宫代表一生衣食无忧，在财帛宫代表财源滚滚。",
  "权": "【化权 - 权力与掌控】强力吉星！代表掌权、升职、控制欲增强。在命宫代表个性强势，在官禄宫代表容易做主管。",
  "科": "【化科 - 名声与功名】柔和吉星！代表考运好、出名、有贵人解围。在命宫代表斯文儒雅，在财帛宫代表收入平稳。",
  "忌": "【化忌 - 阻碍与亏欠】麻烦制造者。代表不顺、执着、亏损、是非。在哪个宫位，就代表你最操心那个领域（但也代表那是你的业力所在）。",
};

export default function ZiWeiApp() {
  const [birthDate, setBirthDate] = useState("1979-05-31");
  const [birthTime, setBirthTime] = useState(15);
  const [gender, setGender] = useState<Gender>("男");
  const [selectedPalace, setSelectedPalace] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const horoscope = useMemo<any>(() => {
    try {
      setErrorMsg("");
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
            紫微斗数 <span className="text-xs font-normal text-slate-500 border border-slate-700 rounded px-1 ml-1">Pro Max</span>
          </h1>
        </div>
        <span className="text-xs text-slate-500">By Gemini</span>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
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
                    className="bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6">
                        {/* 标题栏 */}
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
                        
                        {/* 1. 宫位解释（新增） */}
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                             <h3 className="text-xs font-bold text-blue-300 mb-1 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> 宫位定义
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                {palaceDefinitions[selectedPalace.name] || "暂无解释"}
                            </p>
                        </div>

                        {/* 2. 深度解盘（升级版） */}
                        <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                            <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> 命理分析
                            </h3>
                            {selectedPalace.majorStars.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedPalace.majorStars.map((star: any) => (
                                        <div key={star.name}>
                                            {/* 主星解释 */}
                                            {starDescriptions[star.name] && (
                                                <div className="text-xs text-slate-300 leading-relaxed mb-1">
                                                    <span className="text-purple-400 font-bold">【{star.name}】</span>
                                                    {starDescriptions[star.name]}
                                                </div>
                                            )}
                                            {/* 四化解释（关键升级！） */}
                                            {star.mutagen && mutagenDescriptions[star.mutagen] && (
                                                <div className="text-xs text-amber-200/80 bg-amber-900/20 p-2 rounded border border-amber-500/20 mt-1 flex gap-2">
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
                                <div className="text-xs text-slate-400">
                                    此为【空宫】，力量较弱，容易受环境影响。主要借对宫的星星来看，请参考对面的宫位。
                                </div>
                            )}
                        </div>

                        {/* 3. 星曜列表 */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
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