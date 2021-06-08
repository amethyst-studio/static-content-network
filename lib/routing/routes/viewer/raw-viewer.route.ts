import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { lookup } from 'mime-types'
import { extname } from 'path'
import type { Next, Request, Response } from 'restify'
import { plugins } from 'restify'
import { NotFoundError } from 'restify-errors'
import type { CDNServer } from '../../../..'
import { GenericRouting } from '../../route'

export class Route extends GenericRouting {
  public constructor (server: CDNServer) {
    super(server)

    this.configure({
      path: '/-/:namespace_id/:content_id/raw',
      allow: 'get',
      middleware: [
        plugins.throttle({
          burst: 4,
          rate: 8.0,
          xff: true,
          maxKeys: 65535
        })
      ]
    })
  }

  public async handle (request: Request, response: Response, next: Next): Promise<void> {
    const { namespace_id: namespaceId, content_id: contentId } = request.params as { namespace_id: string | undefined; content_id: string | undefined; }

    if (namespaceId === undefined || !await this.server.namespaces.has(namespaceId)) {
      next(new NotFoundError('The requested content was not found on the server.'))
      return
    }

    if (contentId === undefined || !await this.server.namespaces.has(namespaceId)) {
      next(new NotFoundError('The requested content was not found on the server.'))
      return
    }

    // Get Index
    const index = await this.server.index.get(`${namespaceId}/${contentId}`) as undefined | { file: string; type: string | undefined; upload: { name: string; size: number; }; }
    if (index === undefined) {
      next(new NotFoundError('The requested content was not found on the server.'))
      return
    }

    // Stat Disk for Existence
    const diskStat = await stat(index.file).catch(() => { return null })
    if (diskStat === null) {
      next(new NotFoundError('The requested content was not found on the server.'))
      return
    }

    const type = lookup(extname(index.upload.name))
    const stream = createReadStream(index.file)
    response.writeHead(200, {
      'Content-Length': index.upload.size,
      'Content-Type': (type === '' || index.type?.toLowerCase() === 'binary' ? 'application/octet-stream' : type as string)
    })
    const throttle = this.server.responseThrottler.createBandwidthThrottle(index.upload.size)
    request.once('aborted', () => {
      throttle.abort()
    })
    stream.pipe(throttle)
      .on('data', (chunk) => {
        response.write(chunk)
      })
      .on('end', () => {
        response.end()
      })
  }
}
