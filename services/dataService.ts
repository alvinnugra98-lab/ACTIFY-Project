
import { EmployeeActingData, ActingStatus } from '../types';

const SHEET_ID = '1R36qhv_1z7yI2-wd8bt54Tr7G91l2oQAD9GeLqGR2l0';
const GID = '0';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export const fetchActingData = async (): Promise<EmployeeActingData[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch spreadsheet data');
    const csvText = await response.text();
    
    // Simple CSV parser that handles quotes
    const rows = csvText.split(/\r?\n/).map(row => {
      const result = [];
      let cell = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) {
          result.push(cell.trim());
          cell = '';
        } else {
          cell += char;
        }
      }
      result.push(cell.trim());
      return result;
    });

    // Skip header row
    const headers = rows[0];
    const dataRows = rows.slice(1).filter(row => row.length >= 5 && row[1] !== '');

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return dataRows.map((row, index) => {
      // Assuming headers: No, Nama, Dept, Jabatan Acting, Start Date, End Date
      // Adjust indices based on actual sheet structure
      const name = row[1] || 'Unknown';
      const dept = row[2] || 'Unassigned';
      const position = row[3] || 'Acting Position';
      const startStr = row[4] || '';
      const endStr = row[5] || '';

      const endDate = new Date(endStr);
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status = ActingStatus.ACTIVE;
      if (diffDays < 0) {
        status = ActingStatus.EXPIRED;
      } else if (diffDays <= 30) {
        status = ActingStatus.EXPIRING_SOON;
      }

      return {
        no: row[0] || (index + 1).toString(),
        name,
        dept,
        position,
        startDate: startStr,
        endDate: endStr,
        status,
        daysRemaining: diffDays
      };
    });
  } catch (error) {
    console.error('Data Fetch Error:', error);
    return [];
  }
};
