import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, Send, Printer, Share2, 
  Sparkles, CheckCircle2, ChevronRight, AlertCircle, 
  RotateCcw, ArrowRight, MessageCircle, Copy, Check,
  Layers, Filter, Edit3, Trash2, Plus, Download
} from 'lucide-react';
import { notify } from '../utils/notify';

export default function DateSheetPlannerView({
  bank = {},
  selectedClass: initialClass = '11th',
  paperConfig = {},
  currentUser = null,
  onGoToGenerator,
  onGenerateSpecificPaper
}) {
  // 1. Selection State
  const availableClasses = Object.keys(bank || {});
  const [selectedClass, setSelectedClass] = useState(
    availableClasses.includes(initialClass) ? initialClass : (availableClasses[0] || '11th')
  );

  const currentClassData = bank[selectedClass] || {};
  const availableSubjects = currentClassData.subjects || [];

  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    return availableSubjects[0]?.id || '';
  });

  // Keep subject updated if class changes
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.some(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(availableSubjects[0]?.id || '');
    }
  }, [selectedClass, availableSubjects]);

  const currentSubject = availableSubjects.find(s => s.id === selectedSubjectId) || availableSubjects[0] || {};
  const currentChapters = currentSubject.chapters || [];

  // 2. Planning Parameters
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getDefaultEndStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 20); // default 20 days span
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getDefaultEndStr());
  const [planMode, setPlanMode] = useState('topic'); // 'topic' | 'chapter' | 'half' | 'full'
  const [skipSundays, setSkipSundays] = useState(true);
  const [skipFridays, setSkipFridays] = useState(false);
  const [examStartTime, setExamStartTime] = useState('09:00 AM');
  const [examDuration, setExamDuration] = useState('45 Mins');
  const [academyName, setAcademyName] = useState(
    paperConfig.academyName || paperConfig.instituteName || 'AL-ZIA SCIENCE ACADEMY'
  );

  // Editable Generated Date-Sheet Table
  const [scheduleRows, setScheduleRows] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Helper: List of all valid working dates
  const generateWorkingDates = (startStr, endStr, noSundays, noFridays) => {
    const dates = [];
    let curr = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(curr.getTime()) || isNaN(end.getTime()) || curr > end) {
      return dates;
    }

    while (curr <= end) {
      const day = curr.getDay(); // 0 = Sunday, 5 = Friday
      let isOff = false;
      if (noSundays && day === 0) isOff = true;
      if (noFridays && day === 5) isOff = true;

      if (!isOff) {
        dates.push(new Date(curr));
      }
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // Helper: Extract all topics linearly
  const flattenedTopics = useMemo(() => {
    const list = [];
    currentChapters.forEach((ch, chIdx) => {
      const chNum = ch.chapterNumber || (chIdx + 1);
      const chName = ch.name || `Chapter ${chNum}`;
      (ch.topics || []).forEach((t, tIdx) => {
        const topNum = t.topicNumber || `${chNum}.${tIdx + 1}`;
        list.push({
          chapterNumber: chNum,
          chapterName: chName,
          topicId: t.id || `${ch.id || chNum}-top-${topNum}`,
          topicNumber: topNum,
          topicName: t.name || `Topic ${topNum}`,
          totalQuestions: (t.mcqs?.length || 0) + (t.shortQuestions?.length || 0) + (t.longQuestions?.length || 0)
        });
      });
    });
    return list;
  }, [currentChapters]);

  // Generate Date-Sheet Function
  const handleGenerateSchedule = () => {
    if (!startDate || !endDate) {
      notify.error("براہ کرم شروع اور اختتام کی تاریخ منتخب کریں۔ (Please select dates)");
      return;
    }

    const workingDates = generateWorkingDates(startDate, endDate, skipSundays, skipFridays);

    if (workingDates.length === 0) {
      notify.error("منتخب تاریخوں میں کوئی ورکنگ دن نہیں ملا۔ (No working days in range)");
      return;
    }

    let items = [];

    if (planMode === 'topic') {
      if (flattenedTopics.length === 0) {
        notify.warning("اس مضمون میں کوئی ٹاپکس دستیاب نہیں ہیں۔ (No topics found)");
        return;
      }

      // If available working dates >= topics, 1 topic per day
      // If dates < topics, cluster multiple topics per test
      const topicsCount = flattenedTopics.length;
      const daysCount = workingDates.length;

      if (daysCount >= topicsCount) {
        items = flattenedTopics.map((top, idx) => ({
          testNumber: idx + 1,
          date: workingDates[idx],
          scopeType: 'Topic-Wise Test',
          syllabus: `Ch ${top.chapterNumber} (Topic ${top.topicNumber}: ${top.topicName})`,
          chapterNumber: top.chapterNumber,
          topicIds: [top.topicId],
          details: `${top.chapterName} • Topic ${top.topicNumber}`
        }));
      } else {
        // Group topics evenly into available days
        const perDay = Math.ceil(topicsCount / daysCount);
        let currentTopicIdx = 0;

        for (let d = 0; d < daysCount && currentTopicIdx < topicsCount; d++) {
          const slice = flattenedTopics.slice(currentTopicIdx, currentTopicIdx + perDay);
          currentTopicIdx += perDay;

          if (slice.length > 0) {
            const firstT = slice[0];
            const lastT = slice[slice.length - 1];
            const syllabusStr = slice.length === 1
              ? `Ch ${firstT.chapterNumber} (Topic ${firstT.topicNumber}: ${firstT.topicName})`
              : `Ch ${firstT.chapterNumber} (Topic ${firstT.topicNumber} to ${lastT.topicNumber})`;

            items.push({
              testNumber: d + 1,
              date: workingDates[d],
              scopeType: `Topic-Wise (${slice.length} Topics)`,
              syllabus: syllabusStr,
              chapterNumber: firstT.chapterNumber,
              topicIds: slice.map(s => s.topicId),
              details: `${firstT.chapterName} • ${slice.length} Combined Topics`
            });
          }
        }
      }
    } else if (planMode === 'chapter') {
      if (currentChapters.length === 0) {
        notify.warning("اس مضمون میں کوئی چیپٹرز دستیاب نہیں ہیں۔");
        return;
      }

      const totalCh = currentChapters.length;
      const daysCount = workingDates.length;
      const step = Math.max(1, Math.floor(totalCh / daysCount) || 1);

      let chIdx = 0;
      for (let d = 0; d < daysCount && chIdx < totalCh; d++) {
        const chSlice = currentChapters.slice(chIdx, chIdx + step);
        chIdx += step;

        const chNums = chSlice.map(c => c.chapterNumber || c.id).join(', ');
        const chNames = chSlice.map(c => c.name || `Chapter ${c.chapterNumber}`).join(' & ');
        const tIds = chSlice.flatMap(c => (c.topics || []).map(t => t.id));

        items.push({
          testNumber: d + 1,
          date: workingDates[d],
          scopeType: chSlice.length > 1 ? `Combined Chapters (${chSlice.length})` : 'Full Chapter Test',
          syllabus: chSlice.length === 1 ? `Chapter ${chNums}: ${chNames}` : `Chapters ${chNums} Complete`,
          chapterNumber: chNums,
          topicIds: tIds,
          details: chNames
        });
      }
    } else if (planMode === 'half') {
      // 2 Half-Book Tests
      if (workingDates.length < 2) {
        notify.warning("ہاف بک ٹیسٹ کے لیے کم از کم 2 دن درکار ہیں۔");
        return;
      }
      const mid = Math.ceil(currentChapters.length / 2);
      const firstHalf = currentChapters.slice(0, mid);
      const secondHalf = currentChapters.slice(mid);

      items.push({
        testNumber: 1,
        date: workingDates[0],
        scopeType: '1st Half Book Test',
        syllabus: `1st Half Book (Chapters 1 to ${mid})`,
        chapterNumber: `1-${mid}`,
        topicIds: firstHalf.flatMap(c => (c.topics || []).map(t => t.id)),
        details: 'First 50% Comprehensive Syllabus Exam'
      });

      const secondDate = workingDates[Math.min(workingDates.length - 1, Math.floor(workingDates.length / 2))];
      items.push({
        testNumber: 2,
        date: secondDate,
        scopeType: '2nd Half Book Test',
        syllabus: `2nd Half Book (Chapters ${mid + 1} to ${currentChapters.length || 'End'})`,
        chapterNumber: `${mid + 1}-${currentChapters.length}`,
        topicIds: secondHalf.flatMap(c => (c.topics || []).map(t => t.id)),
        details: 'Second 50% Comprehensive Syllabus Exam'
      });
    } else if (planMode === 'full') {
      // Full Book / Pre-Board Tests
      items.push({
        testNumber: 1,
        date: workingDates[0],
        scopeType: 'Grand Pre-Board Test (Round 1)',
        syllabus: 'Complete Full Book (100% Syllabus)',
        chapterNumber: 'Full',
        topicIds: currentChapters.flatMap(c => (c.topics || []).map(t => t.id)),
        details: 'Board Pattern Full Length Examination'
      });

      if (workingDates.length >= 3) {
        items.push({
          testNumber: 2,
          date: workingDates[workingDates.length - 1],
          scopeType: 'Grand Final Revision Paper (Round 2)',
          syllabus: 'Full Book All Chapters (Target 100% Marks)',
          chapterNumber: 'Full',
          topicIds: currentChapters.flatMap(c => (c.topics || []).map(t => t.id)),
          details: 'High-Standard Board Model Examination'
        });
      }
    }

    setScheduleRows(items);
    setHasGenerated(true);
    notify.success(`${items.length} ٹیسٹ پیپرز کا شیڈول کامیابی سے تیار کر لیا گیا ہے۔ (Date-Sheet Created)`);
  };

  // Helper date formatter: "15-Oct-2026 (Monday)"
  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return String(dateObj);

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = String(d.getDate()).padStart(2, '0');
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();

    return `${dayNum}-${monthName}-${year} (${dayName})`;
  };

  // Update single row
  const handleUpdateRow = (index, field, value) => {
    setScheduleRows(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Delete row
  const handleDeleteRow = (index) => {
    setScheduleRows(prev => prev.filter((_, idx) => idx !== index));
    notify.info("ٹیسٹ رو ختم کر دی گئی۔");
  };

  // Add custom row
  const handleAddRow = () => {
    const nextNum = scheduleRows.length + 1;
    const lastDate = scheduleRows.length > 0 
      ? new Date(scheduleRows[scheduleRows.length - 1].date)
      : new Date();
    
    lastDate.setDate(lastDate.getDate() + 1);
    if (skipSundays && lastDate.getDay() === 0) {
      lastDate.setDate(lastDate.getDate() + 1);
    }

    setScheduleRows(prev => [
      ...prev,
      {
        testNumber: nextNum,
        date: lastDate,
        scopeType: 'Custom Test',
        syllabus: `Special Review Test ${nextNum}`,
        chapterNumber: 'Custom',
        topicIds: [],
        details: 'Teacher Defined Review Exam'
      }
    ]);
  };

  // 3. WhatsApp Message Generator
  const whatsAppMessage = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
    let msg = `📅 *${academyName.toUpperCase()}*\n`;
    msg += `🎯 *OFFICIAL TEST SESSION DATE-SHEET*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📚 *Subject:* ${currentSubject.name || 'Computer Science'}\n`;
    msg += `🎓 *Class:* ${selectedClass} Class\n`;
    msg += `⏱️ *Test Time:* ${examStartTime} (${examDuration})\n`;
    msg += `🗓️ *Date-Sheet Issued:* ${dateStr}\n`;
    msg += `🚫 *Sunday / Off Days:* Excluded\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `📋 *DETAILED SYLLABUS & TEST SCHEDULE:*\n\n`;

    scheduleRows.forEach((r, idx) => {
      msg += `🔹 *Test #${r.testNumber}:* ${formatDateDisplay(r.date)}\n`;
      msg += `   • *Scope:* ${r.scopeType}\n`;
      msg += `   • *Syllabus:* ${r.syllabus}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `⚠️ *Instructions for Students & Parents:*\n`;
    msg += `1. All students must arrive on time for each scheduled test.\n`;
    msg += `2. In case of any unforeseen closure, the test will be held on the next working day.\n`;
    msg += `3. Regular test attendance and syllabus preparation are mandatory.\n`;
    msg += `4. Test results will be communicated to parents on a regular basis.\n\n`;
    msg += `_Generated via PRO TEST MAKER Enterprise_`;

    return msg;
  }, [academyName, currentSubject, selectedClass, examStartTime, examDuration, scheduleRows]);

  const handleCopyWhatsApp = () => {
    if (!scheduleRows.length) return;
    navigator.clipboard.writeText(whatsAppMessage);
    setCopiedWhatsApp(true);
    notify.success("واٹس ایپ شیڈول میسج کاپی ہو گیا ہے۔ (Copied to Clipboard)");
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleOpenWhatsAppDirect = () => {
    if (!scheduleRows.length) return;
    const encoded = encodeURIComponent(whatsAppMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Export Date-Sheet directly as Editable Microsoft Word (.doc) document
  const handleExportDateSheetDocx = () => {
    if (!scheduleRows.length) {
      notify.warning("پہلے ٹیسٹ شیڈول بنائیں (Please generate schedule first)");
      return;
    }

    const tableRowsHtml = scheduleRows.map(r => `
      <tr>
        <td style="text-align: center; font-weight: bold; border: 1pt solid black; padding: 6pt;">${r.testNumber}</td>
        <td style="border: 1pt solid black; padding: 6pt; font-weight: bold;">${formatDateDisplay(r.date)}</td>
        <td style="border: 1pt solid black; padding: 6pt;">${r.scopeType}</td>
        <td style="border: 1pt solid black; padding: 6pt;">${r.syllabus}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${academyName} - Date Sheet</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #000; line-height: 1.4; }
          .header-box { text-align: center; border-bottom: 2pt solid black; padding-bottom: 10pt; margin-bottom: 15pt; }
          h1 { font-size: 20pt; margin: 0; text-transform: uppercase; letter-spacing: 1pt; }
          .badge { font-size: 12pt; font-weight: bold; margin-top: 4pt; text-transform: uppercase; }
          .meta-info { margin-top: 8pt; font-size: 11pt; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 15pt; margin-bottom: 15pt; }
          th { background-color: #f2f2f2; border: 1.5pt solid black; padding: 6pt; font-size: 10pt; text-transform: uppercase; text-align: left; }
          td { border: 1pt solid black; padding: 6pt; font-size: 10.5pt; }
          .instructions { margin-top: 20pt; font-size: 10pt; border-top: 1pt dashed black; padding-top: 8pt; }
          .signature-row { margin-top: 40pt; width: 100%; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h1>${academyName}</h1>
          <div class="badge">OFFICIAL TEST SESSION DATE-SHEET & SYLLABUS</div>
          <div class="meta-info">
            Class: ${selectedClass} Class &nbsp; | &nbsp; 
            Subject: ${currentSubject.name || 'Computer Science'} &nbsp; | &nbsp; 
            Test Time: ${examStartTime} (${examDuration}) &nbsp; | &nbsp; 
            Total Tests: ${scheduleRows.length}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50pt; text-align: center;">Test #</th>
              <th style="width: 140pt;">Date & Day</th>
              <th style="width: 120pt;">Test Scope</th>
              <th>Complete Syllabus / Topics Included</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="instructions">
          <strong>Instructions for Students & Parents:</strong><br/>
          1. All students must arrive on time for each scheduled test.<br/>
          2. In case of any unforeseen holiday or closure, the test will be conducted on the next working day.<br/>
          3. Full syllabus preparation according to the date-sheet is mandatory for all students.<br/>
          4. Test evaluation report and results will be shared with parents promptly.
        </div>

        <table style="width: 100%; border: none; margin-top: 35pt;">
          <tr style="border: none;">
            <td style="width: 50%; border: none; text-align: left;">
              ___________________________<br/>
              <strong>Subject Teacher Signature</strong>
            </td>
            <td style="width: 50%; border: none; text-align: right;">
              ___________________________<br/>
              <strong>Principal / Controller Signature</strong>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });

    const cleanSub = (currentSubject.name || 'Subject').replace(/\s+/g, '_');
    const filename = `Date_Sheet_${selectedClass}_Class_${cleanSub}.doc`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notify.success("ورڈ فائل (.doc) کامیابی سے ڈاؤنلوڈ ہو گئی ہے۔ (Word File Downloaded)");
  };

  // Direct 1-Click Paper Generation Hook
  const handleLaunchGeneratorForTest = (row) => {
    if (typeof onGenerateSpecificPaper === 'function') {
      onGenerateSpecificPaper({
        classKey: selectedClass,
        subjectId: currentSubject.id,
        topicIds: row.topicIds || [],
        syllabus: row.syllabus,
        testNumber: row.testNumber,
        examTitle: `${currentSubject.name} - Test ${row.testNumber} (${row.scopeType})`
      });
    } else if (typeof onGoToGenerator === 'function') {
      onGoToGenerator();
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. TOP TITLE BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Testing Schedule Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Date-Sheet & Monthly Syllabus Test Planner
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium">
            شروع اور اختتام کی تاریخ منتخب کریں—سسٹم اتوار کی چھٹی نکال کر خودکار ٹاپک وائز یا چیپٹر وائز ٹیسٹ ڈیٹ شیٹ اور واٹس ایپ نوٹس تیار کر دے گا۔
          </p>
        </div>

        {scheduleRows.length > 0 && (
          <div className="flex items-center gap-2 z-10 w-full md:w-auto flex-wrap">
            <button
              type="button"
              onClick={handleExportDateSheetDocx}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Download editable Microsoft Word Date-Sheet (.doc)"
            >
              <Download className="w-4 h-4" />
              <span>Save Word (.DOC)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Date-Sheet</span>
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsAppDirect}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Share</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. CONFIGURATION CONTROL DECK */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4 no-print">
        
        {/* Row A: Class, Subject, Academy Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Class Selector */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎓 Select Class</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {availableClasses.map(clsKey => (
                <option key={clsKey} value={clsKey}>
                  {bank[clsKey]?.className || `${clsKey} Class`}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>📚 Select Subject</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {availableSubjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.chapters?.length || 0} Chapters)
                </option>
              ))}
            </select>
          </div>

          {/* Academy Name */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏫 Academy / School Name</span>
            </label>
            <input
              type="text"
              value={academyName}
              onChange={(e) => setAcademyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. AL-ZIA SCIENCE ACADEMY"
            />
          </div>
        </div>

        {/* Row B: Dates, Test Scope Mode, Off Days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100">
          
          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Start Date (تاریخ آغاز)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>End Date (آخری تاریخ)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Planning Mode Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Test Scope (ٹیسٹ نوعیت)</span>
            </label>
            <select
              value={planMode}
              onChange={(e) => setPlanMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="topic">Topic-wise (ٹاپک وائز ٹیسٹ سیریز)</option>
              <option value="chapter">Chapter-wise (چیپٹر وائز راؤنڈ)</option>
              <option value="half">Half-Book (ہاف بک ٹیسٹ 1st & 2nd)</option>
              <option value="full">Full-Book / Pre-Board (فل بک ماڈل پیپرز)</option>
            </select>
          </div>

          {/* Off Days Flags */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Off Day Rules (چھٹی کا دن)</span>
            </label>
            <div className="flex items-center gap-3 pt-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skipSundays}
                  onChange={(e) => setSkipSundays(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Skip Sunday (اتوار چھٹی)</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skipFridays}
                  onChange={(e) => setSkipFridays(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Skip Friday</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
            <span>Available Topics in Pool: <strong className="text-blue-600">{flattenedTopics.length}</strong></span>
            <span>•</span>
            <span>Total Chapters: <strong className="text-blue-600">{currentChapters.length}</strong></span>
          </div>

          <button
            type="button"
            onClick={handleGenerateSchedule}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Official Date-Sheet (شیڈول بنائیں)</span>
          </button>
        </div>
      </div>

      {/* 3. GENERATED SCHEDULE TABLE & ACTION CANVAS */}
      {scheduleRows.length > 0 ? (
        <div className="space-y-4">
          
          {/* Action Deck for Table */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                Scheduled Tests: <strong className="text-blue-600 text-sm">{scheduleRows.length}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-medium">
                Click any syllabus or date to edit inline
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Custom Test</span>
              </button>

              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWhatsApp ? 'Copied Message' : 'Copy WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsAppDirect}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleExportDateSheetDocx}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Download editable Microsoft Word Date-Sheet (.doc)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Word (.DOC)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Sheet</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL PRINTABLE DATE-SHEET CARD */}
          <div className="printable-datesheet bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-8 shadow-sm space-y-4">
            
            {/* Institution Header for Print / Official Display */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">
                {academyName}
              </h2>
              <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-black uppercase tracking-widest">
                Official Examination Session & Date-Sheet
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700 pt-1.5">
                <span>Class: <strong>{selectedClass} Class</strong></span>
                <span>•</span>
                <span>Subject: <strong>{currentSubject.name}</strong></span>
                <span>•</span>
                <span>Total Tests: <strong>{scheduleRows.length}</strong></span>
                <span>•</span>
                <span>Timing: <strong>{examStartTime}</strong></span>
              </div>
            </div>

            {/* Interactive Schedule Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-black border-b-2 border-slate-300 uppercase text-[11px] tracking-wider">
                    <th className="p-3 border-r border-slate-300 w-14 text-center">Test #</th>
                    <th className="p-3 border-r border-slate-300 w-48">Date & Day</th>
                    <th className="p-3 border-r border-slate-300 w-48">Test Scope</th>
                    <th className="p-3 border-r border-slate-300">Complete Syllabus / Topics Included</th>
                    <th className="p-3 w-36 text-center no-print">Paper Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {scheduleRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      {/* Test Number */}
                      <td className="p-3 border-r border-slate-200 text-center font-black text-slate-800 bg-slate-50/50">
                        {row.testNumber}
                      </td>

                      {/* Date & Day */}
                      <td className="p-3 border-r border-slate-200 font-bold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 no-print" />
                          <span>{formatDateDisplay(row.date)}</span>
                        </div>
                      </td>

                      {/* Scope */}
                      <td className="p-3 border-r border-slate-200 font-semibold text-slate-700 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-bold border border-blue-200 text-xs shadow-2xs">
                          {row.scopeType}
                        </span>
                      </td>

                      {/* Syllabus (Editable on Click) */}
                      <td className="p-2 border-r border-slate-200 font-medium text-slate-800 min-w-[240px]">
                        <input
                          type="text"
                          value={row.syllabus}
                          onChange={(e) => handleUpdateRow(idx, 'syllabus', e.target.value)}
                          className="w-full bg-transparent hover:bg-slate-100/70 focus:bg-white focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-slate-300 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-900 transition-all"
                        />
                      </td>

                      {/* Paper Action (No-print) */}
                      <td className="p-2.5 text-center no-print whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleLaunchGeneratorForTest(row)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                            title="Generate test paper for this exact topic"
                          >
                            Generate Paper 📄
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete this test row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note & Signature Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
              <div className="space-y-1 text-[11px]">
                <p>• <strong>Instructions:</strong> All students must arrive on time for each scheduled test.</p>
                <p>• In case of any unforeseen holiday or closure, the test will be conducted on the next working day.</p>
                <p>• Full syllabus preparation according to the date-sheet is mandatory for all students.</p>
              </div>
              <div className="flex items-end gap-10 text-center font-bold text-slate-800">
                <div>
                  <div className="w-32 border-b-2 border-slate-700 mb-1"></div>
                  <span className="text-[11px]">Subject Teacher</span>
                </div>
                <div>
                  <div className="w-32 border-b-2 border-slate-700 mb-1"></div>
                  <span className="text-[11px]">Principal / Controller</span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. PREVIEW OF FORMATTED WHATSAPP MESSAGE */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Pre-Formatted WhatsApp Message for Parents / Students:</span>
              </div>
              <button
                type="button"
                onClick={handleCopyWhatsApp}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWhatsApp ? 'Copied' : 'Copy Message'}</span>
              </button>
            </div>

            <pre className="bg-white border border-emerald-200/80 rounded-xl p-3.5 text-xs text-slate-800 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {whatsAppMessage}
            </pre>
          </div>

        </div>
      ) : (
        /* Empty State / Prompt */
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center space-y-3 no-print">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            کوئی ٹیسٹ شیڈول منتخب نہیں کیا گیا۔ (No Schedule Generated Yet)
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            اوپر دیے گئے فارم سے تاریخ کا دورانیہ اور ٹیسٹ کی نوعیت (Topic-wise یا Chapter-wise) منتخب کر کے <strong>Generate Official Date-Sheet</strong> پر کلک کریں۔
          </p>
          <button
            type="button"
            onClick={handleGenerateSchedule}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>ابھی شیڈول بنائیں (Generate Now)</span>
          </button>
        </div>
      )}

    </div>
  );
}
