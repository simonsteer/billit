export class SimpleQueue {
  private items: (() => Promise<void>)[] = []

  enqueue = (work: () => Promise<void>) => {
    this.items.push(work)
    this.flush()
  }

  private flushing = false
  private flush = async () => {
    if (this.flushing) return
    this.flushing = true

    const next = async () => {
      const curr = this.items.shift()
      if (!curr) return
      await curr()
      await next()
    }
    await next()
    this.flushing = false
  }
}
