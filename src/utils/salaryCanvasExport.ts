import { ProcessedSalaryRow, SalaryYearStory, SALARY_STORY_BEATS, computeRankedSalaryRows } from './salaryConstants';
import { FieldEarnings } from '../types';

export interface CanvasRenderOptions {
  rows: ProcessedSalaryRow[];
  year: number;
  story: SalaryYearStory;
  maxSalaryScale?: number;
  nfqLabel?: string;
  institutionName?: string;
  aspectRatio?: '16:9' | '1:1';
  progressTimelinePct?: number; // 0 to 100 representing 10-year horizon
}

/**
 * Draws a pixel-perfect, high-resolution LinkedIn graphic to an HTML5 Canvas,
 * clearly indicating the 10-year period with a dedicated timeline track.
 */
export function drawSalaryGraphicToCanvas(
  canvas: HTMLCanvasElement,
  options: CanvasRenderOptions
): void {
  const {
    rows,
    year,
    story,
    maxSalaryScale = 75000,
    nfqLabel = 'Level 8 (Honours Bachelor)',
    institutionName = 'All Institutions (National)',
    aspectRatio = '16:9',
    progressTimelinePct = Math.round((year / 10) * 100),
  } = options;

  const width = aspectRatio === '1:1' ? 1200 : 1920;
  const height = aspectRatio === '1:1' ? 1200 : 1080;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Sleek Dark Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#040814');
  bgGrad.addColorStop(0.5, '#090f20');
  bgGrad.addColorStop(1, '#02050e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle background glow circles
  const radialGlow = ctx.createRadialGradient(width * 0.8, 150, 10, width * 0.8, 150, 450);
  radialGlow.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
  radialGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  const radialGlow2 = ctx.createRadialGradient(150, height * 0.8, 10, 150, height * 0.8, 400);
  radialGlow2.addColorStop(0, 'rgba(99, 102, 241, 0.06)');
  radialGlow2.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = radialGlow2;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // 2. Header Section
  const padX = aspectRatio === '1:1' ? 60 : 80;
  const topY = 68;

  // Tag badge: Clearly indicating 2015 -> 2025 cohort study
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('CSO IRELAND • 2015 → 2025 GRADUATE COHORT STUDY (HEO12 & HEO16)', padX, topY);

  // Main Title
  ctx.font = '800 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Degree Drift: 2015 → 2025 Graduate Salary Trajectory', padX, topY + 44);

  // Subtitle with institution & degree info
  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    `Tracking P50 Median Annualised Earnings from 2015 graduation to 2025 • Cohort: ${nfqLabel} • ${institutionName}`,
    padX,
    topY + 72
  );

  // 3. Prominent Year Badge (Top Right)
  const isFinalYear = year === 10;
  const yearBadgeWidth = 280;
  const yearBadgeHeight = 94;
  const yearBadgeX = width - padX - yearBadgeWidth;
  const yearBadgeY = topY - 10;

  // Year Badge Box with glowing border
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(yearBadgeX, yearBadgeY, yearBadgeWidth, yearBadgeHeight, 18);
  ctx.fill();
  ctx.strokeStyle = isFinalYear ? '#f59e0b' : story.accentColor || '#06b6d4';
  ctx.lineWidth = isFinalYear ? 3 : 2.5;
  ctx.stroke();

  // Year text with calendar year
  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`YEAR ${year} (${story.calendarYear})`, yearBadgeX + yearBadgeWidth / 2, yearBadgeY + 44);

  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isFinalYear ? '#fbbf24' : '#38bdf8';
  ctx.fillText(
    isFinalYear ? '★ 2025 DECADE HORIZON COMPLETE' : `${year} OF 10 YRS (2015 → ${story.calendarYear})`,
    yearBadgeX + yearBadgeWidth / 2,
    yearBadgeY + 71
  );
  ctx.restore();

  // 4. Dedicated 10-Year Period Progress Timeline Track (2015 -> 2025)
  const timelineY = topY + 98;
  const timelineW = width - padX * 2;
  const timelineH = 10;

  ctx.save();
  // Background track
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(padX, timelineY, timelineW, timelineH, 5);
  ctx.fill();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Progress fill up to current decade point
  const fillW = Math.max(16, (progressTimelinePct / 100) * timelineW);
  const progGrad = ctx.createLinearGradient(padX, 0, padX + fillW, 0);
  progGrad.addColorStop(0, '#06b6d4');
  progGrad.addColorStop(0.5, '#6366f1');
  progGrad.addColorStop(1, isFinalYear ? '#f59e0b' : '#10b981');
  ctx.fillStyle = progGrad;
  ctx.beginPath();
  ctx.roundRect(padX, timelineY, fillW, timelineH, 5);
  ctx.fill();

  // Milestone points along the 10-year track
  const milestoneYears = [1, 2, 3, 5, 8, 10];
  milestoneYears.forEach((myr) => {
    const nodeX = padX + (myr / 10) * timelineW;
    const isPassed = myr <= year;
    const isCurrent = myr === year;

    ctx.fillStyle = isCurrent ? '#ffffff' : isPassed ? '#38bdf8' : '#334155';
    ctx.beginPath();
    ctx.arc(nodeX, timelineY + timelineH / 2, isCurrent ? 7 : 4, 0, Math.PI * 2);
    ctx.fill();

    if (isCurrent) {
      ctx.strokeStyle = isFinalYear ? '#f59e0b' : '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  });

  // Timeline labels with calendar years
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText('2015 Graduation Entry', padX, timelineY + timelineH + 16);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(
    `2015 → 2025 Horizon: Year ${year} (${story.calendarYear}) • ${progressTimelinePct}% Elapsed`,
    padX + timelineW / 2,
    timelineY + timelineH + 16
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = isFinalYear ? '#fbbf24' : '#64748b';
  ctx.fillText('2025 Decade Horizon', padX + timelineW, timelineY + timelineH + 16);
  ctx.restore();

  // 5. Narrative Insight Banner
  const bannerY = timelineY + 32;
  const bannerHeight = 44;
  const bannerWidth = width - padX * 2;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.beginPath();
  ctx.roundRect(padX, bannerY, bannerWidth, bannerHeight, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Tag dot
  ctx.fillStyle = story.accentColor || '#06b6d4';
  ctx.beginPath();
  ctx.arc(padX + 22, bannerY + bannerHeight / 2, 5, 0, Math.PI * 2);
  ctx.fill();

  // Headline
  ctx.font = '700 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#f1f5f9';
  ctx.textAlign = 'left';
  ctx.fillText(`Milestone Insight: ${story.headline}`, padX + 38, bannerY + 27);

  // Subhead / shift
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#38bdf8';
  const rightTag = story.notableChange;
  ctx.textAlign = 'right';
  ctx.fillText(rightTag, padX + bannerWidth - 20, bannerY + 27);
  ctx.restore();

  // 6. The 10 Horizontal Bars
  const barsStartY = bannerY + 64;
  const availableHeight = height - barsStartY - 86;
  const rowHeight = Math.min(68, availableHeight / 10);
  const barGap = 8;
  const barH = rowHeight - barGap;

  const labelColWidth = aspectRatio === '1:1' ? 320 : 380;
  const barsStartX = padX + labelColWidth;
  const barsMaxWidth = width - padX - barsStartX - 130; // space for growth pill

  rows.forEach((row, i) => {
    const rowY = barsStartY + i * rowHeight;

    // A. Rank Badge (#1 Gold, #2 Silver, #3 Bronze, #4-10 Slate)
    ctx.save();
    let medalBg = 'rgba(30, 41, 59, 0.8)';
    let medalText = '#94a3b8';
    let medalBorder = 'rgba(71, 85, 105, 0.6)';

    if (row.rankDisplay === 1) {
      medalBg = 'rgba(245, 158, 11, 0.2)';
      medalText = '#fbbf24';
      medalBorder = '#f59e0b';
    } else if (row.rankDisplay === 2) {
      medalBg = 'rgba(148, 163, 184, 0.2)';
      medalText = '#e2e8f0';
      medalBorder = '#94a3b8';
    } else if (row.rankDisplay === 3) {
      medalBg = 'rgba(217, 119, 6, 0.2)';
      medalText = '#f97316';
      medalBorder = '#d97706';
    }

    const badgeX = padX;
    const badgeY = rowY + (barH - 28) / 2;
    ctx.fillStyle = medalBg;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, 36, 28, 8);
    ctx.fill();
    ctx.strokeStyle = medalBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '800 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = medalText;
    ctx.textAlign = 'center';
    ctx.fillText(`#${row.rankDisplay}`, badgeX + 18, badgeY + 19);

    // B. Rank Shift Indicator (▲ +2, ▼ -1, –)
    const shiftX = badgeX + 46;
    ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    if (row.rankShift > 0) {
      ctx.fillStyle = '#34d399'; // Emerald
      ctx.fillText(`▲ +${row.rankShift}`, shiftX + 14, badgeY + 19);
    } else if (row.rankShift < 0) {
      ctx.fillStyle = '#f87171'; // Rose
      ctx.fillText(`▼ ${Math.abs(row.rankShift)}`, shiftX + 14, badgeY + 19);
    } else {
      ctx.fillStyle = '#64748b'; // Slate
      ctx.fillText('—', shiftX + 14, badgeY + 19);
    }

    // C. Field Name
    const nameX = shiftX + 44;
    ctx.textAlign = 'left';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';

    // Dot with field color
    ctx.fillStyle = row.config.color;
    ctx.beginPath();
    ctx.arc(nameX + 6, rowY + barH / 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.fillText(row.fieldName, nameX + 18, rowY + barH / 2 + 5);

    // D. Horizontal Bar Track
    const trackY = rowY + 3;
    const trackH = barH - 6;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.beginPath();
    ctx.roundRect(barsStartX, trackY, barsMaxWidth, trackH, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // E. Dynamic Bar Fill
    const barW = Math.max(70, (row.annualEquivalentEur / maxSalaryScale) * barsMaxWidth);
    const barGrad = ctx.createLinearGradient(barsStartX, 0, barsStartX + barW, 0);
    barGrad.addColorStop(0, `${row.config.color}99`);
    barGrad.addColorStop(1, row.config.color);

    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(barsStartX, trackY, barW, trackH, 8);
    ctx.fill();

    // Bar Right Glow Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barsStartX + barW - 2, trackY + 2);
    ctx.lineTo(barsStartX + barW - 2, trackY + trackH - 2);
    ctx.stroke();

    // F. Salary Text Inside/Right of Bar
    ctx.font = '800 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';

    const salaryStr = `€${row.annualEquivalentEur.toLocaleString()}/yr`;
    const weeklyStr = `(€${row.weeklyMedianEur.toLocaleString()}/wk)`;

    if (barW > 230) {
      // Place text inside the bar
      ctx.fillText(salaryStr, barsStartX + 14, trackY + trackH / 2 + 5);
      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(weeklyStr, barsStartX + 120, trackY + trackH / 2 + 5);
    } else {
      // Place text right next to bar
      ctx.fillText(salaryStr, barsStartX + barW + 12, trackY + trackH / 2 + 5);
    }

    // G. Total Compounding Growth Badge vs Year 1
    const growthX = width - padX - 95;
    ctx.fillStyle = row.growthFromY1Pct > 100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.roundRect(growthX, trackY, 95, trackH, 7);
    ctx.fill();
    ctx.strokeStyle = row.growthFromY1Pct > 100 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = row.growthFromY1Pct > 100 ? '#34d399' : '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText(`+${row.growthFromY1Pct}% vs Y1`, growthX + 47, trackY + trackH / 2 + 4);

    ctx.restore();
  });

  // 7. Footer Section
  const footerY = height - 42;
  ctx.save();
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText(
    'Source: Central Statistics Office (CSO) Ireland • Tables HEO12 & HEO16 linked Revenue tax records • 10-Year Horizon CC BY 4.0',
    padX,
    footerY
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('degree-drift • Built by Barry Sisk', width - padX, footerY);
  ctx.restore();
}

/**
 * Helper to draw an interpolated frame between two sets of rows for smooth 60fps video.
 */
function drawInterpolatedSalaryFrame(
  canvas: HTMLCanvasElement,
  fromRows: ProcessedSalaryRow[],
  toRows: ProcessedSalaryRow[],
  progress: number, // 0 to 1
  fromYear: number,
  toYear: number,
  options: CanvasRenderOptions
): void {
  // Smooth sinusoidal easing
  const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
  const fromMap = new Map(fromRows.map((r) => [r.fieldId, r]));
  const toMap = new Map(toRows.map((r) => [r.fieldId, r]));

  // Interpolated rows
  const interpolatedRows: ProcessedSalaryRow[] = toRows.map((toRow) => {
    const fromRow = fromMap.get(toRow.fieldId) || toRow;
    const interpolatedAnnual = Math.round(
      fromRow.annualEquivalentEur + (toRow.annualEquivalentEur - fromRow.annualEquivalentEur) * ease
    );
    const interpolatedWeekly = Math.round(
      fromRow.weeklyMedianEur + (toRow.weeklyMedianEur - fromRow.weeklyMedianEur) * ease
    );
    const interpolatedRank = fromRow.rank + (toRow.rank - fromRow.rank) * ease;
    const interpolatedBarWidth = fromRow.barWidthPct + (toRow.barWidthPct - fromRow.barWidthPct) * ease;
    const interpolatedGrowth = Math.round(
      fromRow.growthFromY1Pct + (toRow.growthFromY1Pct - fromRow.growthFromY1Pct) * ease
    );

    return {
      ...toRow,
      annualEquivalentEur: interpolatedAnnual,
      weeklyMedianEur: interpolatedWeekly,
      rank: interpolatedRank,
      barWidthPct: interpolatedBarWidth,
      growthFromY1Pct: interpolatedGrowth,
    };
  });

  // Sort by interpolated rank so rows render in visually ordered positions
  interpolatedRows.sort((a, b) => a.rank - b.rank);

  // Interpolated year and story
  const interpolatedYear = progress < 0.5 ? fromYear : toYear;
  const story = SALARY_STORY_BEATS[interpolatedYear] || SALARY_STORY_BEATS[1];
  const interpolatedTimelinePct = Math.round(
    ((fromYear + (toYear - fromYear) * ease) / 10) * 100
  );

  drawSalaryGraphicToCanvas(canvas, {
    ...options,
    rows: interpolatedRows,
    year: interpolatedYear,
    story,
    progressTimelinePct: interpolatedTimelinePct,
  });
}

/**
 * Downloads a canvas as a high-quality PNG image.
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads all 6 year milestones as numbered PNG slides for LinkedIn carousels.
 */
export async function downloadAllSlidesAsImages(
  allEarningsByYear: Record<number, Record<string, FieldEarnings>>,
  nfqLabel: string = 'Level 8 (Honours Bachelor)',
  institutionName: string = 'All Institutions (National)'
): Promise<void> {
  const years = [1, 2, 3, 5, 8, 10];
  const offscreen = document.createElement('canvas');

  for (let i = 0; i < years.length; i++) {
    const yr = years[i];
    const prevYr = i > 0 ? years[i - 1] : undefined;
    const curEarnings = allEarningsByYear[yr] || {};
    const prevEarnings = prevYr ? allEarningsByYear[prevYr] : undefined;
    const y1Earnings = allEarningsByYear[1] || curEarnings;
    const story = SALARY_STORY_BEATS[yr] || SALARY_STORY_BEATS[1];

    const rows = computeRankedSalaryRows(curEarnings, prevEarnings, y1Earnings, 75000);

    drawSalaryGraphicToCanvas(offscreen, {
      rows,
      year: yr,
      story,
      maxSalaryScale: 75000,
      nfqLabel,
      institutionName,
      aspectRatio: '16:9',
      progressTimelinePct: Math.round((yr / 10) * 100),
    });

    const filename = `degree-drift-salary-slide-${i + 1}-year-${yr}-of-10.png`;
    downloadCanvasAsPng(offscreen, filename);

    // Slight delay so the browser can trigger sequential downloads
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
}

/**
 * Records an ultra-smooth animated bar chart race video directly in the browser,
 * with frame-by-frame interpolation and 4x longer hold on the final Year 10 position.
 */
export async function recordSalaryRaceVideo(
  canvas: HTMLCanvasElement,
  allEarningsByYear: Record<number, Record<string, FieldEarnings>>,
  options: {
    nfqLabel?: string;
    institutionName?: string;
    onProgress?: (progressPct: number, currentYear: number) => void;
  }
): Promise<Blob | null> {
  const years = [1, 2, 3, 5, 8, 10];
  const fps = 30;
  const holdFramesNormal = fps * 2; // 2 seconds hold for intermediate years
  const holdFramesFinal = holdFramesNormal * 4; // 8 seconds hold (4x as long!) for Year 10 final position
  const transitionFrames = fps * 1; // 1 second smooth interpolation between years

  // Check MediaRecorder support
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }
    }
  }

  const stream = canvas.captureStream(fps);
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  return new Promise(async (resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      resolve(blob);
    };
    recorder.onerror = (err) => reject(err);

    recorder.start();

    const y1Earnings = allEarningsByYear[1];
    const totalSteps = years.length;

    // Precalculate row states for each year
    const yearRowsMap = new Map<number, ProcessedSalaryRow[]>();
    years.forEach((yr, idx) => {
      const prevYr = idx > 0 ? years[idx - 1] : undefined;
      const curEarnings = allEarningsByYear[yr] || {};
      const prevEarnings = prevYr ? allEarningsByYear[prevYr] : undefined;
      const rows = computeRankedSalaryRows(curEarnings, prevEarnings, y1Earnings, 75000);
      yearRowsMap.set(yr, rows);
    });

    for (let i = 0; i < years.length; i++) {
      const yr = years[i];
      const isFinal = yr === 10;
      const rows = yearRowsMap.get(yr) || [];
      const story = SALARY_STORY_BEATS[yr] || SALARY_STORY_BEATS[1];

      // 1. Draw static frame
      drawSalaryGraphicToCanvas(canvas, {
        rows,
        year: yr,
        story,
        maxSalaryScale: 75000,
        nfqLabel: options.nfqLabel,
        institutionName: options.institutionName,
        progressTimelinePct: Math.round((yr / 10) * 100),
      });

      if (options.onProgress) {
        options.onProgress(Math.round(((i + 1) / totalSteps) * 100), yr);
      }

      // 2. Hold at this position (4x longer at Year 10!)
      const holdTimeMs = isFinal ? (holdFramesFinal / fps) * 1000 : (holdFramesNormal / fps) * 1000;
      await new Promise((r) => setTimeout(r, holdTimeMs));

      // 3. Smooth frame-by-frame interpolation to the next year
      if (i < years.length - 1) {
        const nextYr = years[i + 1];
        const nextRows = yearRowsMap.get(nextYr) || [];

        for (let f = 1; f <= transitionFrames; f++) {
          const progress = f / transitionFrames;
          drawInterpolatedSalaryFrame(canvas, rows, nextRows, progress, yr, nextYr, {
            rows,
            year: yr,
            story,
            maxSalaryScale: 75000,
            nfqLabel: options.nfqLabel,
            institutionName: options.institutionName,
          });
          await new Promise((r) => setTimeout(r, 1000 / fps));
        }
      }
    }

    // Stop recorder after a brief tail
    setTimeout(() => {
      recorder.stop();
    }, 600);
  });
}
