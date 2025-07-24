import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'database.sqlite');

export class Database {
  private static instance: Database;
  private db: sqlite3.Database;

  private constructor() {
    this.db = new sqlite3.Database(DB_PATH);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDb(): sqlite3.Database {
    return this.db;
  }

  public async run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  public async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public async all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  public close(): void {
    this.db.close();
  }
}

export async function initDatabase(): Promise<void> {
  // 确保数据目录存在
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const db = Database.getInstance();

  // Create system_links table
  await db.run(`
    CREATE TABLE IF NOT EXISTS system_links (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT DEFAULT 'server',
      description TEXT,
      category TEXT DEFAULT 'other',
      status TEXT DEFAULT 'unknown',
      port INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create settings table
  await db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create system_stats table for historical data
  await db.run(`
    CREATE TABLE IF NOT EXISTS system_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpu_usage REAL,
      memory_usage REAL,
      disk_usage TEXT,
      network_stats TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default system links if table is empty
  const existingLinks = await db.all('SELECT COUNT(*) as count FROM system_links');
  if (existingLinks[0].count === 0) {
    const defaultLinks = [
      {
        id: 'plex-media-server',
        name: 'Plex Media Server',
        url: 'http://localhost:32400',
        icon: 'film',
        description: '媒体服务器 - 管理和流式传输您的媒体内容',
        category: 'media',
        port: 32400
      },
      {
        id: 'qbittorrent',
        name: 'qBittorrent',
        url: 'http://localhost:8080',
        icon: 'download',
        description: 'BT下载工具 - 高效的BitTorrent客户端',
        category: 'download',
        port: 8080
      },
      {
        id: 'portainer',
        name: 'Portainer',
        url: 'http://localhost:9000',
        icon: 'server',
        description: 'Docker管理 - 可视化Docker容器管理',
        category: 'monitoring',
        port: 9000
      }
    ];

    for (const link of defaultLinks) {
      await db.run(
        `INSERT INTO system_links (id, name, url, icon, description, category, port) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [link.id, link.name, link.url, link.icon, link.description, link.category, link.port]
      );
    }
  }

  console.log('✅ Database initialized successfully');
}