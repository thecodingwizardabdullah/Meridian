import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, Cell,
} from "recharts";

const APP = "Meridian";
const BOT = "Sage";

/* ═══════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#07080c;--bg2:#0e1018;
    --card:rgba(255,255,255,0.04);--border:rgba(255,255,255,0.08);
    --vz:#8b5cf6;--vzl:#c4b5fd;
    --vm:#d97706;--vml:#fbbf24;
    --cz:#22d3ee;--cm:#6b9e6b;
    --pk:#ec4899;--lime:#a3e635;
    --r:#f43f5e;--a:#f59e0b;--g:#10b981;
    --t:#f1f5f9;--t2:#94a3b8;--t3:#475569;
  }
  html,body{background:var(--bg);color:var(--t);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
  .h{font-family:'Syne',sans-serif;}
  .gt-z{background:linear-gradient(135deg,#c4b5fd,#22d3ee,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .gt-m{background:linear-gradient(135deg,#fbbf24,#86efac,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .glass{background:var(--card);border:1px solid var(--border);border-radius:16px;backdrop-filter:blur(16px);}
  .fade-up{animation:fadeUp .4s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes dotPulse{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
  @keyframes burnoutRing{0%,100%{box-shadow:0 0 0 0 rgba(244,63,94,.45)}60%{box-shadow:0 0 0 14px rgba(244,63,94,0)}}
  @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(139,92,246,.3)}50%{box-shadow:0 0 24px rgba(139,92,246,.6)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes quoteSlide{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
  .float{animation:floatY 5s ease-in-out infinite;}
  .orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;}
  .chip{display:inline-flex;align-items:center;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;transition:all .18s;border:1px solid var(--border);background:transparent;color:var(--t2);}
  .chip:hover,.chip.sel-z{border-color:var(--vz);color:var(--vzl);background:rgba(139,92,246,.14);}
  .chip.sel-m{border-color:var(--vm);color:var(--vml);background:rgba(217,119,6,.12);}
  .btn-z{background:linear-gradient(135deg,#8b5cf6,#22d3ee);border:none;color:#fff;padding:12px 24px;border-radius:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;font-size:14px;}
  .btn-z:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(139,92,246,.45);}
  .btn-z:active{transform:translateY(0);}
  .btn-z:disabled{opacity:.45;cursor:not-allowed;transform:none;}
  .btn-m{background:linear-gradient(135deg,#d97706,#6b9e6b);border:none;color:#fff;padding:12px 24px;border-radius:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;font-size:14px;}
  .btn-m:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(217,119,6,.4);}
  .btn-m:active{transform:translateY(0);}
  .btn-m:disabled{opacity:.45;cursor:not-allowed;transform:none;}
  .btn-gh{background:transparent;border:1px solid var(--border);color:var(--t2);padding:10px 20px;border-radius:10px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;font-size:14px;}
  .btn-gh:hover{border-color:var(--vz);color:var(--vzl);background:rgba(139,92,246,.07);}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;transition:all .18s;color:var(--t2);font-size:14px;font-weight:500;user-select:none;}
  .nav-item:hover{background:rgba(255,255,255,.05);color:var(--t);}
  .nav-z.active{background:rgba(139,92,246,.15);color:var(--vzl);}
  .nav-m.active{background:rgba(217,119,6,.12);color:var(--vml);}
  .ifield{background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:10px;padding:12px 16px;color:var(--t);width:100%;font-family:'DM Sans',sans-serif;font-size:14px;transition:border-color .2s;resize:vertical;}
  .ifield:focus{outline:none;border-color:var(--vz);}
  .ifield::placeholder{color:var(--t3);}
  .tab{padding:8px 18px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;transition:all .18s;color:var(--t2);background:transparent;border:none;}
  .tab.atz{background:rgba(139,92,246,.18);color:var(--vzl);}
  .tab.atm{background:rgba(217,119,6,.15);color:var(--vml);}
  .tab:hover:not(.atz):not(.atm){color:var(--t);}
  .mood-btn{width:52px;height:52px;border-radius:50%;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;border:2px solid transparent;background:rgba(255,255,255,.05);}
  .mood-btn:hover{transform:scale(1.15);}
  .mood-btn.sel{border-color:var(--vz);background:rgba(139,92,246,.18);transform:scale(1.1);}
  .prog-bar{height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;}
  .pfz{height:100%;border-radius:3px;background:linear-gradient(90deg,#8b5cf6,#22d3ee);transition:width .7s ease;}
  .pfm{height:100%;border-radius:3px;background:linear-gradient(90deg,#d97706,#6b9e6b);transition:width .7s ease;}
  .xp-bar{height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;}
  .xp-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#f59e0b,#ef4444);transition:width .8s ease;}
  .sidebar{width:228px;min-height:100vh;border-right:1px solid var(--border);padding:24px 14px;display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;overflow-y:auto;}
  .main{margin-left:228px;min-height:100vh;padding:32px;max-width:1120px;}
  .burnout-pulse{animation:burnoutRing 2s ease-in-out infinite;}
  .quote-card{animation:quoteSlide .4s ease both;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(139,92,246,.3);border-radius:4px;}
  @media(max-width:768px){.sidebar{display:none;}.main{margin-left:0;padding:16px;}}
`;

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const OCCS = ["Student","Freelancer","Developer","Content Creator","Athlete","Entrepreneur","Office Worker","Creative Artist","Job Seeker","Other"];

const GEN_Z_GOALS = ["Build real discipline","Reduce screen time","Find my purpose","Learn a skill that pays","Build confidence","Grow my brand/following","Stop people pleasing","Get fit consistently","Improve grades","Stop living paycheck to paycheck"];
const GEN_Z_PROBLEMS = ["Doom scrolling & phone addiction","Comparing myself to everyone online","Can't focus for more than 10 minutes","Procrastination spirals","Identity anxiety (who even am I)","Instant gratification trap","Financial anxiety & debt stress","Climate/world anxiety","Cancel culture stress & people pleasing","Burnout from 'keeping up'"];

const MILL_GOALS = ["Recover from burnout","Reclaim work-life balance","Advance my career strategically","Build financial security","Spend more time with people I love","Get back into consistent fitness","Find meaning in my work","Build a side income stream","Improve my leadership skills","Rebuild my sense of self"];
const MILL_PROBLEMS = ["Chronic burnout I can't shake","Work never really stops (always-on culture)","Meeting & Zoom fatigue","Mid-career stagnation or identity crisis","Financial pressure (mortgage, kids, savings)","Health neglect — no time or energy","Comparison to peers hitting 'milestones'","Perfectionism paralysis","Emotional numbness / just going through motions","Parenting guilt vs career ambition"];

const MOODS = [{e:"😤",l:"Stressed",v:1},{e:"😔",l:"Low",v:2},{e:"😐",l:"Neutral",v:3},{e:"😊",l:"Good",v:4},{e:"🤩",l:"Thriving",v:5}];

/* ═══════════════════════════════════════════════════════
   MOTIVATIONAL QUOTES — per problem type
═══════════════════════════════════════════════════════ */
const PROBLEM_QUOTES = {
  // Gen Z
  "Doom scrolling & phone addiction": [
    { q: "Every time you put down your phone, you pick up your life.", a: "— Meridian" },
    { q: "Attention is the new currency. Spend it on what you own.", a: "— Digital Minimalism" },
    { q: "The scroll never ends. Your potential does when you keep scrolling.", a: "— Sage" },
  ],
  "Comparing myself to everyone online": [
    { q: "Comparison is the thief of joy — and Instagram has a lot of thieves.", a: "— T. Roosevelt, remixed" },
    { q: "You are not behind. You are on your own timeline.", a: "— Sage" },
    { q: "Stop measuring your chapter 1 against someone else's chapter 20.", a: "— Meridian" },
  ],
  "Can't focus for more than 10 minutes": [
    { q: "Focus is a muscle. It atrophies without training. Today is day one.", a: "— Sage" },
    { q: "Small acts of attention compound into extraordinary work.", a: "— Cal Newport" },
    { q: "The ability to focus deeply is a superpower in a distracted world.", a: "— Meridian" },
  ],
  "Procrastination spirals": [
    { q: "You don't have to feel like it. You just have to start.", a: "— Mel Robbins" },
    { q: "Action is the antidote to anxiety. Move first, feel better second.", a: "— Sage" },
    { q: "Done is better than perfect. Ship it. Fix it. Grow.", a: "— Meridian" },
  ],
  "Identity anxiety (who even am I)": [
    { q: "You are not lost. You are becoming.", a: "— Sage" },
    { q: "Identity is built through action, not introspection alone.", a: "— Meridian" },
    { q: "The version of you figuring it out is still a version worth being.", a: "— Sage" },
  ],
  "Instant gratification trap": [
    { q: "Delayed gratification isn't deprivation — it's the ultimate flex.", a: "— Meridian" },
    { q: "Your future self is watching what you do right now.", a: "— Sage" },
    { q: "The best rewards require the most patience. That's not a bug.", a: "— Meridian" },
  ],
  "Financial anxiety & debt stress": [
    { q: "Financial clarity is built one decision at a time. Start with one.", a: "— Sage" },
    { q: "The money you don't know about controls you. Knowledge is power.", a: "— Meridian" },
    { q: "Every debt has a due date. Every goal has a deadline. Choose your urgency.", a: "— Sage" },
  ],
  "Climate/world anxiety": [
    { q: "You can care deeply without carrying it all. Protect your capacity.", a: "— Sage" },
    { q: "Do what you can, where you are, with what you have.", a: "— T. Roosevelt" },
    { q: "Sustainable action beats paralyzed perfection every time.", a: "— Meridian" },
  ],
  "Cancel culture stress & people pleasing": [
    { q: "You can't be everyone's hero. Pick yourself first.", a: "— Sage" },
    { q: "'No' is a complete sentence. Practice it like a skill.", a: "— Meridian" },
    { q: "Your peace matters more than their approval.", a: "— Sage" },
  ],
  "Burnout from 'keeping up'": [
    { q: "You can't pour from an empty cup. Rest is not a reward. It's required.", a: "— Meridian" },
    { q: "Hustle culture lied to you. Sustainability wins long-term.", a: "— Sage" },
    { q: "Burnout isn't a badge of honor. Recovery is.", a: "— Meridian" },
  ],
  // Millennial
  "Chronic burnout I can't shake": [
    { q: "Burnout is not a character flaw. It's a system failure. Fix the system.", a: "— Sage" },
    { q: "Recovery isn't weakness — it's the prerequisite for everything else.", a: "— Meridian" },
    { q: "You can't think your way out of burnout. Rest your way out.", a: "— Sage" },
  ],
  "Work never really stops (always-on culture)": [
    { q: "Disconnecting is not abandonment. It is maintenance.", a: "— Meridian" },
    { q: "Boundaries aren't walls. They're the architecture of sustainable output.", a: "— Sage" },
    { q: "The inbox will survive without you for the evening. Trust it.", a: "— Meridian" },
  ],
  "Meeting & Zoom fatigue": [
    { q: "Every meeting that shouldn't exist costs two people their focus.", a: "— Sage" },
    { q: "Protect your calendar like you protect your health. Both are finite.", a: "— Meridian" },
    { q: "Your best thinking doesn't happen in back-to-back video calls.", a: "— Sage" },
  ],
  "Mid-career stagnation or identity crisis": [
    { q: "Stagnation is feedback, not failure. It's telling you to change something.", a: "— Sage" },
    { q: "Your career chapter 2 can be more intentional than chapter 1.", a: "— Meridian" },
    { q: "Who you were professionally doesn't dictate who you'll become.", a: "— Sage" },
  ],
  "Financial pressure (mortgage, kids, savings)": [
    { q: "Financial pressure is real. So is your ability to navigate it systematically.", a: "— Meridian" },
    { q: "Clarity beats anxiety. Name the numbers. Face them. Then move.", a: "— Sage" },
    { q: "Small consistent actions compound faster than you think.", a: "— Meridian" },
  ],
  "Health neglect — no time or energy": [
    { q: "You can't perform at your best on a depleted system. Health IS productivity.", a: "— Sage" },
    { q: "10 minutes of movement is not nothing. It's the beginning.", a: "— Meridian" },
    { q: "Your body keeps the score. Make sure the score is survivable.", a: "— Sage" },
  ],
  "Comparison to peers hitting 'milestones'": [
    { q: "LinkedIn is a highlight reel. Your life is the full movie.", a: "— Meridian" },
    { q: "Their milestone is not your deadline.", a: "— Sage" },
    { q: "The most successful people you know stopped comparing a long time ago.", a: "— Meridian" },
  ],
  "Perfectionism paralysis": [
    { q: "Done and imperfect beats perfect and invisible.", a: "— Sage" },
    { q: "Perfectionism is procrastination in a suit.", a: "— Meridian" },
    { q: "Ship it. Iterate. The best version comes after the first version exists.", a: "— Sage" },
  ],
  "Emotional numbness / just going through motions": [
    { q: "Numbness is not peace. It's a signal that something needs to change.", a: "— Sage" },
    { q: "Feeling nothing is still a feeling worth investigating.", a: "— Meridian" },
    { q: "Reconnecting to meaning takes time. Start with one small thing.", a: "— Sage" },
  ],
  "Parenting guilt vs career ambition": [
    { q: "You can be a great parent AND have ambition. These are not opposites.", a: "— Meridian" },
    { q: "Guilt is not a productive emotion. Intention is.", a: "— Sage" },
    { q: "Showing up imperfectly and consistently is better than perfect and absent.", a: "— Meridian" },
  ],
  // fallback
  DEFAULT: [
    { q: "Every day you track your progress is a day you're ahead of who you were.", a: "— Meridian" },
    { q: "Systems beat motivation. Build the system first.", a: "— Sage" },
    { q: "Small consistent wins compound into extraordinary outcomes.", a: "— Meridian" },
    { q: "Self-awareness is the beginning of all change.", a: "— Sage" },
    { q: "You are not behind. You are in progress.", a: "— Meridian" },
  ]
};

