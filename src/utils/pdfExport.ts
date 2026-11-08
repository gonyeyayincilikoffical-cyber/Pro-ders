import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SubjectSummary, QuizTest } from '../types';

/**
 * Generates an offscreen printable HTML element for Subject Summary,
 * renders it using html2canvas with full UTF-8 Turkish font support,
 * and saves as a multi-page A4 PDF using jsPDF.
 */
export async function downloadSummaryPDF(summary: SubjectSummary): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // ~A4 width in 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';

  // Format paragraphs
  const formattedContent = summary.summaryContent
    .split('\n\n')
    .map((p) => {
      if (p.startsWith('### ')) {
        const lines = p.split('\n');
        const h3 = lines[0].replace('### ', '');
        const rest = lines.slice(1).join('\n');
        return `
          <div style="margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #0891b2; padding-bottom: 6px;">
            <h3 style="font-size: 18px; font-weight: 800; color: #0e7490; margin: 0;">${escapeHtml(h3)}</h3>
          </div>
          ${rest ? `<p style="font-size: 13px; line-height: 1.7; color: #1e293b; margin: 8px 0;">${formatMarkdown(rest)}</p>` : ''}
        `;
      }
      if (p.startsWith('#### ')) {
        const lines = p.split('\n');
        const h4 = lines[0].replace('#### ', '');
        const listItems = lines.slice(1);
        return `
          <div style="margin-top: 16px; margin-bottom: 8px;">
            <h4 style="font-size: 15px; font-weight: 700; color: #0284c7; margin: 0 0 6px 0;">${escapeHtml(h4)}</h4>
            ${
              listItems.length > 0
                ? `<ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
                  ${listItems.map((li) => `<li style="margin-bottom: 4px;">${formatMarkdown(li.replace(/^- /, ''))}</li>`).join('')}
                </ul>`
                : ''
            }
          </div>
        `;
      }
      if (p.trim() === '---') {
        return `<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />`;
      }
      if (p.includes('\n- ') || p.startsWith('- ')) {
        const lines = p.split('\n');
        return `
          <ul style="margin: 8px 0; padding-left: 20px; font-size: 13px; line-height: 1.65; color: #1e293b;">
            ${lines.map((l) => `<li style="margin-bottom: 5px;">${formatMarkdown(l.replace(/^- /, ''))}</li>`).join('')}
          </ul>
        `;
      }
      return `<p style="font-size: 13px; line-height: 1.75; color: #1e293b; margin: 10px 0;">${formatMarkdown(p)}</p>`;
    })
    .join('');

  // Key terms badges
  const keyTermsHtml =
    summary.keyTerms && summary.keyTerms.length > 0
      ? `
      <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px;">
        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">📌 Önemli Kavramlar ve Terimler:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${summary.keyTerms
            .map(
              (term) =>
                `<span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 600; background-color: #ffffff; border: 1px solid #94a3b8; border-radius: 6px; color: #0f172a;">${escapeHtml(
                  term
                )}</span>`
            )
            .join('')}
        </div>
      </div>
    `
      : '';

  // Critical exam points box
  const criticalPointsHtml =
    summary.criticalPoints && summary.criticalPoints.length > 0
      ? `
      <div style="margin-top: 18px; padding: 16px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;">
        <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 8px;">⚠ Sınavda Dikkat Edilecek Püf Noktalar:</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.65; color: #78350f;">
          ${summary.criticalPoints.map((pt) => `<li style="margin-bottom: 4px;">${escapeHtml(pt)}</li>`).join('')}
        </ul>
      </div>
    `
      : '';

  // MEB outcomes box
  const mebOutcomesHtml =
    summary.mebOutcomes && summary.mebOutcomes.length > 0
      ? `
      <div style="margin-bottom: 20px; padding: 14px 18px; background-color: #ecfeff; border: 1px solid #a5f3fc; border-radius: 12px;">
        <div style="font-size: 12px; font-weight: 700; color: #0e7490; margin-bottom: 6px;">🎯 MEB Hedef Kazanımları:</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.5; color: #164e63;">
          ${summary.mebOutcomes.map((o) => `<li style="margin-bottom: 3px;">${escapeHtml(o)}</li>`).join('')}
        </ul>
      </div>
    `
      : '';

  container.innerHTML = `
    <div style="border-bottom: 3px solid #0891b2; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="font-size: 20px; font-weight: 900; color: #0891b2; letter-spacing: -0.5px;">ProDers</div>
        <div style="font-size: 12px; color: #64748b; font-weight: 600;">6. Sınıf Fen Bilimleri Ders Notları</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; font-weight: 700; color: #0e7490; background-color: #cffafe; padding: 4px 10px; border-radius: 6px; display: inline-block;">
          ${escapeHtml(summary.unitTitle)}
        </div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Tahmini Okuma: ${summary.estimatedReadMinutes} Dakika</div>
      </div>
    </div>

    <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3;">
      ${escapeHtml(summary.topicTitle)}
    </h1>

    ${mebOutcomesHtml}
    ${formattedContent}
    ${keyTermsHtml}
    ${criticalPointsHtml}

    <div style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
      <div>ProDers Eğitim Platformu · MEB 6. Sınıf Müfredatı ile Tam Uyumlu</div>
      <div>Yazdırılma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // 2x resolution for razor-sharp typography
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeTitle = summary.topicTitle.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '_');
    pdf.save(`proders_konu_ozeti_${safeTitle}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Generates an offscreen printable HTML element for 10-Question Test,
 * complete with questions, option bubbles, answers, and solution explanations.
 */
