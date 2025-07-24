import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import si from 'systeminformation';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private intervals: NodeJS.Timeout[] = [];

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial system info
      this.sendSystemInfo(ws);
    });
  }

  private handleMessage(ws: WebSocket, data: any) {
    switch (data.type) {
      case 'subscribe':
        if (data.channel === 'system') {
          this.startSystemMonitoring();
        }
        break;
      case 'unsubscribe':
        if (data.channel === 'system') {
          this.stopSystemMonitoring();
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private async sendSystemInfo(ws: WebSocket) {
    try {
      const [cpu, mem] = await Promise.all([
        si.currentLoad(),
        si.mem()
      ]);

      const systemInfo = {
        type: 'system_info',
        data: {
          cpuUsage: Math.round(cpu.currentLoad * 100) / 100,
          memoryUsage: Math.round((mem.used / mem.total) * 100 * 100) / 100,
          timestamp: new Date().toISOString()
        }
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(systemInfo));
      }
    } catch (error) {
      console.error('Error sending system info:', error);
    }
  }

  private startSystemMonitoring() {
    // Clear existing intervals
    this.stopSystemMonitoring();

    // Send system updates every 5 seconds
    const systemInterval = setInterval(async () => {
      try {
        const [cpu, mem] = await Promise.all([
          si.currentLoad(),
          si.mem()
        ]);

        const update = {
          type: 'system_update',
          data: {
            cpuUsage: Math.round(cpu.currentLoad * 100) / 100,
            memoryUsage: Math.round((mem.used / mem.total) * 100 * 100) / 100,
            timestamp: new Date().toISOString()
          }
        };

        this.broadcast(update);
      } catch (error) {
        console.error('Error getting system info for WebSocket:', error);
      }
    }, 5000);

    this.intervals.push(systemInterval);
  }

  private stopSystemMonitoring() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  public broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public start() {
    console.log('✅ WebSocket service started');
  }

  public stop() {
    this.stopSystemMonitoring();
    this.wss.close();
    console.log('WebSocket service stopped');
  }
}