/* Problem-specific coping techniques */
const PROBLEM_COPING = {
  "Doom scrolling & phone addiction": [
    { i: "📵", t: "Phone in Another Room", d: "Physical distance is your strongest filter. Put phone in another room for 30 mins. The anxiety fades in 3–4 mins — that relief is your baseline, reclaimed.", tag: "Environment" },
    { i: "⏰", t: "Intentional Check-ins", d: "Check phone only at pre-set times: 9am, 1pm, 6pm. Between these, it doesn't exist. Scheduled access eliminates compulsive checking.", tag: "Schedule" },
    { i: "🌅", t: "Phone-Free First Hour", d: "Don't look at your phone the first 60 minutes after waking. Your morning state shapes your entire day. Protect it from algorithms.", tag: "Morning" },
    { i: "🎨", t: "Replace, Don't Resist", d: "When the scroll urge hits, open a book, sketchpad, or puzzle instead. Replacement beats willpower every time.", tag: "Behavioral" },
  ],
  "Comparing myself to everyone online": [
    { i: "🚫", t: "Comparison Awareness Log", d: "When you catch yourself comparing, write it down: what triggered it, what you told yourself, what's actually true about your situation.", tag: "Awareness" },
    { i: "📖", t: "Curate Your Feed", d: "Unfollow or mute accounts that trigger comparison. This isn't weakness — it's environmental design. Your feed is your mental diet.", tag: "Digital" },
    { i: "🏆", t: "Compete With Past You", d: "Each morning, ask: am I better than last week's version of me? That is your only race. Log one proof point daily.", tag: "Mindset" },
    { i: "✍️", t: "Evidence Journal", d: "Write 3 things you've done, built, or survived this month that you're proud of. Read when comparison hits.", tag: "Grounding" },
  ],
  "Can't focus for more than 10 minutes": [
    { i: "⏱️", t: "Start With 10 Minutes", d: "Don't fight 10-minute focus — work WITH it. Set a 10-minute timer, one task only. When it ends, decide to extend or rest. This is how you train longer focus.", tag: "Timer" },
    { i: "🧹", t: "Single-Tab Rule", d: "Close every tab except the one thing you're doing. Browser clutter = mental clutter. One tab, one task.", tag: "Environment" },
    { i: "🎵", t: "Focus Soundtrack", d: "Brown noise, lo-fi, or binaural beats create an audio environment that signals 'work mode' to your brain. Use the same playlist every session.", tag: "Sound" },
    { i: "✍️", t: "Pre-Task Intention", d: "Before starting, write: 'In the next 10 minutes I will specifically...' The brain focuses better when it has a defined target.", tag: "Cognitive" },
  ],
  "Procrastination spirals": [
    { i: "🚀", t: "2-Minute Launch Rule", d: "If you've been avoiding something, commit to 2 minutes only. Starting is the hardest part. Once moving, you'll almost always continue.", tag: "Start" },
    { i: "📋", t: "Shrink the Task", d: "Break the avoided task into steps so small they feel trivial. 'Write essay' → 'open document.' Specificity removes activation energy.", tag: "Planning" },
    { i: "😤", t: "Name the Real Block", d: "What's ACTUALLY holding you back — fear of judgment? Fear of failure? Perfectionism? Write it explicitly. Named fears lose power.", tag: "Awareness" },
    { i: "🎯", t: "Implementation Intention", d: "'When [situation], I will [action] for [duration].' Map exact triggers. This is the most evidence-backed anti-procrastination technique.", tag: "Behavioral" },
  ],
  "Identity anxiety (who even am I)": [
    { i: "📓", t: "Values Excavation", d: "Write 10 things that make you genuinely angry (they reveal what you value). Then write 10 things that fill you with energy. Overlap = your identity's core.", tag: "Reflection" },
    { i: "🎭", t: "Try-On Framework", d: "Instead of 'who am I,' ask 'who am I trying to become?' Identity is a direction, not a fixed point. Pick a direction and move.", tag: "Mindset" },
    { i: "🔬", t: "Experiment, Don't Commit", d: "You don't need to pick an identity — try things for 30 days. Write what you feel. Patterns emerge. Identity is built through experiments.", tag: "Action" },
    { i: "🌱", t: "Anchor Actions", d: "Pick 3 small daily actions that feel like 'you' at your best. Do them regardless of mood. Identity follows behavior, not the other way around.", tag: "Daily" },
  ],
  "Instant gratification trap": [
    { i: "⏳", t: "The 10-Minute Rule", d: "When you want immediate gratification, pause 10 minutes first. Most impulses lose 80% of their urgency if you wait. Use a timer.", tag: "Delay" },
    { i: "📊", t: "Visualize Future You", d: "Before the impulse, vividly imagine the future you who made the better choice. Neuroscience shows this activates self-control systems.", tag: "Mental" },
    { i: "🔗", t: "Temptation Bundling", d: "Allow the pleasurable thing ONLY while doing the difficult thing. Netflix only while exercising. Social media only after finishing the task.", tag: "Behavioral" },
    { i: "🏦", t: "Savings as Identity", d: "Reframe: 'I'm someone who invests in their future.' Identity-based habits stick longer than willpower-based ones.", tag: "Mindset" },
  ],
  "Burnout from 'keeping up'": [
    { i: "🛑", t: "Permission to Stop", d: "Schedule non-negotiable rest time like a meeting. Not optional. Put it in your calendar. Recovery is not laziness — it's required maintenance.", tag: "Recovery" },
    { i: "✂️", t: "Subtract First", d: "Before adding any new commitment, remove something. Your energy is finite. Every yes needs a no somewhere.", tag: "Boundaries" },
    { i: "📵", t: "Social Media Detox", d: "Take 48-hour breaks from all platforms weekly. The 'keeping up' feeling is algorithmically manufactured. Step outside it regularly.", tag: "Digital" },
    { i: "🌿", t: "Enough Practice", d: "Daily: write what was 'enough' today. Retraining your brain to recognize sufficiency combats the always-behind feeling.", tag: "Mindset" },
  ],
  "Chronic burnout I can't shake": [
    { i: "🧊", t: "Cold Face Splash", d: "Splash cold water on face: triggers the diving reflex, heart rate drops in 30 seconds. Fastest cortisol reduction outside of breathing.", tag: "Instant" },
    { i: "📋", t: "Shutdown Ritual", d: "Write tomorrow's top 3 tasks at end of day. Say 'shutdown complete' aloud. Stops the loop. Your brain relaxes when it trusts things are captured.", tag: "Evening" },
    { i: "🧘", t: "Progressive Muscle Release", d: "Tense each muscle group 5 seconds, release, move up body. Unresolved stress lives physically. This drains it systematically.", tag: "Body" },
    { i: "📓", t: "Daily Audit", d: "3 questions: What went well? What drained me? What will I protect tomorrow? Takes 4 minutes. Creates massive clarity over 30 days.", tag: "Reflection" },
  ],
  "Work never really stops (always-on culture)": [
    { i: "🚫", t: "Hard Stop Time", d: "Set a non-negotiable end time every day. Put it in your calendar. Tell your team. Enforce it for 2 weeks. Watch your morning energy transform.", tag: "Boundary" },
    { i: "📵", t: "Notification Curfew", d: "All work notifications off after your stop time. Not silenced — off. Remove the option to check. Willpower fails; friction protects.", tag: "Digital" },
    { i: "🔄", t: "Transition Ritual", d: "A 10-min ritual between work and personal time (walk, music, tea). Your brain needs a signal that work mode is over. Create one deliberately.", tag: "Ritual" },
    { i: "📋", t: "Inbox Bankruptcy", d: "Declare a weekly inbox zero hour. Archive everything older than 7 days. The backlog creates anxiety, not value.", tag: "Productivity" },
  ],
  "Meeting & Zoom fatigue": [
    { i: "🎯", t: "Meeting Audit", d: "List every recurring meeting. For each: is it necessary? Could it be async? Cut or convert 30%. Your calendar is your life.", tag: "Audit" },
    { i: "⏱️", t: "25/50 Minute Rule", d: "End meetings at 25 or 50 minutes instead of 30/60. Recovery buffers between meetings are not optional — they're when you process.", tag: "Schedule" },
    { i: "🚶", t: "Walking 1:1s", d: "Move standing or walking 1:1s outside. Movement + conversation reduces cortisol and improves creative thinking by 60%.", tag: "Movement" },
    { i: "📝", t: "Async Default", d: "For any update that doesn't require real-time response: Loom video or written update instead. Protect synchronous time for things that actually need it.", tag: "Async" },
  ],
  "Mid-career stagnation or identity crisis": [
    { i: "🗺️", t: "Career Eulogy Exercise", d: "Write what you'd want your professional life to be remembered for — then compare to your current week. The gap IS your direction.", tag: "Clarity" },
    { i: "🧪", t: "Micro Experiments", d: "Run 30-day experiments in new directions without quitting. Try the adjacent thing. Data beats speculation about what might fulfill you.", tag: "Action" },
    { i: "🤝", t: "Informational Interviews", d: "Talk to 3 people whose work energizes you. Ask how they got there. Real conversations break stagnation faster than planning sessions.", tag: "Network" },
    { i: "📊", t: "Skill Gap Analysis", d: "Map the skills of your ideal next role. Honestly rate yourself. Pick the highest-leverage gap and spend 20 mins per day closing it.", tag: "Growth" },
  ],
  "Perfectionism paralysis": [
    { i: "🚢", t: "Ship at 80%", d: "Define 80% complete before you start. When you reach it, ship. The remaining 20% takes as long as the first 80% combined and yields 5% improvement.", tag: "Output" },
    { i: "⏰", t: "Time-Boxed Drafts", d: "Give yourself 60 minutes to produce a draft. Timer goes off — you share it. Externally imposed deadlines bypass perfectionism.", tag: "Timer" },
    { i: "🪞", t: "Fear Inventory", d: "Ask: what's the actual worst case if this isn't perfect? Write it out. 90% of perfectionism fears are survivable and unlikely.", tag: "Cognitive" },
    { i: "✅", t: "Done-Is-Good Journal", d: "Daily log of things you completed imperfectly that still provided value. Builds evidence against perfectionism's narrative.", tag: "Evidence" },
  ],
  DEFAULT: [
    { i: "🧘", t: "Box Breathing", d: "4-4-4-4 pattern: inhale 4s, hold 4s, exhale 4s, hold 4s. 3 cycles produces measurable cortisol reduction. Navy SEALs use this.", tag: "Breathing" },
    { i: "✍️", t: "Brain Dump", d: "Write everything circling your head for 3 minutes. No filter. Your brain loops because it doesn't trust you've recorded things.", tag: "Cognitive" },
    { i: "🌿", t: "5-4-3-2-1 Grounding", d: "5 things you see, 4 feel, 3 hear, 2 smell, 1 taste. Instant anchor to the present moment. Works in 90 seconds.", tag: "Grounding" },
    { i: "🚶", t: "10-Min Walk (No Phone)", d: "No podcast, no scrolling. Your brain processes backlogged emotions during rhythmic movement. This is therapy.", tag: "Movement" },
  ]
};

