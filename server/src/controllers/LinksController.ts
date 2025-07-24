import { Request, Response } from 'express';
import { Database } from '../models/database.js';
import axios from 'axios';

export class LinksController {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  public getAllLinks = async (req: Request, res: Response): Promise<void> => {
    try {
      const links = await this.db.all('SELECT * FROM system_links ORDER BY name ASC');
      res.json(links);
    } catch (error) {
      console.error('Error getting links:', error);
      res.status(500).json({ error: 'Failed to get system links' });
    }
  };

  public getLinkById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const link = await this.db.get('SELECT * FROM system_links WHERE id = ?', [id]);
      
      if (!link) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      res.json(link);
    } catch (error) {
      console.error('Error getting link:', error);
      res.status(500).json({ error: 'Failed to get system link' });
    }
  };

  public createLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, url, icon, description, category, port } = req.body;

      if (!name || !url) {
        res.status(400).json({ error: 'Name and URL are required' });
        return;
      }

      const id = uuidv4();
      const now = new Date().toISOString();

      await this.db.run(
        `INSERT INTO system_links (id, name, url, icon, description, category, port, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, url, icon || 'server', description, category || 'other', port, now, now]
      );

      const newLink = await this.db.get('SELECT * FROM system_links WHERE id = ?', [id]);
      res.status(201).json(newLink);
    } catch (error) {
      console.error('Error creating link:', error);
      res.status(500).json({ error: 'Failed to create system link' });
    }
  };

  public updateLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, url, icon, description, category, port, status } = req.body;

      const existingLink = await this.db.get('SELECT * FROM system_links WHERE id = ?', [id]);
      if (!existingLink) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      const now = new Date().toISOString();

      await this.db.run(
        `UPDATE system_links 
         SET name = ?, url = ?, icon = ?, description = ?, category = ?, port = ?, status = ?, updated_at = ?
         WHERE id = ?`,
        [
          name || existingLink.name,
          url || existingLink.url,
          icon || existingLink.icon,
          description !== undefined ? description : existingLink.description,
          category || existingLink.category,
          port !== undefined ? port : existingLink.port,
          status || existingLink.status,
          now,
          id
        ]
      );

      const updatedLink = await this.db.get('SELECT * FROM system_links WHERE id = ?', [id]);
      res.json(updatedLink);
    } catch (error) {
      console.error('Error updating link:', error);
      res.status(500).json({ error: 'Failed to update system link' });
    }
  };

  public deleteLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const existingLink = await this.db.get('SELECT * FROM system_links WHERE id = ?', [id]);
      if (!existingLink) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      await this.db.run('DELETE FROM system_links WHERE id = ?', [id]);
      res.json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      res.status(500).json({ error: 'Failed to delete system link' });
    }
  };

  public checkLinkStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const link = await this.db.get('SELECT * FROM system_links WHERE id = ?', [id]);

      if (!link) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      const status = await this.checkUrlStatus(link.url);
      const now = new Date().toISOString();

      // Update status in database
      await this.db.run(
        'UPDATE system_links SET status = ?, updated_at = ? WHERE id = ?',
        [status, now, id]
      );

      res.json({ id, status, lastChecked: now });
    } catch (error) {
      console.error('Error checking link status:', error);
      res.status(500).json({ error: 'Failed to check link status' });
    }
  };

  public bulkStatusCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const links = await this.db.all('SELECT id, url FROM system_links');
      const results = [];

      for (const link of links) {
        try {
          const status = await this.checkUrlStatus(link.url);
          const now = new Date().toISOString();

          await this.db.run(
            'UPDATE system_links SET status = ?, updated_at = ? WHERE id = ?',
            [status, now, link.id]
          );

          results.push({ id: link.id, status, lastChecked: now });
        } catch (error) {
          console.error(`Error checking status for ${link.url}:`, error);
          results.push({ id: link.id, status: 'unknown', error: 'Check failed' });
        }
      }

      res.json(results);
    } catch (error) {
      console.error('Error bulk checking status:', error);
      res.status(500).json({ error: 'Failed to check links status' });
    }
  };

  private async checkUrlStatus(url: string): Promise<'online' | 'offline' | 'unknown'> {
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        validateStatus: (status) => true // Don't throw on HTTP error codes
      });

      // Consider 2xx and 3xx as online, but also some 4xx codes (like 401 auth required)
      if (response.status < 500) {
        return 'online';
      } else {
        return 'offline';
      }
    } catch (error: any) {
      // Network errors, timeouts, etc.
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        return 'offline';
      }
      return 'unknown';
    }
  }
}

// Add UUID import - create a simple UUID function since we may not have uuid package
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}