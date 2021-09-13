import React, { FC, ReactElement } from 'react'
import { RabbitBinding, RabbitExchange, RabbitQueue } from '../../types'

interface Box {
  readonly w: number
  readonly h: number
  x: number
  y: number
  render: () => ReactElement
  translate: (x: number, y: number) => void
}

interface Joinable {
  fromLeft: { x: number; y: number }
  fromRight: { x: number; y: number }
}

class Rect implements Box {
  public x = 0
  public y = 0

  constructor(public w: number, public h: number, private color: string) {}

  render() {
    return (
      <rect
        x={this.x}
        width={this.w}
        height={this.h}
        y={this.y}
        fill={this.color}
      />
    )
  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
  }
}

class Circle implements Box {
  public x = 0
  public y = 0
  public w: number
  public h: number

  constructor(private r: number, private color: string) {
    this.w = r * 2
    this.h = r * 2
  }

  render() {
    return (
      <circle
        cx={this.x + this.r}
        cy={this.y + this.r}
        r={this.r}
        fill={this.color}
      />
    )
  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
  }
}

class Text implements Box {
  public x = 0
  public y = 0
  private textAnchor = 'start'
  private dominantBaseline = 'hanging'

  constructor(
    private opts: {
      text: string
      alignX: 'left' | 'middle' | 'right'
      alignY: 'top' | 'middle' | 'bottom'
    },
    public w: number,
    public h: number
  ) {
    if (this.opts.alignX === 'middle') {
      this.x = this.w / 2
      this.textAnchor = 'middle'
    }

    if (this.opts.alignX === 'right') {
      this.x = this.w
      this.textAnchor = 'end'
    }

    if (this.opts.alignY === 'middle') {
      this.y = this.h / 2
      this.dominantBaseline = 'middle'
    }

    if (this.opts.alignY === 'bottom') {
      this.y = this.h
      this.dominantBaseline = 'auto'
    }
  }

  render() {
    return (
      <>
        <text
          x={this.x}
          y={this.y}
          textAnchor={this.textAnchor}
          dominantBaseline={this.dominantBaseline}
          strokeWidth={8}
          stroke="white"
        >
          {this.opts.text}
        </text>
        <text
          x={this.x}
          y={this.y}
          textAnchor={this.textAnchor}
          dominantBaseline={this.dominantBaseline}
        >
          {this.opts.text}
        </text>
      </>
    )
  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
  }
}

class Space implements Box {
  public x = 0
  public y = 0
  public w: number
  public h: number

  constructor(
    private opts: {
      gap: number
      elements: Box[]
      direction: 'vertical' | 'horizontal'
    }
  ) {
    if (this.opts.direction === 'vertical') {
      this.w = Math.max(0, ...this.opts.elements.map(({ w }) => w))
    } else {
      this.w =
        this.opts.gap * Math.max(0, this.opts.elements.length - 1) +
        this.opts.elements.reduce((acc, { w }) => acc + w, 0)
    }

    if (this.opts.direction === 'horizontal') {
      this.h = Math.max(0, ...this.opts.elements.map(({ h }) => h))
    } else {
      this.h =
        this.opts.gap * Math.max(0, this.opts.elements.length - 1) +
        this.opts.elements.reduce((acc, { h }) => acc + h, 0)
    }

    let offset = 0
    this.opts.elements.forEach((element) => {
      const x =
        this.opts.direction === 'vertical' ? this.w / 2 - element.w / 2 : offset
      const y =
        this.opts.direction === 'horizontal'
          ? this.h / 2 - element.h / 2
          : offset

      offset += this.opts.gap
      offset += this.opts.direction === 'vertical' ? element.h : element.w

      element.translate(x, y)
    })
  }

  render() {
    return <>{this.opts.elements.map((element) => element.render())}</>
  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
    this.opts.elements.forEach((element) => element.translate(x, y))
  }
}

class QueueSymbol extends Space implements Joinable {
  constructor() {
    super({
      gap: 3,
      direction: 'horizontal',
      elements: [
        new Rect(16, 24, '#FF9C6E'),
        new Rect(16, 24, '#FF9C6E'),
        new Rect(16, 24, '#FF9C6E'),
        new Rect(16, 24, '#FF9C6E'),
      ],
    })
  }

