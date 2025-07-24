import { Request, Response } from 'express';
import si from 'systeminformation';
import { Database } from '../models/database.js';

export class SystemController {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  public getSystemInfo = async (req: Request, res: Response) => {
    try {
      const [
        cpu,
        mem,
        osInfo,
        system,
        networkInterfaces,
        fsSize
      ] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.osInfo(),
        si.system(),
        si.networkInterfaces(),
        si.fsSize()
      ]);

      const systemInfo = {
        hostname: osInfo.hostname,
        platform: osInfo.platform,
        arch: osInfo.arch,
        uptime: process.uptime(),
        cpuUsage: Math.round(cpu.currentLoad * 100) / 100,
        memoryUsage: Math.round((mem.used / mem.total) * 100 * 100) / 100,
        totalMemory: Math.round(mem.total / 1024 / 1024 / 1024 * 100) / 100,
        usedMemory: Math.round(mem.used / 1024 / 1024 / 1024 * 100) / 100,
        diskUsage: fsSize.map(disk => ({
          filesystem: disk.fs,
          size: Math.round(disk.size / 1024 / 1024 / 1024 * 100) / 100,
          used: Math.round(disk.used / 1024 / 1024 / 1024 * 100) / 100,
          available: Math.round((disk.size - disk.used) / 1024 / 1024 / 1024 * 100) / 100,
          mountpoint: disk.mount,
          usagePercent: Math.round(disk.use * 100) / 100
        })),
        networkInterfaces: networkInterfaces
          .filter(iface => !iface.internal && iface.ip4)
          .map(iface => ({
            interface: iface.iface,
            ip4: iface.ip4,
            ip6: iface.ip6,
            mac: iface.mac,
            speed: iface.speed
          }))
      };

      // Store stats in database for history
      await this.storeSystemStats(systemInfo);

      res.json(systemInfo);
    } catch (error) {
      console.error('Error getting system info:', error);
      res.status(500).json({ error: 'Failed to get system information' });
    }
  };

  public getPerformanceData = async (req: Request, res: Response) => {
    try {
      const [cpu, mem, networkStats] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.networkStats()
      ]);

      const performanceData = {
        cpu: {
          usage: Math.round(cpu.currentLoad * 100) / 100,
          cores: cpu.cpus.map(core => ({
            usage: Math.round(core.load * 100) / 100
          }))
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          usagePercent: Math.round((mem.used / mem.total) * 100 * 100) / 100
        },
        network: networkStats.map(stat => ({
          interface: stat.iface,
          rx_bytes: stat.rx_bytes,
          tx_bytes: stat.tx_bytes,
          rx_sec: stat.rx_sec,
          tx_sec: stat.tx_sec
        }))
      };

      res.json(performanceData);
    } catch (error) {
      console.error('Error getting performance data:', error);
      res.status(500).json({ error: 'Failed to get performance data' });
    }
  };

  public getStatsHistory = async (req: Request, res: Response) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const stats = await this.db.all(
        `SELECT * FROM system_stats 
         WHERE timestamp > datetime('now', '-${hours} hours')
         ORDER BY timestamp ASC`
      );

      const formattedStats = stats.map(stat => ({
        timestamp: stat.timestamp,
        cpu_usage: stat.cpu_usage,
        memory_usage: stat.memory_usage,
        disk_usage: JSON.parse(stat.disk_usage || '[]'),
        network_stats: JSON.parse(stat.network_stats || '[]')
      }));

      res.json(formattedStats);
    } catch (error) {
      console.error('Error getting stats history:', error);
      res.status(500).json({ error: 'Failed to get statistics history' });
    }
  };

  private async storeSystemStats(systemInfo: any) {
    try {
      await this.db.run(
        `INSERT INTO system_stats (cpu_usage, memory_usage, disk_usage, network_stats)
         VALUES (?, ?, ?, ?)`,
        [
          systemInfo.cpuUsage,
          systemInfo.memoryUsage,
          JSON.stringify(systemInfo.diskUsage),
          JSON.stringify(systemInfo.networkInterfaces)
        ]
      );

      // Clean up old stats (keep only last 7 days)
      await this.db.run(
        `DELETE FROM system_stats 
         WHERE timestamp < datetime('now', '-7 days')`
      );
    } catch (error) {
      console.error('Error storing system stats:', error);
    }
  }
}