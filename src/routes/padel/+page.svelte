<script>
  import sols from '../../lib/solved.txt?raw';
  import { onMount } from 'svelte';
  import jsPDF from 'jspdf';

  const STORAGE_KEY = 'padel-planner-state';
  const RANDOMIZE_KEY = STORAGE_KEY + '-randomize';
  const MAX_PLAYERS = 20;
  let randomizeCounter = 0;

  let transposeTable = false;
  let removedPlayers = [];

  function updateTableOrientation() {
    const estimatedWidth = numRounds * 160 + 120;
    transposeTable = estimatedWidth < window.innerWidth;
  }

  let players = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `Player${i}`
  }));

  let startTime = '15:00'; // HH:MM
  let durationMinutes = 90;   // HH:MM

  let numRounds = 9;
  let numCourts = 2;
  let optimality = 3;
  let numPlayers = players.length;

  // Flag to prevent saving before state is loaded
  let stateLoaded = false;

  onMount(() => {
    // Restore state from localStorage
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);

        if (Array.isArray(saved.players)) {
          players = [...saved.players];
        }

        if (typeof saved.numRounds === 'number') {
          numRounds = saved.numRounds;
        }

        if (typeof saved.numCourts === 'number') {
          numCourts = saved.numCourts;
        }

        if (typeof saved.optimality === 'number') {
          optimality = saved.optimality;
        }

        if (typeof saved.startTime === 'string') {
          startTime = saved.startTime;
        }
        if (typeof saved.durationMinutes === 'number') {
          durationMinutes = saved.durationMinutes;
        }
      } catch {
        // ignore corrupted storage
      }
    }

    const rawRemoved = localStorage.getItem(STORAGE_KEY + '-removed');
    if (rawRemoved) {
      try {
        removedPlayers = JSON.parse(rawRemoved);
      } catch {}
    }

    const rawRandomize = localStorage.getItem(RANDOMIZE_KEY);
    if (rawRandomize) {
      const parsed = Number(rawRandomize);
      if (!Number.isNaN(parsed)) {
        randomizeCounter = parsed;
      }
    }

    // After restoring, allow saving
    stateLoaded = true;

    updateTableOrientation();
    window.addEventListener('resize', updateTableOrientation);
  });


  function exportSchedulePDF() {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    const margin = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    /* =========================
     * TITLE
     * ========================= */
    pdf.setFontSize(16);
    pdf.text('Padel Tournament Schedule', margin, y);
    y += 24;

    pdf.setFontSize(10);
    pdf.text(
      `Players: ${players.length}   Courts: ${numCourts}   Rounds: ${numRounds}`,
      margin,
      y
    );
    y += 20;

    /* =========================
     * SCHEDULE TABLE
     * ========================= */
    const roundColWidthSchedule = 80;
    const maxCourts = Math.min(numCourts, 5);
    const scoreColWidth = maxCourts >= 5 ? 45 : maxCourts >= 4 ? 70 : 100; // narrower for 5 courts
    const baseCourtColWidth = (pageWidth - margin * 2 - roundColWidthSchedule - maxCourts * scoreColWidth) / maxCourts; // slightly narrower score column
    const rowHeight = 40;

    // HEADER
    pdf.setFontSize(10);
    pdf.setDrawColor(0);
    pdf.setLineWidth(1);

    pdf.rect(margin, y, roundColWidthSchedule, rowHeight);
    pdf.text('Round', margin + roundColWidthSchedule / 2, y + 15, { align: 'center' });

    for (let c = 0; c < maxCourts; c++) {
      const x = margin + roundColWidthSchedule + c * (baseCourtColWidth + scoreColWidth);

      pdf.rect(x, y, baseCourtColWidth, rowHeight);
      pdf.text(`Court ${c + 1}`, x + baseCourtColWidth / 2, y + 15, { align: 'center' });

      pdf.rect(x + baseCourtColWidth, y, scoreColWidth, rowHeight);
      pdf.text('Score', x + baseCourtColWidth + scoreColWidth / 2, y + 15, { align: 'center' });
    }
    y += rowHeight;

    // TABLE BODY
    schedule.forEach((round, roundIndex) => {
      if (y + rowHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Round column
      pdf.rect(margin, y, roundColWidthSchedule, rowHeight);
      const roundLabel = `Round ${roundIndex + 1}`;
      let roundTimeText = '';
      if (roundTimes?.[roundIndex]) {
        const rt = roundTimes[roundIndex];
        roundTimeText =
          typeof rt === 'string'
            ? rt
            : rt?.time || `${rt?.start || ''} - ${rt?.end || ''}`;
      }
      pdf.setFontSize(10);
      pdf.text(`${roundLabel}\n${roundTimeText}`, margin + roundColWidthSchedule / 2 - 2, y + rowHeight / 2 - 2, { align: 'center' });

      round.forEach((match, courtIndex) => {
        if (courtIndex >= maxCourts) return;

        const x = margin + roundColWidthSchedule + courtIndex * (baseCourtColWidth + scoreColWidth);

        // Draw court cell
        pdf.rect(x, y, baseCourtColWidth, rowHeight);

        const team1 = `${players[match[0][0]].name} & ${players[match[0][1]].name}`;
        const team2 = `${players[match[1][0]].name} & ${players[match[1][1]].name}`;

        // Horizontal centering within the court cell
        const centerX = x + baseCourtColWidth / 2;

        let f = 11;
        pdf.setFontSize(f);
        while (pdf.getTextWidth(team1) >= baseCourtColWidth - 12) {
            f = f <= 1 ? f / 2 : f - 1;
            pdf.setFontSize(f);
        }
        pdf.text(team1, centerX - 5, y + 13, { align: 'center' });

        pdf.setFontSize(7);
        pdf.text('vs', centerX, y + 22, { align: 'center' }); // slightly lower than before

        f = 11;
        pdf.setFontSize(f);
        while (pdf.getTextWidth(team2) >= baseCourtColWidth - 12) {
            f = f <= 1 ? f / 2 : f - 1;
            pdf.setFontSize(f);
        }
        pdf.text(team2, centerX - 5, y + 34, { align: 'center' });

        // Score box
        pdf.rect(x + baseCourtColWidth, y, scoreColWidth, rowHeight);
      });

      y += rowHeight;
    });

    /* =========================
     * PLAYER SCORE SHEET
     * ========================= */
    pdf.addPage();
    y = margin;

    // Title
    pdf.setFontSize(16);
    pdf.text('Player Score Sheet', margin, y);
    y += 24;

    // Table settings
    const headerHeight = 28;
    const rowHeightScore = players.length >= 19 ? 22 : 24; // fits 20 players

    // Fixed widths for last 3 columns
    const totalColWidth = 50;
    const matchesColWidth = 50;
    const scoreColWidthPDF = 50;

    // Base font for names
    const baseFontSize = 10;
    pdf.setFontSize(baseFontSize);

    // Determine max width of names
    let nameColWidthPDF = 0;
    players.forEach(p => {
      const w = pdf.getTextWidth(p.name)*1.3 + 5; // padding
      if (w > nameColWidthPDF) nameColWidthPDF = w;
    });

    // Calculate remaining width for rounds
    let remainingWidth = pageWidth - margin * 2 - nameColWidthPDF - totalColWidth - matchesColWidth - scoreColWidthPDF;
    let roundColWidth = remainingWidth / numRounds;

    // Reduce name font if needed
    let nameFontSize = baseFontSize;
    if (roundColWidth < 40) {
      roundColWidth = 40;
      nameColWidthPDF = pageWidth - margin * 2 - roundColWidth * numRounds - totalColWidth - matchesColWidth - scoreColWidthPDF;

      const maxTextWidth = nameColWidthPDF - 8; // padding
      let longestNameWidth = 0;
      pdf.setFontSize(baseFontSize);
      players.forEach(p => {
        const w = pdf.getTextWidth(p.name) * 1.3;
        if (w > longestNameWidth) longestNameWidth = w;
      });

      if (longestNameWidth > maxTextWidth) {
        nameFontSize = baseFontSize * (maxTextWidth / longestNameWidth);
      }
    }

    // HEADER
    let x = margin;
    const numCols = 1 + numRounds + 3; // Name + rounds + Total + Matches + Score
    const headers = [
      'Name',
      ...Array.from({ length: numRounds }, (_, i) => `Round ${i + 1}`),
      'Total',
      'Matches',
      'Score'
    ];

    headers.forEach((h, idx) => {
      let w;
      if (idx === 0) w = nameColWidthPDF;
      else if (idx === numCols - 3) w = totalColWidth;
      else if (idx === numCols - 2) w = matchesColWidth;
      else if (idx === numCols - 1) w = scoreColWidthPDF;
      else w = roundColWidth;

      pdf.setLineWidth(0.2);
      pdf.rect(x, y, w, headerHeight);
      pdf.setFontSize(8);
      pdf.text(h, x + w / 2 - 2, y + headerHeight / 2 + 4, { align: 'center' });
      x += w;
    });
    y += headerHeight;

    // Calculate matches per player
    const playerMatches = players.map((p, i) => {
      let total = 0;
      const rounds = Array(numRounds).fill('✗'); // ✗ for byes
      schedule.forEach(round => {
        round.forEach(match => {
          const allPlayers = [...match[0], ...match[1]];
          if (allPlayers.includes(i)) {
            total++;
            rounds[schedule.indexOf(round)] = ''; // played this round
          }
        });
      });
      return { total, rounds };
    });

    // PLAYER ROWS
    players.forEach((player, i) => {
      x = margin;

      // Name cell
      pdf.setFontSize(nameFontSize);
      pdf.rect(x, y, nameColWidthPDF, rowHeightScore);
      pdf.text(player.name, x + nameColWidthPDF / 2 - 2, y + rowHeightScore / 2 + 4, { align: 'center' });
      x += nameColWidthPDF;

      // Round cells + Total + Matches + Score
      const rowCells = [
        ...playerMatches[i].rounds,
        '',
        playerMatches[i].total.toString(),
        ''
      ];
      pdf.setFontSize(10);

      rowCells.forEach((cell, idx) => {
        let w;
        const colIdx = idx + 1; // after name
        if (colIdx === numCols - 3) w = totalColWidth;
        else if (colIdx === numCols - 2) w = matchesColWidth;
        else if (colIdx === numCols - 1) w = scoreColWidthPDF;
        else w = roundColWidth;

        pdf.setLineWidth(0.2);
        pdf.rect(x, y, w, rowHeightScore);

        if (cell === '✗') {
          // Big visible cross
          pdf.setLineWidth(1.5);
          pdf.line(x + 2, y + 2, x + w - 2, y + rowHeightScore - 2);
          pdf.line(x + w - 2, y + 2, x + 2, y + rowHeightScore - 2);
          pdf.setLineWidth(0.2);
        } else {
          pdf.text(cell, x + w / 2, y + rowHeightScore / 2 + 4, { align: 'center' });
        }

        x += w;
      });

      y += rowHeightScore;
    });

    // Draw thicker border around Total → Matches → Score block
    let borderX = margin + nameColWidthPDF + roundColWidth * numRounds;
    let borderY = margin + 24 + headerHeight;
    let borderWidth = totalColWidth + matchesColWidth + scoreColWidthPDF;
    let borderHeight = rowHeightScore * players.length;
    pdf.setLineWidth(2);
    pdf.rect(borderX, borderY, borderWidth, borderHeight);

    // Header thicker border
    borderY = margin + 24;
    borderHeight = headerHeight;
    pdf.rect(borderX, borderY, borderWidth, borderHeight);


    pdf.save('padel-schedule.pdf');
  }





  // Only save state after it has been loaded
  $: if (stateLoaded) {
    const state = { players, numRounds, numCourts, optimality, startTime, durationMinutes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function minutesToTime(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  $: roundTimes = (() => {
    if (!numRounds || !startTime || !durationMinutes) return [];

    const start = timeToMinutes(startTime);
    const total = durationMinutes;

    const baseDuration = Math.floor(total / numRounds);
    const remainder = total % numRounds; // extra minutes to distribute

    let accumulated = start;

    return Array.from({ length: numRounds }, (_, i) => {
      // Add 1 extra minute to the first 'remainder' rounds
      const thisRoundDuration = baseDuration + (i < remainder ? 1 : 0);

      const roundStart = accumulated;
      const roundEnd = accumulated + thisRoundDuration;
      accumulated = roundEnd; // next round starts where this one ended

      return {
        start: minutesToTime(roundStart),
        end: minutesToTime(roundEnd)
      };
    });
  })();

  // Seeded random generator (Mulberry32)
  function mulberry32(seed) {
    return function() {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Shuffle array deterministically with seed
  function shuffleArray(array, seed) {
    const random = mulberry32(seed >>> 0);
    const arr = array.slice(); // copy
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  $: seed = numPlayers * 10000 + numCourts * 100 + numRounds + randomizeCounter;

  $: if (stateLoaded) {
    localStorage.setItem(RANDOMIZE_KEY, String(randomizeCounter));
  }

  // -----------------------------
  // Shuffle the schedule
  // -----------------------------
  function shuffleSchedule(schedule, seed) {
    let s = seed;

    // Shuffle rounds
    let newSchedule = shuffleArray(schedule, s);
    s++;

    let a = Array.from({ length: numPlayers }, (_, i) => i);
    a = shuffleArray(a, s);

    // Shuffle courts and player sides within each round
    newSchedule = newSchedule.map(round => {
      s++;
      // Shuffle the courts
      let shuffledCourts = shuffleArray(round, s);

      // Swap players within each match randomly
      shuffledCourts = shuffledCourts.map(court => {
        let c = [[a[court[0][0]], a[court[0][1]]], [a[court[1][0]], a[court[1][1]]]];
        s++;
        return shuffleArray(c, s);
      });

      return shuffledCourts;
    });

    return newSchedule;
  }

  /* -----------------------------
   * Parse solved.txt
   * ----------------------------- */
  function parseLine(line) {
    const firstBracket = line.indexOf('[');
    const header = line.slice(0, firstBracket).trim();
    const body = line.slice(firstBracket);

    const [optimality, playersCount, courts, rounds] = header.split(' ').map(Number);
    const jsonCompatible = body.replace(/\(/g, '[').replace(/\)/g, ']');
    const schedule = JSON.parse(jsonCompatible);

    return { players: playersCount, courts, rounds, schedule, optimality };
  }

  export function load() {
    const solutions = sols
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(parseLine);
    return { solutions };
  }

  const { solutions } = load();

  /* -----------------------------
   * Reactive derived values
   * ----------------------------- */
  $: numPlayers = players.length;

  let prevPlayers = -1;
  $: if (stateLoaded) {
    prevPlayers = numPlayers;
  }
  $: if (stateLoaded && numPlayers !== prevPlayers && prevPlayers != -1) {
    numCourts = Math.floor(numPlayers / 4);
    prevPlayers = numPlayers;
  }

  $: selectedSolution = solutions.find(
    s => s.players === numPlayers && s.courts === numCourts && s.rounds === numRounds
  );

  $: baseSchedule = selectedSolution?.schedule ?? [];

  $: schedule =
    baseSchedule && baseSchedule.length
      ? shuffleSchedule(baseSchedule, seed)
      : [];

  $: optimality = selectedSolution.optimality;

  // -----------------------------
  // Count statistics
  // -----------------------------
  $: stats = computeStats(schedule, players.length);

  function computeStats(schedule, numPlayers) {
    const teammates = Array.from({ length: numPlayers }, () => Array(numPlayers).fill(0));
    const opponents = Array.from({ length: numPlayers }, () => Array(numPlayers).fill(0));
    const byes = Array(numPlayers).fill(0);

    schedule.forEach(round => {
      // Track which players played this round
      const playedThisRound = new Set();

      round.forEach(match => {
        const [team1, team2] = match;
        const [a, b] = team1;
        const [c, d] = team2;

        // Mark teammates
        teammates[a][b]++;
        teammates[b][a]++;
        teammates[c][d]++;
        teammates[d][c]++;

        // Mark opponents
        opponents[a][c]++;
        opponents[a][d]++;
        opponents[b][c]++;
        opponents[b][d]++;
        opponents[c][a]++;
        opponents[c][b]++;
        opponents[d][a]++;
        opponents[d][b]++;

        // Mark as played
        [a, b, c, d].forEach(p => playedThisRound.add(p));
      });

      // Any player not in playedThisRound had a bye
      for (let p = 0; p < numPlayers; p++) {
        if (!playedThisRound.has(p)) byes[p]++;
      }
    });

    // Compute max differences
    let maxWaitDiff = Math.max(...byes) - Math.min(...byes);

    let maxTeammateDiff = 0;
    let maxOpponentDiff = 0;
    let maxEncounterDiff = 0;

    for (let i = 0; i < numPlayers; i++) {
      for (let j = i + 1; j < numPlayers; j++) {
        maxTeammateDiff = Math.max(maxTeammateDiff, teammates[i][j]);
        maxOpponentDiff = Math.max(maxOpponentDiff, opponents[i][j]);
        maxEncounterDiff = Math.max(maxEncounterDiff, teammates[i][j] + opponents[i][j]);
      }
    }

    // To get the "difference" instead of the max alone, subtract the min
    let minTeammate = Infinity, minOpponent = Infinity, minEncounter = Infinity;
    for (let i = 0; i < numPlayers; i++) {
      for (let j = i + 1; j < numPlayers; j++) {
        minTeammate = Math.min(minTeammate, teammates[i][j]);
        minOpponent = Math.min(minOpponent, opponents[i][j]);
        minEncounter = Math.min(minEncounter, teammates[i][j] + opponents[i][j]);
      }
    }

    maxTeammateDiff -= minTeammate;
    maxOpponentDiff -= minOpponent;
    maxEncounterDiff -= minEncounter;

    return {
      teammates,
      opponents,
      byes,
      maxWaitDiff,
      maxTeammateDiff,
      maxOpponentDiff,
      maxEncounterDiff
    };
  }


  // Save removed players whenever it changes
  $: localStorage.setItem(STORAGE_KEY + '-removed', JSON.stringify(removedPlayers));


  /* -----------------------------
   * Player add/remove
   * ----------------------------- */
  function addPlayer() {
    if (players.length >= MAX_PLAYERS) return;

    let playerToAdd;

    if (removedPlayers.length) {
      // Restore the most recently removed player
      playerToAdd = removedPlayers.pop();
    } else {
      // Add new generic player
      const id = players.length ? Math.max(...players.map(p => p.id)) + 1 : 0;
      playerToAdd = { id, name: `Player${id}` };
    }

    players = [...players, playerToAdd];
  }

  function removePlayer(index) {
    if (players.length <= 4) return;

    // Save removed player in the removedPlayers array
    removedPlayers.push(players[index]);

    // Remove from current players
    players = [...players.slice(0, index), ...players.slice(index + 1)];
  }

  // Adjusts a HH:MM string by delta minutes (+/-)
  function adjustTime(timeStr, delta) {
    const [h, m] = timeStr.split(':').map(Number);
    let total = h * 60 + m + delta;
    if (total < 0) total += 24 * 60;
    if (total >= 24 * 60) total -= 24 * 60;
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  function normalizeTime30(value) {
    if (!value) return '';

    const match = value.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match) return value;

    let h = Math.min(23, Number(match[1]));
    let m = Number(match[2]);

    // Snap to nearest 30
    m = m < 15 ? 0 : m < 45 ? 30 : 0;
    if (m === 0 && Number(match[2]) >= 45) {
      h = Math.min(23, h + 1);
    }

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function minutesToDurationLabel(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h${m}m`;
  }

  $: endTimeMinutes =
    timeToMinutes(startTime) + durationMinutes;

  $: endTime = minutesToTime(endTimeMinutes);


  /* -----------------------------
   * Drag & Drop
   * ----------------------------- */
  let draggedIndex = null;
  function onDragStart(index) {
    draggedIndex = index;
  }

  function onDrop(index) {
    const temp = players[draggedIndex];
    players[draggedIndex] = players[index];
    players[index] = temp;
    draggedIndex = null;
  }
</script>


<div class="bg-default p-6">
    <div style="--players: {players.length}" class="mx-auto max-w-[clamp(700px,calc(700px+65px*var(--players)),1700px)]">

    <!-- ===================== -->
    <!-- Top row: Players + Controls -->
    <!-- ===================== -->
    <div class="flex flex-col md:flex-row justify-center gap-6">
      <!-- ===================== -->
      <!-- Controls (RIGHT) -->
      <!-- ===================== -->
      <div class="shrink-0">
        <div class="rounded-xl bg-block p-4 shadow lg:w-[28rem]">
          <div class="flex flex-col gap-4 items-center">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
              <!-- Number of Rounds -->
              <div class="flex flex-col items-center">
                <div class="mb-1 text-sm font-medium text-on-block">Rounds</div>
                <div class="flex items-center space-x-2">
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => numRounds = Math.max(1, numRounds - 1)}
                  >-</button>
                  <span class="w-8 text-center font-semibold text-on-block">{numRounds}</span>
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => numRounds = Math.min(10, numRounds + 1)}
                  >+</button>
                </div>
              </div>

              <!-- Number of Courts -->
              <div class="flex flex-col items-center">
                <div class="mb-1 text-sm font-medium text-on-block">Courts</div>
                <div class="flex items-center space-x-2">
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => numCourts = Math.max(1, numCourts - 1)}
                  >-</button>
                  <span class="w-8 text-center font-semibold text-on-block">{numCourts}</span>
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => numCourts = Math.min(Math.floor(numPlayers / 4), numCourts + 1)}
                  >+</button>
                </div>
              </div>

              <!-- Start Time -->
              <div class="flex flex-col items-center">
                <div class="mb-1 text-sm font-medium text-on-block">Start Time</div>
                <div class="flex items-center space-x-2">
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => startTime = adjustTime(startTime, -30)}
                  >-</button>
                  <input
                    type="time"
                    bind:value={startTime}
                    on:blur={() => startTime = normalizeTime30(startTime)}
                    class="w-24 text-center rounded px-2 py-1 bg-block text-on-block font-semibold [&::-webkit-calendar-picker-indicator]:hidden"
                  />
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => startTime = adjustTime(startTime, 30)}
                  >+</button>
                </div>
              </div>

              <!-- Total Duration -->
              <div class="flex flex-col items-center">
                <div class="mb-1 text-sm font-medium text-on-block">Duration</div>

                <div class="flex items-center space-x-2">
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => durationMinutes = Math.max(30, durationMinutes - 30)}
                  >-</button>
                  <span class="w-12 text-center font-semibold text-on-block">{minutesToDurationLabel(durationMinutes)}</span>
                  <button
                    class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 font-bold"
                    on:click={() => durationMinutes = durationMinutes + 30}
                  >+</button>
                </div>
              </div>
            </div>

            <div>
              {#if stats.maxOpponentDiff == 2 && stats.maxEncounterDiff == 2}
                  <p class="text-on-block text-white text-xs">
                      Badness: 3 (doesn't get worse).
                      Change the number of rounds
                  </p>
              {:else if stats.maxOpponentDiff == 2 && stats.maxEncounterDiff == 1}
                  <p class="text-on-block text-white text-xs">
                      Badness: 2 (pretty bad).
                      Change the number of rounds
                  </p>
              {:else if stats.maxOpponentDiff == 1 && stats.maxEncounterDiff == 2}
                  <p class="text-on-block text-white text-xs">
                      Somewhat optimal,
                      maybe change the
                      number of rounds
                  </p>
              {:else if stats.maxOpponentDiff == 1 && stats.maxEncounterDiff == 1}
                  <p class="text-on-block text-white text-xs">
                      Pretty optimal!
                  </p>
              {:else if stats.maxOpponentDiff == 1 && stats.maxEncounterDiff == 0}
                  <p class="text-on-block text-white text-xs">
                      Very optimal!
                  </p>
              {:else if stats.maxOpponentDiff == 0 && stats.maxEncounterDiff == 1}
                  <p class="text-on-block text-white text-xs">
                      Strangely optimal.
                  </p>
              {:else if stats.maxOpponentDiff == 0 && stats.maxEncounterDiff == 0}
                  <p class="text-on-block text-white text-xs">
                      Extremely optimal!
                  </p>
              {:else}
                  <p class="text-on-block text-white text-xs">
                      UNKNOWN SCHEDULE OPTIMALITY
                  </p>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- ===================== -->
      <!-- Players (LEFT) -->
      <!-- ===================== -->
      <div class="rounded-xl bg-block p-3 w-full shadow lg:w-[28rem]">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-on-block">
            Players ({players.length})
          </h2>

          {#if players.length < 20}
            <button
              on:click={addPlayer}
              class="rounded bg-primary px-2 py-0.5 text-xs font-medium text-on-primary"
            >
              + Add
            </button>
          {/if}
        </div>

        <!-- Player grid -->
        <div class="grid gap-2 grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
          {#each players as player, index}
            <div
              role="listitem"
              draggable="true"
              on:dragstart={() => onDragStart(index)}
              on:dragover|preventDefault
              on:drop={() => onDrop(index)}
              class="flex rounded-2xl border-primary border-2 px-1 py-0.5 text-xs"
            >
              <!-- Player name -->
              <input
                type="text"
                bind:value={player.name}
                class="w-full rounded bg-block text-white px-1 py-0.5 text-xs text-center focus:outline-none"
              />

              <!-- Remove button -->
              <button
                on:click={() => removePlayer(index)}
                tabindex="-1"
                class="text-on-block p-2 active:bg-primary"
                title="Remove player"
              >
                ✕
              </button>
            </div>
          {/each}
        </div>
      </div>


    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- ===================== -->
      <!-- Schedule (BELOW) -->
      <!-- ===================== -->
      <div class="mt-6 rounded-xl bg-block p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-on-block">
            Schedule
          </h2>

          <div class="flex gap-2">
            <button
              on:click={() => randomizeCounter += 1}
              class="rounded bg-primary px-3 py-1 text-xs font-semibold text-on-primary"
            >
              Randomize
            </button>

            <button
              on:click={exportSchedulePDF}
              class="rounded bg-primary px-3 py-1 text-xs font-semibold text-on-primary"
            >
              Export PDF
            </button>
          </div>
        </div>


        <div class="overflow-x-auto">
          <!-- Original layout -->
          <table class="min-w-full border-primary border-2 text-xs text-on-primary">
            <thead class="bg-primary">
              <tr>
                <th class="border-primary border-2 px-1 py-1 text-center">Round</th>
                {#each Array(numCourts) as _, courtIndex}
                  <th class="border-primary border-2 px-1 py-1 text-center w-40">
                    Court {courtIndex + 1}
                  </th>
                {/each}
              </tr>
            </thead>

            <tbody>
              {#each schedule as round, roundIndex}
                <tr class="bg-block text-on-block">
                  <td class="border-primary border-2 text-center font-medium w-28">
                    Round {roundIndex + 1}
                    {#if roundTimes[roundIndex]}
                      <div class="text-[10px] text-gray-400">
                        {roundTimes[roundIndex].start} – {roundTimes[roundIndex].end}
                      </div>
                    {/if}
                  </td>

                  {#each round as match}
                    <td class="border-primary border-2 text-center">
                      <div class="flex flex-col gap-0">
                        <div class="rounded px-1">
                          {players[match[0][0]]?.name}
                          &
                          {players[match[0][1]]?.name}
                        </div>
                        <div class="text-[10px] text-gray-400 leading-none">vs</div>
                        <div class="rounded px-1">
                          {players[match[1][0]]?.name}
                          &
                          {players[match[1][1]]?.name}
                        </div>
                      </div>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===================== -->
      <!-- Player Statistics Table -->
      <!-- ===================== -->
      <div class="mt-6 rounded-xl bg-block p-4">
        <h2 class="mb-4 text-lg font-semibold text-on-block">Player Statistics</h2>
        <div class="overflow-x-auto min-w-0">
            <table class="min-w-full text-xs">
              <thead class="">
                <tr>
                  <th class="py-1"></th>
                  <th class="px-2 py-1"></th>
                  <th class="px-2 py-1 bg-primary text-on-primary border-2 border-primary">Teammates</th>
                  <th class="px-2 py-1 bg-primary text-on-primary border-2 border-primary">Opponents</th>
                </tr>
              </thead>

              <!-- Names row for vertical text -->
              <tbody>
                <tr class="bg-block">
                  <th class="border-2 border-primary bg-primary text-on-primary">Player</th>
                  <th class="border-2 border-primary bg-primary text-on-primary">Waits</th>

                  <!-- Teammate names, vertical -->
                  <td class="border-2 border-primary py-1">
                    <div class="grid grid-flow-col auto-cols-fr px-1.5 justify-items-center">
                      {#each players as teammate}
                        <div class="text-[10px] text-on-block whitespace-nowrap"
                             style="writing-mode: vertical-rl; transform: rotate(180deg);">
                          {teammate.name}
                        </div>
                      {/each}
                    </div>
                  </td>

                  <!-- Opponent names, vertical -->
                  <td class="border-2 border-primary py-1">
                    <div class="grid grid-flow-col auto-cols-fr px-1.5 justify-items-center">
                      {#each players as opponent}
                        <div class="text-[10px] text-on-block whitespace-nowrap"
                             style="writing-mode: vertical-rl; transform: rotate(180deg);">
                          {opponent.name}
                        </div>
                      {/each}
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody>
                {#each players as player, i}
                  <tr class="bg-block">
                    <td class="border-2 border-primary px-2 py-1 font-medium text-on-block">{player.name}</td>
                    <td class="border-2 border-primary px-2 py-1 text-center text-on-block">{stats.byes[i]}</td>

                    <!-- Teammates counts -->
                    <td class="border-2 border-primary text-on-block text-[10px]">
                      <div class="grid grid-flow-col auto-cols-fr gap-3 px-3 place-items-center">
                        {#each players as teammate, j}
                          {#if i === j}
                            <div>-</div>
                          {:else}
                            <div>{stats.teammates[i][j]}</div>
                          {/if}
                        {/each}
                      </div>
                    </td>

                    <!-- Opponents counts -->
                    <td class="border-2 border-primary text-on-block text-[10px]">
                      <div class="grid grid-flow-col auto-cols-fr gap-3 px-3 place-items-center">
                        {#each players as opponent, j}
                          <div>
                            {#if i === j}
                              -
                            {:else}
                              {stats.opponents[i][j]}
                            {/if}
                          </div>
                        {/each}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
        </div>

        {#if optimality==0}
          <p class="m-4 text-xs text-white">
            These values are proven to be optimal!!!
          </p>
        {:else if optimality==1}
          <p class="m-4 text-xs text-white">
            These values aren't optimal, it may be that the total encounter difference could be reduced to 1!
          </p>
        {:else if optimality==2}
          <p class="m-4 text-xs text-white">
            These values are NOT optimal, it may be that the total opponent difference could be reduced to 1! Otherwise, things are optimal.
          </p>
        {:else if optimality==3}
          <p class="m-4 text-xs text-white">
            These values are NOT optimal, it may be that the total opponent difference could be reduced to 1! Also, maybe the total encounter difference could be reduced to 1!
          </p>
        {/if}

        <ul class="mt-1 ml-4 text-xs text-gray-500 list-disc">
          <li>Maximum difference in player waits: {stats.maxWaitDiff}</li>
          <li>Maximum difference in teammate counts: {stats.maxTeammateDiff}</li>
          <li>Maximum difference in opponent counts: {stats.maxOpponentDiff}</li>
          <li>Maximum difference in total encounters (teammate + opponent): {stats.maxEncounterDiff}</li>
        </ul>
      </div>

    </div>


  </div>
</div>


<style>
  /* Define local classes */
  .bg-primary {
    background-color: #40b6d4;
  }

  .border-primary {
    border-color: #40b6d4;
  }

  .bg-default {
    background-color: #121519;
  }

  .bg-block {
    background-color: #242830;
  }

  .text-on-block {
    color: #ebedf0;
  }

  .text-on-primary {
    color: #000000;
  }
</style>
