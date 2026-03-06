// services/exportService.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportService = {
  // Download file helper
  downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },

  // Format as plain text
  formatAsText(journal) {
    const date = new Date(journal.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
========================================
         DAILY JOURNAL - ${date}
========================================

🎯 Aaj ke Goals:
${journal.goals || 'Not specified'}

✅ Aaj kya kiya:
${journal.actualWork || 'Not specified'}

📚 Kya naya seekha:
${journal.learnings || 'Not specified'}

⚠️ Challenges / Problems:
${journal.challenges || 'Not specified'}

💡 Solutions / Improvements:
${journal.solutions || 'Not specified'}

📊 Productivity Rating: ${journal.productivity}/5

📅 Kal ka Plan:
${journal.nextPlan || 'Not specified'}

========================================
Generated on: ${new Date().toLocaleString()}
========================================
    `;
  },

  // Format as CSV
  formatAsCSV(journal) {
    const headers = ['Date', 'Goals', 'Actual Work', 'Learnings', 'Challenges', 'Solutions', 'Productivity', 'Next Plan'];
    const values = [
      journal.date,
      `"${journal.goals?.replace(/"/g, '""') || ''}"`,
      `"${journal.actualWork?.replace(/"/g, '""') || ''}"`,
      `"${journal.learnings?.replace(/"/g, '""') || ''}"`,
      `"${journal.challenges?.replace(/"/g, '""') || ''}"`,
      `"${journal.solutions?.replace(/"/g, '""') || ''}"`,
      journal.productivity,
      `"${journal.nextPlan?.replace(/"/g, '""') || ''}"`
    ];
    
    return headers.join(',') + '\n' + values.join(',');
  },

  // Export as PDF
  exportAsPDF(journal, filename) {
    const doc = new jsPDF();
    const date = new Date(journal.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Daily Journal', 105, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(date, 105, yPos, { align: 'center' });
    
    yPos += 15;

    // Journal entries
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const entries = [
      ['🎯 Aaj ke Goals', journal.goals],
      ['✅ Aaj kya kiya', journal.actualWork],
      ['📚 Kya naya seekha', journal.learnings],
      ['⚠️ Challenges', journal.challenges],
      ['💡 Solutions', journal.solutions],
      ['📊 Productivity', `${journal.productivity}/5`],
      ['📅 Kal ka Plan', journal.nextPlan]
    ];

    entries.forEach(([label, value]) => {
      if (value) {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 14, yPos);
        
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(value || 'Not specified', 180);
        doc.text(lines, 14, yPos + 7);
        
        yPos += 10 + (lines.length * 7);
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

    doc.save(`${filename}.pdf`);
  }
};