import { Request, Response } from 'express';
import Docker from 'dockerode';

export class DockerController {
  private docker: Docker;

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  public getContainers = async (req: Request, res: Response) => {
    try {
      const containers = await this.docker.listContainers({ all: true });
      
      const formattedContainers = containers.map((container: any) => ({
        id: container.Id,
        name: container.Names[0]?.replace('/', '') || 'unnamed',
        image: container.Image,
        status: container.Status,
        state: container.State,
        ports: container.Ports.map((port: any) => 
          port.PublicPort 
            ? `${port.PublicPort}:${port.PrivatePort}/${port.Type}`
            : `${port.PrivatePort}/${port.Type}`
        ),
        created: new Date(container.Created * 1000).toISOString(),
        labels: container.Labels || {}
      }));

      res.json(formattedContainers);
    } catch (error) {
      console.error('Error getting containers:', error);
      res.status(500).json({ error: 'Failed to get containers' });
    }
  };

  public getContainer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const container = this.docker.getContainer(id);
      const data = await container.inspect();

      const formattedContainer = {
        id: data.Id,
        name: data.Name.replace('/', ''),
        image: data.Config.Image,
        status: data.State.Status,
        state: data.State.Running ? 'running' : 'stopped',
        created: data.Created,
        started: data.State.StartedAt,
        finished: data.State.FinishedAt,
        ports: Object.keys(data.NetworkSettings.Ports || {}).map(port => {
          const portBindings = data.NetworkSettings.Ports[port];
          return portBindings && portBindings[0] 
            ? `${portBindings[0].HostPort}:${port}`
            : port;
        }),
        environment: data.Config.Env || [],
        mounts: data.Mounts?.map((mount: any) => ({
          source: mount.Source,
          destination: mount.Destination,
          mode: mount.Mode,
          type: mount.Type
        })) || [],
        networkSettings: {
          ipAddress: data.NetworkSettings.IPAddress,
          gateway: data.NetworkSettings.Gateway,
          networks: Object.keys(data.NetworkSettings.Networks || {})
        }
      };

      res.json(formattedContainer);
    } catch (error) {
      console.error('Error getting container:', error);
      res.status(500).json({ error: 'Failed to get container details' });
    }
  };

  public startContainer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const container = this.docker.getContainer(id);
      await container.start();
      res.json({ message: 'Container started successfully' });
    } catch (error) {
      console.error('Error starting container:', error);
      res.status(500).json({ error: 'Failed to start container' });
    }
  };

  public stopContainer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const container = this.docker.getContainer(id);
      await container.stop();
      res.json({ message: 'Container stopped successfully' });
    } catch (error) {
      console.error('Error stopping container:', error);
      res.status(500).json({ error: 'Failed to stop container' });
    }
  };

  public restartContainer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const container = this.docker.getContainer(id);
      await container.restart();
      res.json({ message: 'Container restarted successfully' });
    } catch (error) {
      console.error('Error restarting container:', error);
      res.status(500).json({ error: 'Failed to restart container' });
    }
  };

  public removeContainer = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const container = this.docker.getContainer(id);
      await container.remove({ force: req.query.force === 'true' });
      res.json({ message: 'Container removed successfully' });
    } catch (error) {
      console.error('Error removing container:', error);
      res.status(500).json({ error: 'Failed to remove container' });
    }
  };

  public getContainerLogs = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tail = parseInt(req.query.tail as string) || 100;
      
      const container = this.docker.getContainer(id);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: tail,
        timestamps: true,
        follow: false
      });

      // Convert buffer to string and clean up Docker log format
      const logString = logs.toString('utf8');
      const cleanLogs = logString
        .split('\n')
        .map((line: string) => {
          // Remove Docker log prefixes (first 8 bytes)
          return line.length > 8 ? line.substring(8) : line;
        })
        .filter((line: string) => line.trim().length > 0);

      res.json({ logs: cleanLogs });
    } catch (error) {
      console.error('Error getting container logs:', error);
      res.status(500).json({ error: 'Failed to get container logs' });
    }
  };

  public getDockerInfo = async (req: Request, res: Response) => {
    try {
      const info = await this.docker.info();
      const version = await this.docker.version();

      const dockerInfo = {
        version: version.Version,
        apiVersion: version.ApiVersion,
        containers: info.Containers,
        containersRunning: info.ContainersRunning,
        containersPaused: info.ContainersPaused,
        containersStopped: info.ContainersStopped,
        images: info.Images,
        serverVersion: info.ServerVersion,
        architecture: info.Architecture,
        operatingSystem: info.OperatingSystem,
        totalMemory: info.MemTotal,
        cpus: info.NCPU,
        kernelVersion: info.KernelVersion,
        dockerRootDir: info.DockerRootDir
      };

      res.json(dockerInfo);
    } catch (error) {
      console.error('Error getting Docker info:', error);
      res.status(500).json({ error: 'Failed to get Docker information' });
    }
  };
}