  get fromLeft() {
    return {
      x: this.x,
      y: this.y + this.h / 2,
    }
  }

  get fromRight() {
    return {
      x: this.x + this.w,
      y: this.y + this.h / 2,
    }
  }
}

class Queue extends Space implements Joinable {
  private symbol: QueueSymbol
  private name: string

  constructor(name: string) {
    const symbol = new QueueSymbol()

    super({
      gap: 6,
      direction: 'vertical',
      elements: [
        new Text({ text: name, alignX: 'middle', alignY: 'bottom' }, 150, 20),
        symbol,
      ],
    })

    this.symbol = symbol
    this.name = name
  }

  get fromLeft() {
    return this.symbol.fromLeft
  }

  get fromRight() {
    return this.symbol.fromRight
  }
}

class Exchange extends Space implements Joinable {
  private symbol: Circle
  private name: string

  constructor(name: string) {
    const symbol = new Circle(12, '#FFC069')

    super({
      gap: 6,
      direction: 'vertical',
      elements: [
        new Text(
          {
            text: name || '(AMQP default)',
            alignX: 'middle',
            alignY: 'bottom',
          },
          150,
          20
        ),
        symbol,
      ],
    })

    this.symbol = symbol
    this.name = name
  }

  get fromLeft() {
    return {
      x: this.symbol.x,
      y: this.symbol.y + this.symbol.h / 2,
    }
  }

  get fromRight() {
    return {
      x: this.symbol.x + this.symbol.w,
      y: this.symbol.y + this.symbol.h / 2,
    }
  }
}

const arrow = (from?: Joinable, to?: Joinable) => {
  if (!from || !to) {
    return null
  }

  let start = from.fromRight
  let end = to.fromLeft
  start.x += 4
  end.x -= 4
  let width = Math.max(200, Math.abs(end.x - start.x))

  return (
    <path
      d={`M${start.x},${start.y} C${start.x + width / 2},${start.y} ${
        end.x - width / 2
      },${end.y} ${end.x},${end.y}`}
      strokeWidth={2}
      stroke="#737373"
      strokeDasharray="5,5"
      fill="none"
      markerEnd="url(#arrow)"
    />
  )
}

const arrowLabel = (from?: Joinable, to?: Joinable, label?: string) => {
  if (!from || !to) {
    return null
  }

  let start = from.fromRight
  let end = to.fromLeft
  start.x += 4
  end.x -= 4

  const text = new Text(
    {
      text: label || '',
      alignY: 'bottom',
      alignX: 'middle',
    },
    0,
    0
  )

  text.x = (start.x + end.x) / 2
  text.y = (start.y + end.y) / 2 - 5

  return text.render()
}

