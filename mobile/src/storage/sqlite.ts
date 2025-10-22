import * as SQLite from 'expo-sqlite';

export type PlateRecord = {
  plate_number: string;
  result_json: string; // stringified VerificationResult
  created_at: number; // epoch ms
};

const db = SQLite.openDatabase('naijaplate.db');

export function initDb() {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS plate_cache (plate_number TEXT PRIMARY KEY NOT NULL, result_json TEXT NOT NULL, created_at INTEGER NOT NULL)'
    );
  });
}

export function savePlateResult(plate_number: string, result_json: string) {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT OR REPLACE INTO plate_cache (plate_number, result_json, created_at) VALUES (?, ?, ?)',
      [plate_number.toUpperCase(), result_json, Date.now()]
    );
  });
}

export function getPlateResult(
  plate_number: string
): Promise<PlateRecord | undefined> {
  return new Promise((resolve, reject) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'SELECT plate_number, result_json, created_at FROM plate_cache WHERE plate_number = ? LIMIT 1',
        [plate_number.toUpperCase()],
        (_tx, rs) => {
          if (rs.rows.length > 0) {
            resolve(rs.rows.item(0) as unknown as PlateRecord);
          } else {
            resolve(undefined);
          }
        },
        (_tx, err) => {
          reject(err);
          return false;
        }
      );
    });
  });
}