const GEN_Z_NAV = [{id:"dashboard",icon:"⚡",label:"Vibe Check"},{id:"focus",icon:"🎯",label:"Focus Mode"},{id:"stress",icon:"🧘",label:"Decompress"},{id:"goals",icon:"🚀",label:"Quests"},{id:"journal",icon:"📓",label:"My Journey"},{id:"sage",icon:"✨",label:"Sage AI"},{id:"analytics",icon:"📊",label:"My Stats"}];
const MILL_NAV = [{id:"dashboard",icon:"🏠",label:"Command Center"},{id:"focus",icon:"🎯",label:"Deep Work"},{id:"stress",icon:"🧘",label:"Recovery"},{id:"goals",icon:"📌",label:"Goals & KPIs"},{id:"journal",icon:"📓",label:"My Journey"},{id:"sage",icon:"🤝",label:"Sage Coach"},{id:"analytics",icon:"📊",label:"Analytics"}];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const isZ = (p) => p?.generation?.includes("Gen Z");

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getQuoteForUser(problems) {
  if (!problems || problems.length === 0) return PROBLEM_QUOTES.DEFAULT[0];
  const firstProblem = problems[0];
  const quotes = PROBLEM_QUOTES[firstProblem] || PROBLEM_QUOTES.DEFAULT;
  return quotes[Math.floor(Date.now() / 86400000) % quotes.length]; // changes daily
}

function getCopingTechniques(problems, gz) {
  if (!problems || problems.length === 0) return PROBLEM_COPING.DEFAULT;
  const techniques = [];
  const seen = new Set();
  for (const problem of problems) {
    const techs = PROBLEM_COPING[problem] || [];
    for (const t of techs) {
      if (!seen.has(t.t)) { seen.add(t.t); techniques.push({ ...t, matchedProblem: problem }); }
    }
    if (techniques.length >= 8) break;
  }
  if (techniques.length < 4) techniques.push(...PROBLEM_COPING.DEFAULT.filter(t => !seen.has(t.t)));
  return techniques.slice(0, 8);
}

function getGreeting(profile) {
  const gz = {
    Student: ["your future is being built right now, one hour at a time 📚","this version of you is temporary — the glow-up is loading ✨"],
    "Content Creator": ["create before you consume. protect that creative energy 🎨","the algorithm can wait. your mind comes first ✨"],
    Athlete: ["rest IS the training. your body's building while you recover 💪","champions plan their recovery as hard as their grind 🏆"],
    Developer: ["let's debug your day, one block at a time 🖥️","ship your goals like you ship code — iterate and improve 💻"],
    Freelancer: ["multiple deadlines, one legendary human. let's organize 🚀","you're the CEO of yourself. time to lead accordingly ✨"],
    Entrepreneur: ["your idea won't build itself — but your system will 🔥","the difference between a dream and a plan is a date 🧠"],
  };
  const gm = {
    Student: ["your effort right now is building the compound interest of your career 📚","the skills you're building now — they compound faster than you think"],
    "Office Worker": ["let's make today count without burning out. sustainable > heroic 💼","protecting your energy is part of the job. seriously."],
    Freelancer: ["you built your own lane. now let's protect your capacity 🚀","the goal isn't more work. it's better work with more life around it"],
    Entrepreneur: ["sustainable growth over frantic hustle. your future self agrees 🔥","the best version of this company runs on your best energy 🧠"],
  };
  const map = isZ(profile) ? gz : gm;
  const msgs = map[profile.occupation] || (isZ(profile)
    ? ["let's make today different from yesterday ✨","every expert was once a beginner with a good system 💡"]
    : ["sustainable momentum beats frantic bursts every time 💼","your wellbeing IS your performance. protect it 🌿"]);
  return msgs[Math.floor(Math.random() * msgs.length)];
}