export const RoutingMap: FC<{
  exchanges: RabbitExchange[]
  queues: RabbitQueue[]
  bindings: RabbitBinding[]
}> = ({ queues, exchanges, bindings }) => {
  const queuesMap = new Map<string, Queue>()
  queues.forEach((queue) => queuesMap.set(queue.name, new Queue(queue.name)))

  const exchangesMap = new Map<string, Exchange>()
  exchanges.forEach((exchange) =>
    exchangesMap.set(exchange.name, new Exchange(exchange.name))
  )

  const groups = new Map<number, string[]>()
  const reverseGroup = new Map<string, number>()

  let nextGroup = 1

  const assignGroups = (from: string, to: string) => {
    const fromGroup = reverseGroup.get(from)
    const toGroup = reverseGroup.get(to)

    if (!fromGroup && !toGroup) {
      reverseGroup.set(from, nextGroup)
      reverseGroup.set(to, nextGroup)
      groups.set(nextGroup, [from, to])
      nextGroup++
    }

    if (fromGroup && !toGroup) {
      reverseGroup.set(to, fromGroup)
      groups.get(fromGroup)?.push(to)
    }

    if (!fromGroup && toGroup) {
      reverseGroup.set(from, toGroup)
      groups.get(toGroup)?.push(from)
    }

    if (fromGroup && toGroup && fromGroup !== toGroup) {
      const keepGroup = Math.min(fromGroup, toGroup)
      const deleteGroup = Math.max(fromGroup, toGroup)

      groups
        .get(deleteGroup)
        ?.forEach((elem) => reverseGroup.set(elem, keepGroup))
      groups.get(keepGroup)?.push(...(groups.get(deleteGroup) as string[]))
      groups.delete(deleteGroup)
    }
  }

  bindings.forEach((binding) => {
    if (
      !exchangesMap.has(binding.source) ||
      (binding.destination_type === 'exchange' &&
        !exchangesMap.has(binding.destination)) ||
      (binding.destination_type === 'queue' &&
        !queuesMap.has(binding.destination))
    ) {
      return
    }

    assignGroups(
      `e${binding.source}`,
      `${binding.destination_type[0]}${binding.destination}`
    )
  })

  exchanges.forEach((exchange) => {
    if (
      !exchange.arguments['alternate-exchange'] ||
      !exchangesMap.has(exchange.arguments['alternate-exchange'])
    ) {
      return
    }

    assignGroups(
      `e${exchange.name}`,
      `e${exchange.arguments['alternate-exchange']}`
    )
  })

  queues.forEach((queue) => {
    if (
      !queue.arguments['x-dead-letter-exchange'] ||
      !exchangesMap.has(queue.arguments['x-dead-letter-exchange'])
    ) {
      return
    }

    assignGroups(
      `q${queue.name}`,
      `e${queue.arguments['x-dead-letter-exchange']}`
    )
  })

  const canvas = new Space({
    gap: 50,
    direction: 'vertical',
    elements: [...groups.values()].map(
      (group) =>
        new Space({
          gap: 200,
          direction: 'horizontal',
          elements: [
            new Space({
              gap: 20,
              direction: 'vertical',
              elements: group
                .filter((elem) => elem[0] === 'e')
                .map(
                  (exchange) => exchangesMap.get(exchange.slice(1)) as Exchange
                ),
            }),
            new Space({
              gap: 20,
              direction: 'vertical',
              elements: group
                .filter((elem) => elem[0] === 'q')
                .map((queue) => queuesMap.get(queue.slice(1)) as Queue),
            }),
          ],
        })
    ),
  })

  return (
    <svg
      width="100%"
      height={canvas.h}
      viewBox={`0 0 ${canvas.w} ${canvas.h}`}
      preserveAspectRatio="xMidYMin meet"
    >
      <defs>
        <marker
          id="arrow"
          refX="8"
          refY="5"
          viewBox="0 0 10 10"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0L10,5L0,10" fill="#737373" />
        </marker>
      </defs>
      {bindings.map((binding) =>
        arrow(
          exchangesMap.get(binding.source),
          (binding.destination_type === 'exchange'
            ? exchangesMap
            : queuesMap
          ).get(binding.destination)
        )
      )}
      {exchanges.map((exchange) => {
        if (exchange.arguments['alternate-exchange']) {
          return arrow(
            exchangesMap.get(exchange.name),
            exchangesMap.get(exchange.arguments['alternate-exchange'])
          )
        }

        return null
      })}
      {queues.map((queue) => {
        if (queue.arguments['x-dead-letter-exchange']) {
          return arrow(
            queuesMap.get(queue.name),
            exchangesMap.get(queue.arguments['x-dead-letter-exchange'])
          )
        }

        return null
      })}
      {canvas.render()}
      {bindings.map((binding) =>
        arrowLabel(
          exchangesMap.get(binding.source),
          (binding.destination_type === 'exchange'
            ? exchangesMap
            : queuesMap
          ).get(binding.destination),
          binding.routing_key
        )
      )}
      {queues.map((queue) => {
        if (queue.arguments['x-dead-letter-exchange']) {
          return arrowLabel(
            queuesMap.get(queue.name),
            exchangesMap.get(queue.arguments['x-dead-letter-exchange']),
            queue.arguments['x-dead-letter-routing-key']
          )
        }

        return null
      })}
    </svg>
  )
}