export async function downloadTestPDF(test: QuizTest): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';

  const questionsHtml = test.questions
    .map(
      (q) => `
    <div style="margin-bottom: 24px; padding: 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; page-break-inside: avoid;">
      <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
        <span style="display: inline-block; width: 28px; height: 28px; background-color: #2563eb; color: #ffffff; border-radius: 8px; font-weight: 800; font-size: 13px; line-height: 28px; text-align: center; shrink-0;">
          ${q.questionNumber}
        </span>
        <div style="font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.5; flex: 1;">
          ${escapeHtml(q.questionText)}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        ${(['A', 'B', 'C', 'D'] as const)
          .map(
            (opt) => `
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; color: #334155;">
            <strong style="color: #2563eb; font-size: 12px;">${opt})</strong>
            <span>${escapeHtml(q.options[opt])}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <div style="padding: 10px 14px; background-color: #eff6ff; border: 1px dashed #93c5fd; border-radius: 8px; font-size: 11px; color: #1e40af; line-height: 1.5;">
        <strong>Çözüm ve Açıklama:</strong> (Doğru Cevap: <strong>${q.correctAnswer}</strong>) — ${escapeHtml(q.explanation)}
      </div>
    </div>
  `
    )
    .join('');

  // Answer Key quick table
  const answerKeyTableHtml = `
    <div style="margin-top: 30px; padding: 16px; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px;">
      <div style="font-size: 13px; font-weight: 800; color: #1e293b; margin-bottom: 10px; text-align: center;">
        CEVAP ANAHTARI
      </div>
      <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
        ${test.questions
          .map(
            (q) => `
          <div style="padding: 6px 12px; background-color: #ffffff; border: 1px solid #94a3b8; border-radius: 6px; font-size: 12px; font-weight: 700; text-align: center;">
            <span style="color: #64748b;">${q.questionNumber}:</span> <span style="color: #2563eb;">${q.correctAnswer}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  container.innerHTML = `
    <div style="border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <div style="font-size: 20px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px;">ProDers</div>
        <div style="font-size: 12px; color: #64748b; font-weight: 600;">6. Sınıf Fen Bilimleri 10 Soruluk Değerlendirme Testi</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; font-weight: 700; color: #1d4ed8; background-color: #dbeafe; padding: 4px 10px; border-radius: 6px; display: inline-block;">
          ${escapeHtml(test.unitTitle)}
        </div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Toplam 10 Soru · Çözümlü</div>
      </div>
    </div>

    <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; line-height: 1.3;">
      ${escapeHtml(test.title)}
    </h1>
    <p style="font-size: 12px; color: #64748b; margin: 0 0 20px 0;">
      ${escapeHtml(test.description)}
    </p>

    ${questionsHtml}
    ${answerKeyTableHtml}

    <div style="margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;">
      <div>ProDers Eğitim Platformu · MEB 6. Sınıf Müfredatı ile Tam Uyumlu</div>
      <div>Yazdırılma Tarihi: ${new Date().toLocaleDateString('tr-TR')}</div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeTitle = test.title.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '_');
    pdf.save(`proders_test_${safeTitle}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdown(str: string): string {
  const safe = escapeHtml(str);
  return safe
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a; font-weight: 700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