/* ═══════════════════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════════════════ */
async function loadData(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

async function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/* ═══════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════ */
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div className="orb" style={{ width: 600, height: 600, background: "#8b5cf6", top: -200, right: -180, opacity: .22 }} />
      <div className="orb" style={{ width: 400, height: 400, background: "#22d3ee", bottom: -100, left: -100, opacity: .16 }} />
      <div className="orb" style={{ width: 300, height: 300, background: "#ec4899", top: "55%", left: "40%", opacity: .1 }} />
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 44px", position: "relative", zIndex: 1 }}>
        <div className="h" style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#c4b5fd,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{APP} ◈</div>
        <button className="btn-z" style={{ padding: "9px 22px" }} onClick={onStart}>Get Started →</button>
      </nav>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", padding: "60px 24px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 20, background: "rgba(139,92,246,.13)", border: "1px solid rgba(139,92,246,.3)", marginBottom: 28, fontSize: 13, color: "var(--vzl)", fontWeight: 600 }}>
          ✦ Meet {BOT} — Your AI Growth Companion
        </div>
        <h1 className="h fade-up" style={{ fontSize: "clamp(40px,7vw,76px)", fontWeight: 900, lineHeight: 1.06, marginBottom: 20 }}>
          The highest point<br />
          <span style={{ background: "linear-gradient(135deg,#c4b5fd,#22d3ee,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>of your potential.</span>
        </h1>
        <p style={{ fontSize: 17, color: "var(--t2)", lineHeight: 1.9, margin: "0 auto 40px", maxWidth: 520 }}>
          {APP} tracks your real journey — from Day 1 to today — with coping techniques matched to your actual problems and AI coaching built around your generation.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
          <button className="btn-z" style={{ fontSize: 16, padding: "15px 38px" }} onClick={onStart}>Build My Experience 🚀</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
          <div style={{ padding: 24, borderRadius: 20, background: "linear-gradient(145deg,rgba(139,92,246,.12),rgba(34,211,238,.08))", border: "1px solid rgba(139,92,246,.25)", textAlign: "left" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
            <div className="h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--vzl)" }}>Gen Z Experience</div>
            <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.7 }}>Gamified streaks, XP rewards, doom-scroll detox, real journey tracking from Day 1, and coping techniques built around YOUR specific problems.</p>
          </div>
          <div style={{ padding: 24, borderRadius: 20, background: "linear-gradient(145deg,rgba(217,119,6,.1),rgba(107,158,107,.08))", border: "1px solid rgba(217,119,6,.22)", textAlign: "left" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🏔️</div>
            <div className="h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "var(--vml)" }}>Millennial Experience</div>
            <p style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.7 }}>Burnout recovery tracking, work-life balance history, problem-matched recovery tools, and a coach who respects your time and experience.</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
          {[{ i: "📅", l: "Day 1 Tracking" }, { i: "🧘", l: "Problem-Matched Coping" }, { i: "💬", l: "Daily Quotes" }, { i: "📊", l: "Real Analytics" }, { i: "🏆", l: "Goal Tracking" }, { i: "✨", l: `${BOT} AI Coach` }].map(f => (
            <div key={f.l} className="glass fade-up" style={{ padding: "16px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.i}</div>
              <div style={{ fontSize: 12, color: "var(--t2)", fontWeight: 500 }}>{f.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════ */
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [prof, setProf] = useState({ generation: "", occupation: "", goals: [], problems: [], startDate: new Date().toISOString() });

  const steps = [
    { title: "First, which generation?", sub: "Your experience is completely tailored — different design, different AI tone, different systems.", field: "generation", multi: false, opts: ["Gen Z (born 1997–2012) ⚡", "Millennial (born 1981–1996) 🏔️"] },
    { title: "What do you do?", sub: "Your occupation shapes your schedule, advice style, and everything in between.", field: "occupation", multi: false, opts: OCCS },
    { title: "What are you working toward?", sub: "Pick all that apply — the more honest you are, the more precise your experience.", field: "goals", multi: true, opts: prof.generation.includes("Gen Z") ? GEN_Z_GOALS : MILL_GOALS },
    { title: "Real talk — what's getting in your way?", sub: "Zero judgment. This is what Sage uses to actually help you, not give you generic advice.", field: "problems", multi: true, opts: prof.generation.includes("Gen Z") ? GEN_Z_PROBLEMS : MILL_PROBLEMS },
    { title: "What's your name?", sub: "So Sage can address you personally throughout your journey.", field: "name", multi: false, isText: true },
  ];

  const cur = steps[step];
  const isMillennial = prof.generation.includes("Millennial");
  const btnClass = isMillennial ? "btn-m" : "btn-z";
  const selClass = isMillennial ? "sel-m" : "sel-z";

  const pick = (opt) => {
    if (cur.multi) {
      setProf(p => ({ ...p, [cur.field]: p[cur.field].includes(opt) ? p[cur.field].filter(x => x !== opt) : [...p[cur.field], opt] }));
    } else {
      const updated = { ...prof, [cur.field]: opt };
      setProf(updated);
      setTimeout(() => { if (step < steps.length - 1) setStep(s => s + 1); else onDone(updated); }, 280);
    }
  };

  const canGo = cur.multi ? prof[cur.field].length > 0 : !!prof[cur.field];

  if (cur.isText) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 20 }}>
        <div style={{ maxWidth: 480, width: "100%" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 30 }}>
            {steps.map((_, i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? (isMillennial ? "var(--vm)" : "var(--vz)") : "rgba(255,255,255,.1)", transition: "background .3s" }} />)}
          </div>
          <div className="glass fade-up" style={{ padding: "38px 34px" }}>
            <div style={{ fontSize: 11, color: isMillennial ? "var(--vml)" : "var(--vzl)", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "1.2px" }}>Step {step + 1} of {steps.length}</div>
            <h2 className="h" style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{cur.title}</h2>
            <p style={{ color: "var(--t2)", marginBottom: 26, lineHeight: 1.65, fontSize: 14 }}>{cur.sub}</p>
            <input className="ifield" placeholder="Enter your name..." value={prof.name || ""} onChange={e => setProf(p => ({ ...p, name: e.target.value }))} style={{ resize: "none", marginBottom: 16 }} onKeyDown={e => e.key === "Enter" && prof.name?.trim() && onDone(prof)} />
            <button className={btnClass} style={{ width: "100%" }} disabled={!prof.name?.trim()} onClick={() => onDone(prof)}>
              {`Build My ${isMillennial ? "Dashboard" : "Experience"} ✨`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden", padding: 20 }}>
      <div className="orb" style={{ width: 420, height: 420, background: isMillennial ? "#d97706" : "#8b5cf6", top: -120, right: -120, opacity: .25 }} />
      <div className="orb" style={{ width: 300, height: 300, background: isMillennial ? "#6b9e6b" : "#22d3ee", bottom: -60, left: -60, opacity: .18 }} />
      <div style={{ maxWidth: 580, width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 30 }}>
          {steps.map((_, i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= step ? (isMillennial ? "var(--vm)" : "var(--vz)") : "rgba(255,255,255,.1)", transition: "background .3s" }} />)}
        </div>
        <div className="glass fade-up" style={{ padding: "38px 34px" }}>
          <div style={{ fontSize: 11, color: isMillennial ? "var(--vml)" : "var(--vzl)", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "1.2px" }}>Step {step + 1} of {steps.length}</div>
          <h2 className="h" style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{cur.title}</h2>
          <p style={{ color: "var(--t2)", marginBottom: 26, lineHeight: 1.65, fontSize: 14 }}>{cur.sub}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {cur.opts.map(opt => {
              const isSel = cur.multi ? prof[cur.field].includes(opt) : prof[cur.field] === opt;
              return <button key={opt} className={`chip ${isSel ? selClass : ""}`} onClick={() => pick(opt)}>{opt}</button>;
            })}
          </div>
          {cur.multi && (
            <button className={btnClass} style={{ marginTop: 28, width: "100%" }} disabled={!canGo}
              onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onDone(prof)}>
              {step < steps.length - 1 ? "Continue →" : `Build My ${isMillennial ? "Dashboard" : "Experience"} ✨`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MOTIVATIONAL QUOTE BANNER
═══════════════════════════════════════════════════════ */
function QuoteBanner({ profile, gz }) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const problems = profile.problems || [];
  const allQuotes = problems.length > 0
    ? problems.flatMap(p => PROBLEM_QUOTES[p] || []).concat(PROBLEM_QUOTES.DEFAULT)
    : PROBLEM_QUOTES.DEFAULT;
  const quote = allQuotes[quoteIdx % allQuotes.length];

  return (
    <div className="quote-card" style={{ padding: "16px 20px", borderRadius: 14, background: gz ? "linear-gradient(135deg,rgba(139,92,246,.12),rgba(34,211,238,.06))" : "linear-gradient(135deg,rgba(217,119,6,.1),rgba(107,158,107,.07))", border: `1px solid ${gz ? "rgba(139,92,246,.25)" : "rgba(217,119,6,.22)"}`, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <div>
        <div style={{ fontSize: 13, color: "var(--t)", lineHeight: 1.7, fontStyle: "italic" }}>"{quote.q}"</div>
        <div style={{ fontSize: 11, color: gz ? "var(--vzl)" : "var(--vml)", marginTop: 4, fontWeight: 600 }}>{quote.a}</div>
      </div>
      <button onClick={() => setQuoteIdx(i => i + 1)} style={{ background: "transparent", border: `1px solid ${gz ? "rgba(139,92,246,.3)" : "rgba(217,119,6,.3)"}`, color: gz ? "var(--vzl)" : "var(--vml)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" }}>Next ↻</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DAY 1 JOURNEY BANNER
═══════════════════════════════════════════════════════ */
function JourneyBanner({ profile, gz }) {
  const days = daysSince(profile.startDate);
  const milestones = [1, 7, 14, 30, 60, 90, 180, 365];
  const nextMilestone = milestones.find(m => m > days) || 365;
  const pct = Math.min(100, (days / nextMilestone) * 100);

  return (
    <div style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <span className="h" style={{ fontSize: 13, fontWeight: 700, color: gz ? "var(--vzl)" : "var(--vml)" }}>📅 Your Journey</span>
          <span style={{ fontSize: 12, color: "var(--t3)", marginLeft: 10 }}>Started {formatDate(profile.startDate)}</span>
        </div>
        <div className="h" style={{ fontSize: 22, fontWeight: 800, color: gz ? "var(--vzl)" : "var(--vml)" }}>Day {days}</div>
      </div>
      <div className="prog-bar" style={{ marginBottom: 6 }}>
        <div className={gz ? "pfz" : "pfm"} style={{ width: `${pct}%` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--t3)" }}>
        <span>Day {days}</span>
        <span>Next milestone: Day {nextMilestone} ({nextMilestone - days} days away)</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GEN Z DASHBOARD
═══════════════════════════════════════════════════════ */
function GenZDashboard({ profile, entries, onSave }) {
  const [mood, setMood] = useState(null);
  const [scrollScore, setScrollScore] = useState(50);
  const [energyLevel, setEnergyLevel] = useState(60);
  const [taskInput, setTaskInput] = useState("");
  const greeting = getGreeting(profile);
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";

  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.date).toDateString() === today);
  const todayMood = todayEntries.length > 0 ? todayEntries[todayEntries.length - 1].mood : null;

  const [tasks, setTasks] = useState([
    { id: 1, task: "Log your vibe check", xp: 20, done: !!todayMood },
    { id: 2, task: "Complete 1 Focus Block", xp: 60, done: false },
    { id: 3, task: "No phone for 30 mins straight", xp: 50, done: false },
    { id: 4, task: "Do your breathing exercise", xp: 25, done: false },
    { id: 5, task: "Journal for 3 minutes", xp: 30, done: false },
  ]);

  const completedXP = tasks.filter(t => t.done).reduce((s, t) => s + t.xp, 0);
  const totalXP = tasks.reduce((s, t) => s + t.xp, 0);

  const logMood = (m) => {
    setMood(m);
    setTasks(prev => prev.map(t => t.id === 1 ? { ...t, done: true } : t));
    const entry = { date: new Date().toISOString(), mood: m, scrollScore, energyLevel, type: "mood" };
    onSave(entry);
  };

  const daysActive = daysSince(profile.startDate);
  const streak = Math.min(daysActive, entries.length > 0 ? Math.min(daysActive, 7) : 0);

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
        <div>
          <h1 className="h gt-z" style={{ fontSize: 30, fontWeight: 800, marginBottom: 5 }}>Good {timeGreet}{profile.name ? `, ${profile.name}` : ""} ⚡</h1>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>{greeting}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(139,92,246,.13)", border: "1px solid rgba(139,92,246,.28)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "var(--vzl)", fontWeight: 600 }}>🏆 Day {daysSince(profile.startDate)}</div>
          {streak > 0 && <div style={{ background: "rgba(245,158,11,.13)", border: "1px solid rgba(245,158,11,.28)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "var(--a)", fontWeight: 600 }}>🔥 {streak}-day streak</div>}
        </div>
      </div>

      <JourneyBanner profile={profile} gz={true} />
      <QuoteBanner profile={profile} gz={true} />

      {/* XP Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--t3)", marginBottom: 5 }}>
          <span>Today's XP Progress</span><span>{completedXP} / {totalXP} XP</span>
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${(completedXP / totalXP) * 100}%` }} /></div>
      </div>

      {/* Vibe Check */}
      <div className="glass" style={{ padding: 20, marginBottom: 18 }}>
        <h3 className="h" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Today's Vibe Check 🌈</h3>
        <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 14 }}>How are you actually feeling? No filter needed.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {MOODS.map(m => (
            <button key={m.v} className={`mood-btn ${(mood?.v || todayMood?.v) === m.v ? "sel" : ""}`} onClick={() => logMood(m)} title={m.l}>{m.e}</button>
          ))}
          {(mood || todayMood) && <span style={{ marginLeft: 8, fontSize: 13, color: "var(--vzl)", fontWeight: 600 }}>Feeling {(mood || todayMood).l} · logged ✓</span>}
        </div>
      </div>

      {/* Trackers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div className="glass" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h4 className="h" style={{ fontSize: 14, fontWeight: 600 }}>📱 Scroll Detox Score</h4>
            <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 10, background: scrollScore > 60 ? "rgba(16,185,129,.14)" : "rgba(244,63,94,.12)", color: scrollScore > 60 ? "var(--g)" : "var(--r)", fontWeight: 700 }}>
              {scrollScore > 60 ? "On Track" : "Watch It"}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 10 }}>How much have you avoided doom scrolling today?</p>
          <input type="range" min="0" max="100" value={scrollScore} onChange={e => setScrollScore(+e.target.value)} style={{ width: "100%", accentColor: "#8b5cf6" }} />
          <div className="prog-bar" style={{ marginTop: 8 }}><div className="pfz" style={{ width: `${scrollScore}%` }} /></div>
          <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 6 }}>{scrollScore}% screen-free effort today</p>
        </div>
        <div className="glass" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h4 className="h" style={{ fontSize: 14, fontWeight: 600 }}>⚡ Energy Level</h4>
            <span style={{ fontSize: 11, color: energyLevel > 70 ? "var(--g)" : energyLevel > 40 ? "var(--a)" : "var(--r)", fontWeight: 700 }}>{energyLevel}%</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 10 }}>How charged are you right now?</p>
          <input type="range" min="0" max="100" value={energyLevel} onChange={e => setEnergyLevel(+e.target.value)} style={{ width: "100%", accentColor: "#22d3ee" }} />
          <div style={{ marginTop: 10 }}>
            <div className="prog-bar"><div className="pfz" style={{ width: `${energyLevel}%` }} /></div>
            <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 6 }}>{energyLevel > 70 ? "High energy — capitalize on it now" : energyLevel > 40 ? "Moderate — protect it carefully" : "Low — rest IS progress"}</p>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="glass" style={{ padding: 20, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 className="h" style={{ fontSize: 15, fontWeight: 700 }}>🎮 Daily Quests</h3>
          <div style={{ fontSize: 13, color: "var(--a)", fontWeight: 700 }}>{completedXP} / {totalXP} XP</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {tasks.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: m.done ? "rgba(16,185,129,.07)" : "rgba(255,255,255,.02)", border: `1px solid ${m.done ? "rgba(16,185,129,.25)" : "var(--border)"}`, transition: "all .2s" }}>
              <div onClick={() => setTasks(prev => prev.map(t => t.id === m.id ? { ...t, done: !t.done } : t))}
                style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${m.done ? "var(--g)" : "var(--t3)"}`, background: m.done ? "var(--g)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .18s" }}>
                {m.done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 13, color: m.done ? "var(--t3)" : "var(--t)", textDecoration: m.done ? "line-through" : "none" }}>{m.task}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--a)", flexShrink: 0 }}>+{m.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        {[
          { l: "Days Active", v: `${daysSince(profile.startDate)}`, i: "📅", c: "var(--vzl)" },
          { l: "Entries Logged", v: `${entries.length}`, i: "📓", c: "var(--cz)" },
          { l: "Current Streak", v: `${streak} days`, i: "🔥", c: "var(--a)" },
          { l: "Problems Tracked", v: `${(profile.problems || []).length}`, i: "💎", c: "var(--pk)" },
        ].map(s => (
          <div key={s.l} className="glass" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 5 }}>{s.i}</div>
            <div className="h" style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "var(--t3)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MILLENNIAL DASHBOARD
═══════════════════════════════════════════════════════ */
function MillennialDashboard({ profile, entries, onSave }) {
  const [mood, setMood] = useState(null);
  const [burnoutLevel, setBurnoutLevel] = useState(0);
  const [meetingLoad, setMeetingLoad] = useState(0);
  const [workLifeBalance, setWorkLifeBalance] = useState(50);
  const greeting = getGreeting(profile);
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const burnoutRisk = burnoutLevel > 70 ? "High" : burnoutLevel > 45 ? "Moderate" : burnoutLevel > 0 ? "Low" : "—";
  const burnoutColor = burnoutLevel > 70 ? "var(--r)" : burnoutLevel > 45 ? "var(--a)" : "var(--g)";
  const today = new Date().toDateString();
  const todayEntries = entries.filter(e => new Date(e.date).toDateString() === today);
  const todayMood = todayEntries.find(e => e.mood);

  const logDay = () => {
    const entry = { date: new Date().toISOString(), mood, burnoutLevel, meetingLoad, workLifeBalance, type: "daily" };
    onSave(entry);
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
        <div>
          <h1 className="h gt-m" style={{ fontSize: 28, fontWeight: 800, marginBottom: 5 }}>Good {timeGreet}{profile.name ? `, ${profile.name}` : ""} 🏔️</h1>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>{greeting}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: "rgba(217,119,6,.13)", border: "1px solid rgba(217,119,6,.28)", borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "var(--vml)", fontWeight: 600 }}>Day {daysSince(profile.startDate)}</div>
        </div>
      </div>

      <JourneyBanner profile={profile} gz={false} />
      <QuoteBanner profile={profile} gz={false} />

      {burnoutLevel > 65 && (
        <div className="burnout-pulse" style={{ marginBottom: 18, padding: "14px 20px", borderRadius: 14, background: "rgba(244,63,94,.08)", border: "1px solid rgba(244,63,94,.3)", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--r)", marginBottom: 2 }}>Burnout Risk Detected</div>
            <div style={{ fontSize: 12, color: "var(--t3)" }}>Your inputs signal high stress load. Check Recovery tab for tools matched to your problems.</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div className="glass" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 className="h" style={{ fontSize: 14, fontWeight: 700 }}>🧠 Burnout Meter</h4>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: `${burnoutColor}18`, color: burnoutColor, fontWeight: 700 }}>{burnoutRisk} Risk</span>
          </div>
          <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${burnoutLevel}%`, borderRadius: 4, background: `linear-gradient(90deg,var(--g),var(--a),var(--r))`, transition: "width .6s" }} />
          </div>
          <input type="range" min="0" max="100" value={burnoutLevel} onChange={e => setBurnoutLevel(+e.target.value)} style={{ width: "100%", accentColor: burnoutColor }} />
          <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 6 }}>Drag to update how depleted you're feeling</p>
        </div>

        <div className="glass" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h4 className="h" style={{ fontSize: 14, fontWeight: 700 }}>⚖️ Work-Life Balance</h4>
            <span style={{ fontSize: 11, color: workLifeBalance > 55 ? "var(--g)" : workLifeBalance > 35 ? "var(--a)" : "var(--r)", fontWeight: 700 }}>{workLifeBalance}%</span>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            <div style={{ flex: workLifeBalance, height: 8, borderRadius: "4px 0 0 4px", background: "linear-gradient(90deg,#6b9e6b,#86efac)", transition: "flex .6s" }} />
            <div style={{ flex: 100 - workLifeBalance, height: 8, borderRadius: "0 4px 4px 0", background: "rgba(217,119,6,.5)", transition: "flex .6s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--t3)", marginBottom: 8 }}><span>🌿 Life</span><span>💼 Work</span></div>
          <input type="range" min="0" max="100" value={workLifeBalance} onChange={e => setWorkLifeBalance(+e.target.value)} style={{ width: "100%", accentColor: "var(--cm)" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <div className="glass" style={{ padding: 20 }}>
          <h4 className="h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📅 Meeting Load Today</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
              <button key={n} onClick={() => setMeetingLoad(n)} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${meetingLoad === n ? "var(--vm)" : "var(--border)"}`, background: meetingLoad === n ? "rgba(217,119,6,.18)" : "rgba(255,255,255,.03)", color: meetingLoad === n ? "var(--vml)" : "var(--t3)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{n}</button>
            ))}
          </div>
          {meetingLoad > 4 && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(244,63,94,.08)", border: "1px solid rgba(244,63,94,.2)", fontSize: 11, color: "#fca5a5" }}>⚠️ {meetingLoad} meetings is above sustainable. Block recovery buffers.</div>}
          {meetingLoad <= 2 && meetingLoad > 0 && <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", fontSize: 11, color: "#6ee7b7" }}>✓ Light meeting day — protect this for deep work.</div>}
        </div>
        <div className="glass" style={{ padding: 20 }}>
          <h4 className="h" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>😊 How are you doing?</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MOODS.map(m => (
              <button key={m.v} className={`mood-btn ${(mood?.v || todayMood?.mood?.v) === m.v ? "sel" : ""}`} onClick={() => setMood(m)} title={m.l}>{m.e}</button>
            ))}
          </div>
          {(mood || todayMood?.mood) && <p style={{ marginTop: 10, fontSize: 12, color: "var(--vml)" }}>Feeling {(mood || todayMood?.mood).l} · noted ✓</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button className="btn-m" style={{ flex: 1 }} onClick={logDay} disabled={!mood && burnoutLevel === 0}>
          💾 Log Today's Check-in
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
        {[
          { l: "Days Active", v: `${daysSince(profile.startDate)}`, i: "📅", c: "var(--vml)" },
          { l: "Check-ins Logged", v: `${entries.length}`, i: "📊", c: "var(--cm)" },
          { l: "Problems Tracked", v: `${(profile.problems || []).length}`, i: "🎯", c: "var(--a)" },
          { l: "Burnout Trend", v: entries.length > 1 ? (entries[entries.length-1].burnoutLevel > entries[0].burnoutLevel ? "↑ Rising" : "↓ Falling") : "—", i: "🧠", c: entries.length > 1 && entries[entries.length-1].burnoutLevel > entries[0].burnoutLevel ? "var(--r)" : "var(--g)" },
        ].map(s => (
          <div key={s.l} className="glass" style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 5 }}>{s.i}</div>
            <div className="h" style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "var(--t3)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FOCUS ROOM
═══════════════════════════════════════════════════════ */
function FocusRoom({ profile }) {
  const gz = isZ(profile);
  const [running, setRunning] = useState(false);
  const [workMin, setWorkMin] = useState(gz ? 20 : 50);
  const [breakMin, setBreakMin] = useState(gz ? 5 : 10);
  const [phase, setPhase] = useState("work");
  const [timeLeft, setTimeLeft] = useState(workMin * 60);
  const [sessions, setSessions] = useState(0);
  const [totalMin, setTotalMin] = useState(0);
  const intRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(intRef.current);
        if (phase === "work") { setSessions(s => s + 1); setTotalMin(m => m + workMin); setPhase("break"); setTimeLeft(breakMin * 60); }
        else { setPhase("work"); setTimeLeft(workMin * 60); }
        setRunning(false);
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => clearInterval(intRef.current);
  }, [running, phase]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const total = (phase === "work" ? workMin : breakMin) * 60;
  const pct = ((total - timeLeft) / total) * 100;
  const C = 2 * Math.PI * 88;
  const offset = C * (1 - pct / 100);
  const col = phase === "work" ? (gz ? "var(--vz)" : "var(--vm)") : "var(--g)";
  const btnClass = gz ? "btn-z" : "btn-m";

  return (
    <div className="fade-up">
      <h1 className="h" style={{ fontSize: 27, fontWeight: 800, marginBottom: 5 }}>{gz ? "⚡ Focus Mode" : "🎯 Deep Work"}</h1>
      <p style={{ color: "var(--t2)", marginBottom: 24, fontSize: 14 }}>{gz ? "Short, intense bursts. Train your attention like a muscle." : "Uninterrupted blocks where your best work actually happens."}</p>

      <QuoteBanner profile={profile} gz={gz} />

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24 }}>
        <div className="glass" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: 300 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {(gz
              ? [{ l: "Flow 20", w: 20, b: 5 }, { l: "Power 25", w: 25, b: 5 }, { l: "Zone 45", w: 45, b: 10 }]
              : [{ l: "Focus 50", w: 50, b: 10 }, { l: "Deep 90", w: 90, b: 20 }, { l: "Maker 120", w: 120, b: 30 }]
            ).map(s => (
              <button key={s.l} onClick={() => { setWorkMin(s.w); setBreakMin(s.b); setTimeLeft(s.w * 60); setPhase("work"); setRunning(false); }}
                className={`tab ${workMin === s.w ? (gz ? "atz" : "atm") : ""}`} style={{ padding: "6px 12px", fontSize: 12 }}>{s.l}</button>
            ))}
          </div>
          <div style={{ position: "relative", width: 200, height: 200 }}>
            <svg width="200" height="200" style={{ position: "absolute", top: 0, left: 0 }}>
              <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="7" />
              <circle cx="100" cy="100" r="88" fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={offset} transform="rotate(-90 100 100)"
                style={{ transition: "stroke-dashoffset 1s linear" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="h" style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-2px", color: col }}>{fmt(timeLeft)}</div>
              <div style={{ fontSize: 11, color: "var(--t2)", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 4 }}>{phase === "work" ? (gz ? "Focus Time" : "Deep Work") : "Break"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-gh" onClick={() => { clearInterval(intRef.current); setRunning(false); setPhase("work"); setTimeLeft(workMin * 60); }}>↺</button>
            <button className={btnClass} style={{ minWidth: 120, fontSize: 15 }} onClick={() => setRunning(r => !r)}>
              {running ? "⏸ Pause" : "▶ Start"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: i < (sessions % 4) ? col : "rgba(255,255,255,.12)", transition: "background .3s" }} />
            ))}
            <span style={{ fontSize: 11, color: "var(--t3)", marginLeft: 6 }}>Session {(sessions % 4) + 1} of 4</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="glass" style={{ padding: 18 }}>
            <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{gz ? "🧠 Lock In Mode" : "🧠 Deep Work Rules"}</h3>
            {(gz
              ? ["Phone on Do Not Disturb before you start", "One task only — your single most important thing", "Headphones on — brown noise or lo-fi beats", "Tabs: only what you need for this task", "After the timer — reward yourself before the next block"]
              : ["Close email and Slack — set status to focused", "Write your ONE key output before you start", "No context-switching — commit to this single work stream", "Schedule this block ahead of time, treat it like a meeting", "After 50 mins: walk, stretch, hydrate — then decide if you go again"]
            ).map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--t2)", marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ color: gz ? "var(--vzl)" : "var(--vml)", flexShrink: 0 }}>→</span>{tip}
              </div>
            ))}
          </div>
          <div className="glass" style={{ padding: 18 }}>
            <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📊 Today's Focus Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { v: sessions, l: "Sessions", c: gz ? "var(--vzl)" : "var(--vml)" },
                { v: `${totalMin}m`, l: "Focus Time", c: "var(--cz)" },
                { v: `${sessions * (gz ? 20 : 50)}m`, l: "Goal", c: "var(--a)" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center", padding: 12, background: "rgba(255,255,255,.02)", borderRadius: 10 }}>
                  <div className="h" style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STRESS RELIEF — Problem-Matched Coping Techniques
═══════════════════════════════════════════════════════ */
function StressRelief({ profile }) {
  const gz = isZ(profile);
  const [tab, setTab] = useState("techniques");
  const [bActive, setBActive] = useState(false);
  const [bPhase, setBPhase] = useState("inhale");
  const [bCount, setBCount] = useState(0);
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState([]);
  const [selMood, setSelMood] = useState(null);
  const [moodLog, setMoodLog] = useState([]);
  const bRef = useRef(null);
  const PHASES = ["inhale", "hold", "exhale", "hold"];
  const TIMES = [4000, 4000, 4000, 4000];
  const startBreath = () => { setBActive(true); let i = 0; const go = () => { setBPhase(PHASES[i % 4]); if (i % 4 === 3) setBCount(c => c + 1); bRef.current = setTimeout(go, TIMES[i % 4]); i++; }; go(); };
  const stopBreath = () => { setBActive(false); clearTimeout(bRef.current); };
  const INFO = { inhale: { text: "Breathe In", col: gz ? "#8b5cf6" : "#d97706" }, hold: { text: "Hold", col: "#22d3ee" }, exhale: { text: "Breathe Out", col: "#10b981" } };
  const ph = INFO[bPhase] || INFO.inhale;
  const bSize = bPhase === "exhale" ? 90 : (bPhase === "hold" ? 155 : bActive ? 155 : 100);
  const btnClass = gz ? "btn-z" : "btn-m";
  const tabActive = gz ? "atz" : "atm";
  const techniques = getCopingTechniques(profile.problems, gz);

  return (
    <div className="fade-up">
      <h1 className="h" style={{ fontSize: 27, fontWeight: 800, marginBottom: 5 }}>{gz ? "🧘 Decompress" : "🧘 Recovery Center"}</h1>
      <p style={{ color: "var(--t2)", marginBottom: 10, fontSize: 14 }}>{gz ? "Tools matched to YOUR problems — not generic wellness advice." : "Recovery tools built around what's actually draining you."}</p>

      {(profile.problems || []).length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {(profile.problems || []).slice(0, 4).map(p => (
            <span key={p} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: gz ? "rgba(139,92,246,.12)" : "rgba(217,119,6,.1)", border: `1px solid ${gz ? "rgba(139,92,246,.3)" : "rgba(217,119,6,.25)"}`, color: gz ? "var(--vzl)" : "var(--vml)" }}>
              {p.split(" ").slice(0, 4).join(" ")}…
            </span>
          ))}
          <span style={{ fontSize: 11, color: "var(--t3)", padding: "3px 6px" }}>← matched to these</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
        {["techniques", "breathing", "mood", "journal"].map(t => (
          <button key={t} className={`tab ${tab === t ? tabActive : ""}`} onClick={() => setTab(t)}>
            {t === "techniques" ? (gz ? "🎯 My Techniques" : "🔧 Recovery Tools") : t === "breathing" ? "🌬️ Breathing" : t === "mood" ? "😊 Mood" : "✍️ Journal"}
          </button>
        ))}
      </div>

      {tab === "techniques" && (
        <div>
          {(profile.problems || []).length === 0 && (
            <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(139,92,246,.07)", border: "1px solid rgba(139,92,246,.2)", marginBottom: 18, fontSize: 13, color: "var(--vzl)" }}>
              💡 Complete your profile to get coping techniques matched specifically to your challenges.
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14 }}>
            {techniques.map((x, idx) => (
              <div key={idx} className="glass" style={{ padding: 18 }}>
                <div style={{ fontSize: 26, marginBottom: 9 }}>{x.i}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
                  <h4 className="h" style={{ fontSize: 14, fontWeight: 700 }}>{x.t}</h4>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: gz ? "rgba(139,92,246,.14)" : "rgba(217,119,6,.12)", color: gz ? "var(--vzl)" : "var(--vml)", whiteSpace: "nowrap", marginLeft: 8 }}>{x.tag}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.75, marginBottom: 8 }}>{x.d}</p>
                {x.matchedProblem && (
                  <div style={{ fontSize: 10, color: "var(--t3)", borderTop: "1px solid var(--border)", paddingTop: 7, marginTop: 4 }}>
                    For: {x.matchedProblem.slice(0, 35)}{x.matchedProblem.length > 35 ? "…" : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "breathing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="glass" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <h3 className="h" style={{ fontSize: 15, fontWeight: 600, color: "var(--t2)" }}>Box Breathing · 4-4-4-4</h3>
            <div style={{ position: "relative", width: 185, height: 185, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: bSize, height: bSize, borderRadius: "50%", background: `radial-gradient(circle,${ph.col}35,${ph.col}10)`, border: `2px solid ${ph.col}55`, transition: `all ${bPhase === "hold" ? .05 : 4}s ease`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🌬️</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="h" style={{ fontSize: 22, fontWeight: 700, color: ph.col }}>{ph.text}</div>
              <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 3 }}>Cycle {bCount + 1} · 4 seconds per phase</div>
            </div>
            <button className={btnClass} onClick={bActive ? stopBreath : startBreath}>{bActive ? "⏹ Stop" : "▶ Begin"}</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="glass" style={{ padding: 18 }}>
              <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 9 }}>Why box breathing?</h3>
              <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.8 }}>{gz ? "Used by elite athletes and Navy SEALs to calm under pressure. Activates your parasympathetic nervous system — your built-in calm mode. 2–3 minutes produces measurable cortisol reduction." : "Clinically shown to reduce cortisol and activate the parasympathetic nervous system. Preferred by surgeons, pilots, and executives for high-pressure decision-making. 3–4 minutes for full effect."}</p>
            </div>
            {[{ t: "4-7-8 Breathing", d: "Inhale 4s, hold 7s, exhale 8s. Fastest for pre-sleep anxiety.", c: "var(--vzl)" }, { t: "Physiological Sigh", d: "Double inhale through nose + slow exhale. Fastest single-breath stress reset.", c: "var(--cz)" }].map(x => (
              <div key={x.t} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,.02)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: x.c, marginBottom: 4 }}>{x.t}</div>
                <div style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.6 }}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "mood" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="glass" style={{ padding: 24 }}>
            <h3 className="h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Log Your Mood</h3>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
              {MOODS.map(m => <button key={m.v} className={`mood-btn ${selMood?.v === m.v ? "sel" : ""}`} onClick={() => setSelMood(m)} title={m.l}>{m.e}</button>)}
            </div>
            {selMood && <p style={{ textAlign: "center", color: "var(--t2)", fontSize: 13, marginBottom: 14 }}>Feeling {selMood.l.toLowerCase()} · {BOT} will factor this in 🫂</p>}
            <button className={btnClass} style={{ width: "100%" }} disabled={!selMood} onClick={() => { if (selMood) { setMoodLog(m => [...m, { mood: selMood, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString() }]); setSelMood(null); } }}>Save Mood</button>
          </div>
          <div className="glass" style={{ padding: 24 }}>
            <h3 className="h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Mood History</h3>
            {moodLog.length === 0 ? <p style={{ color: "var(--t3)", fontSize: 13, textAlign: "center", padding: "28px 0" }}>Start tracking your emotional patterns 📊</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {moodLog.slice(-6).reverse().map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,.03)" }}>
                    <span style={{ fontSize: 20 }}>{e.mood.e}</span>
                    <span style={{ fontSize: 13, color: "var(--t)" }}>{e.mood.l}</span>
                    <span style={{ fontSize: 11, color: "var(--t3)" }}>{e.date} {e.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "journal" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="glass" style={{ padding: 24 }}>
            <h3 className="h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{gz ? "Brain Dump ✍️" : "Clarity Journal ✍️"}</h3>
            <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 14 }}>{gz ? "Write what's circling your head. No structure needed. Just let it out." : "What went well? What drained you? What will you protect tomorrow?"}</p>
            <textarea className="ifield" placeholder={gz ? "What's going on in that beautiful, overthinking brain of yours...?" : "What's on your mind? What's working? What needs to change?"} value={journal} onChange={e => setJournal(e.target.value)} style={{ minHeight: 140 }} />
            <button className={btnClass} style={{ width: "100%", marginTop: 12 }} onClick={() => { if (journal.trim()) { setEntries(e => [{ text: journal, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString() }, ...e]); setJournal(""); } }}>Save Entry ✓</button>
          </div>
          <div className="glass" style={{ padding: 24, overflowY: "auto", maxHeight: 400 }}>
            <h3 className="h" style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent Entries</h3>
            {entries.length === 0 ? <p style={{ color: "var(--t3)", fontSize: 13, textAlign: "center", padding: "28px 0" }}>Your journal awaits ✨</p> : entries.map((e, i) => (
              <div key={i} style={{ marginBottom: 10, padding: 12, borderRadius: 10, background: "rgba(255,255,255,.02)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: gz ? "var(--vzl)" : "var(--vml)" }}>{e.date}</span>
                  <span style={{ fontSize: 11, color: "var(--t3)" }}>{e.time}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.65 }}>{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GOALS
═══════════════════════════════════════════════════════ */
function Goals({ profile }) {
  const gz = isZ(profile);
  const [goals, setGoals] = useState(
    (profile.goals || []).map((g, i) => ({
      id: i, title: g, progress: 0,
      target: gz ? 10 : 5,
      done: 0,
      col: ["#8b5cf6", "#22d3ee", "#ec4899", "#d97706", "#10b981", "#f59e0b", "#a3e635", "#f43f5e", "#6b9e6b", "#c4b5fd"][i % 10],
      note: "",
    }))
  );
  const [editingId, setEditingId] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const btnClass = gz ? "btn-z" : "btn-m";

  const updateProgress = (id, delta) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress: Math.max(0, Math.min(100, g.progress + delta)) } : g));
  };

  return (
    <div className="fade-up">
      <h1 className="h" style={{ fontSize: 27, fontWeight: 800, marginBottom: 5 }}>{gz ? "🚀 My Quests" : "📌 Goals & KPIs"}</h1>
      <p style={{ color: "var(--t2)", marginBottom: 20, fontSize: 14 }}>{gz ? "Your real goals from Day 1. Track your actual progress — no fake numbers." : "Track your goals from Day 1 with real progress you input yourself."}</p>

      <QuoteBanner profile={profile} gz={gz} />
      <JourneyBanner profile={profile} gz={gz} />

      {goals.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>No goals set yet. Go back and set your goals in onboarding.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {goals.map(g => (
            <div key={g.id} className="glass" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: g.col, flexShrink: 0 }} />
                  <h4 className="h" style={{ fontSize: 15, fontWeight: 700 }}>{g.title}</h4>
                </div>
                <span className="h" style={{ fontSize: 18, fontWeight: 800, color: g.col }}>{g.progress}%</span>
              </div>
              <div className="prog-bar" style={{ marginBottom: 12 }}>
                <div style={{ height: "100%", borderRadius: 3, background: g.col, width: `${g.progress}%`, transition: "width .5s ease" }} />
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => updateProgress(g.id, -5)} className="btn-gh" style={{ padding: "6px 14px", fontSize: 13 }}>−5%</button>
                <button onClick={() => updateProgress(g.id, 5)} className={btnClass} style={{ padding: "6px 14px", fontSize: 13 }}>+5%</button>
                <button onClick={() => updateProgress(g.id, 10)} className={btnClass} style={{ padding: "6px 14px", fontSize: 13 }}>+10%</button>
                <input
                  placeholder="Add a note..."
                  value={editingId === g.id ? noteInput : g.note}
                  onFocus={() => { setEditingId(g.id); setNoteInput(g.note); }}
                  onChange={e => setNoteInput(e.target.value)}
                  onBlur={() => { setGoals(prev => prev.map(x => x.id === g.id ? { ...x, note: noteInput } : x)); setEditingId(null); }}
                  className="ifield"
                  style={{ flex: 1, minWidth: 180, padding: "7px 12px", fontSize: 12 }}
                />
              </div>
              {g.note && editingId !== g.id && (
                <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,.03)", fontSize: 12, color: "var(--t2)", border: "1px solid var(--border)" }}>
                  📝 {g.note}
                </div>
              )}
              {g.progress >= 100 && (
                <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)", fontSize: 13, color: "var(--g)", fontWeight: 600 }}>
                  🎉 Goal complete! Track your next milestone by adding a note.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MY JOURNEY — Full History Log
═══════════════════════════════════════════════════════ */
function JourneyLog({ profile, entries }) {
  const gz = isZ(profile);
  const [tab, setTab] = useState("timeline");
  const tabActive = gz ? "atz" : "atm";

  const moodEntries = entries.filter(e => e.mood);
  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((s, e) => s + (e.mood?.v || 0), 0) / moodEntries.length).toFixed(1)
    : "—";

  const chartData = entries.slice(-30).map((e, i) => ({
    day: `D${daysSince(e.date) > 0 ? daysSince(e.date) : i + 1}`,
    mood: e.mood?.v || null,
    burnout: e.burnoutLevel || null,
    balance: e.workLifeBalance || null,
    energy: e.energyLevel || null,
  })).filter(d => d.mood || d.burnout);

  return (
    <div className="fade-up">
      <h1 className="h" style={{ fontSize: 27, fontWeight: 800, marginBottom: 5 }}>📓 My Journey</h1>
      <p style={{ color: "var(--t2)", marginBottom: 20, fontSize: 14 }}>Every check-in since Day 1 — your real data, your real progress.</p>

      <JourneyBanner profile={profile} gz={gz} />

      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {["timeline", "trends", "insights"].map(t => (
          <button key={t} className={`tab ${tab === t ? tabActive : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {tab === "timeline" && (
        <div>
          {entries.length === 0 ? (
            <div className="glass" style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <p style={{ color: "var(--t2)", fontSize: 14 }}>Your journey log is empty. Start logging from the Dashboard!</p>
              <p style={{ color: "var(--t3)", fontSize: 12, marginTop: 8 }}>Started {formatDate(profile.startDate)}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...entries].reverse().map((e, i) => (
                <div key={i} className="glass" style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: gz ? "var(--vzl)" : "var(--vml)" }}>
                        {new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--t3)", marginLeft: 8 }}>
                        Day {daysSince(profile.startDate) - (entries.length - 1 - (entries.length - 1 - i))}
                      </span>
                    </div>
                    {e.mood && <span style={{ fontSize: 20 }}>{e.mood.e}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {e.mood && <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 20, background: "rgba(255,255,255,.05)", color: "var(--t2)" }}>Mood: {e.mood.l}</span>}
                    {e.burnoutLevel !== undefined && e.burnoutLevel > 0 && <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 20, background: e.burnoutLevel > 60 ? "rgba(244,63,94,.1)" : "rgba(16,185,129,.08)", color: e.burnoutLevel > 60 ? "var(--r)" : "var(--g)" }}>Burnout: {e.burnoutLevel}%</span>}
                    {e.workLifeBalance !== undefined && <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 20, background: "rgba(107,158,107,.1)", color: "var(--cm)" }}>Balance: {e.workLifeBalance}%</span>}
                    {e.energyLevel !== undefined && <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 20, background: "rgba(34,211,238,.08)", color: "var(--cz)" }}>Energy: {e.energyLevel}%</span>}
                    {e.scrollScore !== undefined && <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 20, background: "rgba(139,92,246,.1)", color: "var(--vzl)" }}>Screen-free: {e.scrollScore}%</span>}
                    {e.meetingLoad !== undefined && e.meetingLoad > 0 && <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 20, background: "rgba(245,158,11,.1)", color: "var(--a)" }}>Meetings: {e.meetingLoad}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "trends" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {chartData.length < 2 ? (
            <div className="glass" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--t2)", fontSize: 14 }}>Log at least 2 check-ins to see your trends.</p>
            </div>
          ) : (
            <>
              {chartData.some(d => d.mood) && (
                <div className="glass" style={{ padding: 20 }}>
                  <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Mood Trend (Day 1 → Now)</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={gz ? "#8b5cf6" : "#d97706"} stopOpacity={.5} />
                          <stop offset="95%" stopColor={gz ? "#8b5cf6" : "#d97706"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 5]} hide />
                      <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "white", fontSize: 12 }} />
                      <Area type="monotone" dataKey="mood" name="Mood (1–5)" stroke={gz ? "#8b5cf6" : "#d97706"} fill="url(#mg1)" strokeWidth={2} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {chartData.some(d => d.burnout) && (
                <div className="glass" style={{ padding: 20 }}>
                  <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Burnout Level Trend</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={.4} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "white", fontSize: 12 }} />
                      <Area type="monotone" dataKey="burnout" name="Burnout %" stroke="#f43f5e" fill="url(#bg1)" strokeWidth={2} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "insights" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 6 }}>
            {[
              { l: "Total Check-ins", v: entries.length, i: "📊", c: gz ? "var(--vzl)" : "var(--vml)" },
              { l: "Days Active", v: daysSince(profile.startDate), i: "📅", c: "var(--cz)" },
              { l: "Avg Mood", v: avgMood !== "—" ? `${avgMood}/5` : "—", i: "😊", c: "var(--g)" },
              { l: "Problems Tracked", v: (profile.problems || []).length, i: "🎯", c: "var(--a)" },
            ].map(s => (
              <div key={s.l} className="glass" style={{ padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{s.i}</div>
                <div className="h" style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "var(--t3)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: 20 }}>
            <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>🎯 Your Tracked Problems</h3>
            {(profile.problems || []).length === 0 ? (
              <p style={{ color: "var(--t3)", fontSize: 13 }}>No problems tracked yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(profile.problems || []).map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid var(--border)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: ["#8b5cf6","#22d3ee","#ec4899","#d97706","#10b981","#f59e0b","#a3e635","#f43f5e","#6b9e6b","#c4b5fd"][i % 10], flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--t)", flex: 1 }}>{p}</span>
                    <span style={{ fontSize: 11, color: gz ? "var(--vzl)" : "var(--vml)", fontWeight: 600 }}>Techniques ✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SAGE AI COACH
═══════════════════════════════════════════════════════ */
function SageCoach({ profile, entries }) {
  const gz = isZ(profile);
  const greeting = getGreeting(profile);
  const recentEntries = entries.slice(-5);
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content: `Hey${profile.name ? ` ${profile.name}` : ""} — I'm ${BOT}, your growth companion inside ${APP}. 👋\n\n${greeting}\n\nI know you're working on: **${(profile.goals || []).slice(0, 2).join(" & ")}** — and navigating: **${(profile.problems || []).slice(0, 2).join(" & ")}**.\n\nYou started your journey on ${formatDate(profile.startDate)} — that's Day ${daysSince(profile.startDate)} of your growth story.\n\nI'm built around your generation, your actual struggles, and your specific blocks. No generic advice.\n\nWhat's on your mind right now? 👇`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs]);

  const journeyContext = recentEntries.length > 0
    ? `\n\nRecent check-in data (last ${recentEntries.length} entries):\n${recentEntries.map(e => `- ${new Date(e.date).toLocaleDateString()}: Mood=${e.mood?.l || 'not logged'}, Burnout=${e.burnoutLevel ?? 'N/A'}%, Balance=${e.workLifeBalance ?? 'N/A'}%`).join("\n")}`
    : "";

  const systemPrompt = gz
    ? `You are ${BOT} — an emotionally intelligent AI growth companion inside ${APP}, built specifically for Gen Z users.\n\nUser profile:\n- Name: ${profile.name || "User"}\n- Generation: Gen Z (born 1997–2012)\n- Occupation: ${profile.occupation}\n- Goals: ${(profile.goals || []).join(", ")}\n- Struggles: ${(profile.problems || []).join(", ")}\n- Journey start: ${formatDate(profile.startDate)} (Day ${daysSince(profile.startDate)})${journeyContext}\n\nYour Gen Z communication style:\n- Casual, warm, direct — never preachy or condescending\n- Acknowledge the REAL pressures Gen Z faces: algorithmic comparison, uncertain economy, identity formation in public\n- Understand doom scrolling as psychology, not weakness — then help with it\n- Short-form first: lead with the key insight, expand if needed\n- Validate that their generation's challenges are genuinely different\n- Help with dopamine regulation, attention training, and delayed gratification in modern terms\n- Occasional humor is fine. Never be dismissive.\n- Reference their specific goals and problems when relevant\n- Keep under 200 words unless a detailed plan is genuinely needed`
    : `You are ${BOT} — a strategic AI growth coach inside ${APP}, built specifically for Millennial users.\n\nUser profile:\n- Name: ${profile.name || "User"}\n- Generation: Millennial (born 1981–1996)\n- Occupation: ${profile.occupation}\n- Goals: ${(profile.goals || []).join(", ")}\n- Struggles: ${(profile.problems || []).join(", ")}\n- Journey start: ${formatDate(profile.startDate)} (Day ${daysSince(profile.startDate)})${journeyContext}\n\nYour Millennial communication style:\n- Professional but warm — like a trusted mentor, not a therapy session\n- Respect their experience — they've tried things before; offer evolved perspectives\n- Be strategic and outcome-focused with concrete, implementable steps\n- Acknowledge that burnout is a SYSTEM problem, not a willpower problem\n- Help build sustainable systems, not heroic effort spikes\n- Reference their specific goals and problems when relevant\n- Keep under 200 words unless a detailed strategic plan is genuinely needed`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim(); setInput("");
    setMsgs(m => [...m, { role: "user", content: txt }]);
    setLoading(true);
    try {
      const history = [...msgs, { role: "user", content: txt }].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages: history }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: "assistant", content: data.content?.[0]?.text || "Brain glitch! 🫠 Try again?" }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Connection hiccup — check your network and try again." }]);
    }
    setLoading(false);
  };

  const quicks = gz
    ? ["Help me stop doom scrolling", "I feel burnt out from keeping up", "I'm procrastinating on everything", "I can't focus for more than 5 minutes", "Help me build morning discipline", "I compare myself to everyone online"]
    : ["I'm completely burnt out", "Work-life balance is gone", "I need a shutdown routine", "Help me stop overthinking at night", "I feel stuck in my career", "I need a recovery plan"];

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 90px)" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: gz ? "linear-gradient(135deg,#8b5cf6,#22d3ee)" : "linear-gradient(135deg,#d97706,#6b9e6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✨</div>
          <div>
            <h1 className="h" style={{ fontSize: 22, fontWeight: 800 }}>{BOT} — {gz ? "Your AI Growth Companion" : "Your Strategic Coach"}</h1>
            <p style={{ color: "var(--t2)", fontSize: 13 }}>{gz ? "Knows your goals, your struggles, and your journey. No generic advice." : "Strategic, warm, and experience-aware. Built around how you actually work."}</p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
        {quicks.map(q => <button key={q} className="chip" style={{ fontSize: 12 }} onClick={() => setInput(q)}>{q}</button>)}
      </div>
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 14, paddingRight: 4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 9, alignItems: "flex-end" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: gz ? "linear-gradient(135deg,#8b5cf6,#22d3ee)" : "linear-gradient(135deg,#d97706,#6b9e6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✨</div>
            )}
            <div style={{ maxWidth: "76%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 13, lineHeight: 1.8, color: "var(--t)", whiteSpace: "pre-wrap", background: m.role === "user" ? (gz ? "rgba(139,92,246,.22)" : "rgba(217,119,6,.18)") : "rgba(255,255,255,.05)", border: m.role === "user" ? `1px solid ${gz ? "rgba(139,92,246,.35)" : "rgba(217,119,6,.3)"}` : "1px solid var(--border)" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: gz ? "linear-gradient(135deg,#8b5cf6,#22d3ee)" : "linear-gradient(135deg,#d97706,#6b9e6b)", display: "flex", alignItems: "center", justifyContent: "center" }}>✨</div>
            <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: gz ? "var(--vzl)" : "var(--vml)", animation: `dotPulse 1.3s ease-in-out ${i * .22}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input className="ifield" placeholder={`Talk to ${BOT}…`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} style={{ resize: "none" }} />
        <button className={gz ? "btn-z" : "btn-m"} onClick={send} disabled={loading || !input.trim()} style={{ whiteSpace: "nowrap", minWidth: 88 }}>
          {loading ? "…" : "Send ↗"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ANALYTICS
═══════════════════════════════════════════════════════ */
function Analytics({ profile, entries }) {
  const gz = isZ(profile);
  const moodEntries = entries.filter(e => e.mood);
  const avgMood = moodEntries.length > 0 ? (moodEntries.reduce((s, e) => s + (e.mood?.v || 0), 0) / moodEntries.length).toFixed(1) : null;
  const burnoutEntries = entries.filter(e => e.burnoutLevel !== undefined && e.burnoutLevel > 0);
  const avgBurnout = burnoutEntries.length > 0 ? Math.round(burnoutEntries.reduce((s, e) => s + e.burnoutLevel, 0) / burnoutEntries.length) : null;
  const balanceEntries = entries.filter(e => e.workLifeBalance !== undefined);
  const avgBalance = balanceEntries.length > 0 ? Math.round(balanceEntries.reduce((s, e) => s + e.workLifeBalance, 0) / balanceEntries.length) : null;

  const chartData = entries.slice(-14).map((e, i) => ({
    day: `D${i + 1}`,
    mood: e.mood?.v || null,
    burnout: e.burnoutLevel || null,
    balance: e.workLifeBalance || null,
    energy: e.energyLevel || null,
  }));

  const habitData = [
    { n: "Mood Logs", v: Math.min(100, (moodEntries.length / Math.max(1, daysSince(profile.startDate))) * 100) },
    { n: "Check-ins", v: Math.min(100, (entries.length / Math.max(1, daysSince(profile.startDate))) * 100) },
    { n: "Avg Mood", v: avgMood ? (parseFloat(avgMood) / 5) * 100 : 0 },
    { n: "Balance", v: avgBalance || 0 },
    { n: "Recovery", v: avgBurnout ? 100 - avgBurnout : 0 },
    { n: "Streak", v: Math.min(100, (Math.min(7, entries.length) / 7) * 100) },
  ];

  return (
    <div className="fade-up">
      <h1 className="h" style={{ fontSize: 27, fontWeight: 800, marginBottom: 5 }}>📊 {gz ? "My Stats" : "Analytics"}</h1>
      <p style={{ color: "var(--t2)", marginBottom: 26, fontSize: 14 }}>{gz ? "Self-knowledge is a superpower. Here's your real data from Day 1." : "Data-driven clarity on where your energy is going — all from your actual inputs."}</p>

      <JourneyBanner profile={profile} gz={gz} />

      {entries.length === 0 ? (
        <div className="glass" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p style={{ color: "var(--t2)", fontSize: 14 }}>No data yet. Start logging check-ins from your Dashboard to see your analytics.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
            {[
              { l: "Days Active", v: daysSince(profile.startDate), i: "📅", c: gz ? "var(--vzl)" : "var(--vml)" },
              { l: "Total Check-ins", v: entries.length, i: "📊", c: "var(--cz)" },
              { l: "Avg Mood", v: avgMood ? `${avgMood}/5` : "—", i: "😊", c: "var(--g)" },
              { l: "Avg Burnout", v: avgBurnout ? `${avgBurnout}%` : "—", i: "🧠", c: avgBurnout > 60 ? "var(--r)" : "var(--a)" },
              { l: "Avg Balance", v: avgBalance ? `${avgBalance}%` : "—", i: "⚖️", c: avgBalance > 55 ? "var(--g)" : "var(--a)" },
            ].map(s => (
              <div key={s.l} className="glass" style={{ padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 5 }}>{s.i}</div>
                <div className="h" style={{ fontSize: 20, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "var(--t3)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
            {chartData.some(d => d.mood) && (
              <div className="glass" style={{ padding: 20 }}>
                <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Mood Trend (Last 14 entries)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gz ? "#8b5cf6" : "#d97706"} stopOpacity={.5} />
                        <stop offset="95%" stopColor={gz ? "#8b5cf6" : "#d97706"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} hide />
                    <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "white", fontSize: 12 }} />
                    <Area type="monotone" dataKey="mood" name="Mood (1–5)" stroke={gz ? "#8b5cf6" : "#d97706"} fill="url(#ag1)" strokeWidth={2} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="glass" style={{ padding: 20 }}>
              <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Overall Wellness Radar</h3>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={habitData}>
                  <PolarGrid stroke="rgba(255,255,255,.07)" />
                  <PolarAngleAxis dataKey="n" tick={{ fill: "#475569", fontSize: 11 }} />
                  <Radar dataKey="v" stroke={gz ? "#8b5cf6" : "#d97706"} fill={gz ? "#8b5cf6" : "#d97706"} fillOpacity={.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {chartData.some(d => d.burnout) && (
            <div className="glass" style={{ padding: 20, marginBottom: 18 }}>
              <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Burnout Level Over Time</h3>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData}>
                  <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, color: "white", fontSize: 12 }} />
                  <Bar dataKey="burnout" name="Burnout %" radius={[4, 4, 0, 0]}>
                    {chartData.map((d, i) => <Cell key={i} fill={d.burnout > 60 ? "#f43f5e" : d.burnout > 40 ? "#f59e0b" : "#10b981"} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="glass" style={{ padding: 20 }}>
            <h3 className="h" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>✨ {BOT}'s Pattern Recognition</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                entries.length >= 3 && avgMood && { t: `Your average mood over ${entries.length} check-ins is ${avgMood}/5. ${parseFloat(avgMood) >= 3.5 ? "You're maintaining a healthy baseline." : "There's room to improve — review your coping techniques."}`, c: "var(--cz)", type: "INSIGHT" },
                avgBurnout && { t: `Average burnout: ${avgBurnout}%. ${avgBurnout > 60 ? "This is above sustainable — prioritize recovery NOW." : avgBurnout > 40 ? "Moderate — watch for upward trends." : "You're managing well."}`, c: avgBurnout > 60 ? "var(--r)" : "var(--a)", type: "BURNOUT" },
                { t: `You've tracked ${(profile.problems || []).length} specific problems. Sage has matched coping techniques to each one in the Recovery tab.`, c: "var(--g)", type: "ACTION" },
                entries.length > 0 && { t: `Day ${daysSince(profile.startDate)} of your journey. ${entries.length} data points recorded. Keep showing up — consistency is the metric that matters.`, c: gz ? "var(--vzl)" : "var(--vml)", type: "JOURNEY" },
              ].filter(Boolean).map((x, i) => (
                <div key={i} style={{ padding: "11px 15px", borderRadius: 10, background: `${x.c}10`, border: `1px solid ${x.c}25`, fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>
                  <span style={{ color: x.c, fontWeight: 700, letterSpacing: ".5px" }}>{x.type} · </span>{x.t}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP — with persistent storage
═══════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("loading");
  const [activePage, setActivePage] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function init() {
      const savedProfile = await loadData("meridian-profile");
      const savedEntries = await loadData("meridian-entries");
      if (savedProfile) { setProfile(savedProfile); setEntries(savedEntries || []); setPage("app"); }
      else setPage("landing");
    }
    init();
  }, []);

  const handleDone = async (p) => {
    await saveData("meridian-profile", p);
    await saveData("meridian-entries", []);
    setProfile(p);
    setEntries([]);
    setPage("app");
  };

  const handleSaveEntry = async (entry) => {
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    await saveData("meridian-entries", newEntries);
  };

  const handleReset = async () => {
    try { localStorage.removeItem("meridian-profile"); localStorage.removeItem("meridian-entries"); } catch {}
    setProfile(null); setEntries([]); setPage("landing");
  };

  if (page === "loading") return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div className="h" style={{ fontSize: 20, fontWeight: 700, background: "linear-gradient(135deg,#c4b5fd,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loading {APP}...</div>
      </div>
    </>
  );
  if (page === "landing") return <><style>{STYLES}</style><Landing onStart={() => setPage("onboarding")} /></>;
  if (page === "onboarding") return <><style>{STYLES}</style><Onboarding onDone={handleDone} /></>;

  const gz = isZ(profile);
  const nav = gz ? GEN_Z_NAV : MILL_NAV;
  const sidebarGrad = gz ? "linear-gradient(135deg,#c4b5fd,#22d3ee,#ec4899)" : "linear-gradient(135deg,#fbbf24,#86efac)";
  const sidebarBg = gz ? "rgba(8,9,15,0.95)" : "rgba(13,11,9,0.95)";

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display: "flex", background: "var(--bg)", minHeight: "100vh" }}>
        <nav className="sidebar" style={{ background: sidebarBg }}>
          <div style={{ marginBottom: 28 }}>
            <div className="h" style={{ fontSize: 20, fontWeight: 800, background: sidebarGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 3, paddingLeft: 4 }}>{APP} ◈</div>
            <div style={{ fontSize: 11, color: "var(--t3)", paddingLeft: 4, marginBottom: 4 }}>{profile?.name || profile?.occupation || "Your space"}</div>
            <div style={{ fontSize: 11, padding: "3px 9px", borderRadius: 8, background: gz ? "rgba(139,92,246,.12)" : "rgba(217,119,6,.1)", color: gz ? "var(--vzl)" : "var(--vml)", fontWeight: 600, display: "inline-block" }}>
              {gz ? "Gen Z ⚡" : "Millennial 🏔️"}
            </div>
          </div>

          {nav.map(item => (
            <div key={item.id} className={`nav-item ${gz ? "nav-z" : "nav-m"} ${activePage === item.id ? "active" : ""}`} onClick={() => setActivePage(item.id)}>
              <span style={{ fontSize: 16 }}>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 20 }}>
            <div style={{ padding: "12px 10px", borderRadius: 12, background: gz ? "rgba(139,92,246,.09)" : "rgba(217,119,6,.08)", border: `1px solid ${gz ? "rgba(139,92,246,.18)" : "rgba(217,119,6,.18)"}`, marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: gz ? "var(--vzl)" : "var(--vml)", fontWeight: 700, marginBottom: 5 }}>📅 Day {daysSince(profile.startDate)}</div>
              <div className="prog-bar"><div className={gz ? "pfz" : "pfm"} style={{ width: `${Math.min(100, (entries.length / Math.max(7, entries.length + 1)) * 100)}%` }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
                <span style={{ fontSize: 11, color: "var(--t3)" }}>📊 {entries.length} check-ins</span>
                <span style={{ fontSize: 11, color: gz ? "var(--vzl)" : "var(--vml)" }}>Active</span>
              </div>
            </div>

            <div style={{ padding: "10px 10px", borderRadius: 10, background: "rgba(255,255,255,.02)", border: "1px solid var(--border)", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 4 }}>Powered by {BOT} AI</div>
              <div style={{ fontSize: 10, color: "var(--t3)" }}>Built on Claude · {APP} v3.0</div>
            </div>

            <button onClick={handleReset} style={{ width: "100%", background: "transparent", border: "1px solid rgba(244,63,94,.2)", color: "rgba(244,63,94,.6)", borderRadius: 8, padding: "7px 10px", fontSize: 11, cursor: "pointer" }}>↩ Reset Profile</button>
          </div>
        </nav>

        <main className="main">
          {activePage === "dashboard" && (gz
            ? <GenZDashboard profile={profile} entries={entries} onSave={handleSaveEntry} />
            : <MillennialDashboard profile={profile} entries={entries} onSave={handleSaveEntry} />
          )}
          {activePage === "focus" && <FocusRoom profile={profile} />}
          {activePage === "stress" && <StressRelief profile={profile} />}
          {activePage === "goals" && <Goals profile={profile} />}
          {activePage === "journal" && <JourneyLog profile={profile} entries={entries} />}
          {activePage === "sage" && <SageCoach profile={profile} entries={entries} />}
          {activePage === "analytics" && <Analytics profile={profile} entries={entries} />}
        </main>
      </div>
    </>
  );
}
