import React, { useState } from 'react'

import { Arc, BarRounded } from "@visx/shape";
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { ParentSizeProvidedProps } from '@visx/responsive/lib/components/ParentSize';
import { localPoint } from '@visx/event';
import { Spring } from 'react-spring/renderprops'


interface WheelProps
{
  target?: number,
  hand?: number,
  settled: boolean,
  onChange?: (newValue: number) => void,
}

export default function Wheel(props: WheelProps)
{
  return <ParentSize>
    {parent => <WheelInternal {...{ ...props, parent }} />}
  </ParentSize>
}

const faceMax = 85;
const faceRange = faceMax * 2;
const innerRadius = 20;
const barWidth = 7;
const valueToAngle = (value: number) => value / 20 * faceRange - faceMax;

const targetMarkerStyle: React.CSSProperties = {
  filter: "drop-shadow( 1px 1px 4px rgba(0, 0, 0, .20))"
}

function WheelInternal(props: WheelProps & { parent: ParentSizeProvidedProps })
{
  const width = props.parent.width;
  const height = width * .5;
  const barLength = height * .95;

  let targetMarker = <></>

  if (props.target !== undefined)
  {
    const targetRangeBig = (5 / 20 * faceRange) / 2
    const targetRangeMid = (3 / 20 * faceRange) / 2
    const targetRangeSmo = (1 / 20 * faceRange) / 2

    targetMarker =
      <Spring
        from={{
          opacity: 1,
          targetRangeBig: props.settled ? targetRangeBig : 0,
          targetRangeMid: props.settled ? targetRangeMid : 0,
          targetRangeSmo: props.settled ? targetRangeSmo : 0,
        }}
        to={{
          opacity: 1,
          targetRangeBig: targetRangeBig,
          targetRangeMid: targetRangeMid,
          targetRangeSmo: targetRangeSmo,
        }}
        config={{ tension: 170, friction: 26 }}
      >
        {animated =>
          <Group
            style={{
              pointerEvents: 'none',
              opacity: animated.opacity,
            }}
            transform={`rotate(${valueToAngle(props.target || 0)})`}>
            <Arc
              startAngle={radian(-animated.targetRangeBig)}
              endAngle={radian(animated.targetRangeBig)}
              innerRadius={innerRadius}
              outerRadius={height}
              fill="#E39F03"
              style={targetMarkerStyle}
            />
            <Arc
              startAngle={radian(-animated.targetRangeMid)}
              endAngle={radian(animated.targetRangeMid)}
              innerRadius={innerRadius}
              outerRadius={height}
              fill="#B5E3B4"
              style={targetMarkerStyle}
            />
            <Arc
              startAngle={radian(-animated.targetRangeSmo)}
              endAngle={radian(animated.targetRangeSmo)}
              innerRadius={innerRadius}
              outerRadius={height}
              fill="#FE6A46"
              style={targetMarkerStyle}
            />
          </Group>
        }
      </Spring>
  }

  let hand = <></>
  if (props.hand !== undefined)
  {
    hand =
      <Spring
        from={{ hand: props.hand ?? 20 / 2 }}
        to={{ hand: props.hand ?? 20 / 2 }}
        config={{ tension: 600, friction: 30 }}
      >
        {animated =>
        {
          const handAngle = valueToAngle(animated.hand);
          return <Group
            style={{
              pointerEvents: 'none',
              filter: "drop-shadow( 1px 1px 2px rgba(0, 0, 0, .65))"
            }}
          >
            <Group transform={`rotate(${handAngle})`}>
              <circle
                cx={0}
                cy={0}
                r={innerRadius}
                fill="#F5301A"
              />
              <BarRounded
                x={-barWidth / 2}
                y={-barLength}
                width={barWidth}
                height={barLength}
                radius={20}
                all={true}
                fill="#F5301A"
              />
            </Group>
          </Group>
        }}
      </Spring>
  }

  const [IsDragging, setIsDragging] = useState(false)

  const onDrag = (e: React.PointerEvent) =>
  {
    if (!IsDragging) return

    const p = localPoint(e);

    if (p == null) return

    const x = p.x - width / 2
    const y = p.y - height

    let angle = angleBetweenVec({ x: 0, y: -1 }, { x, y })
    if (x < 0) angle = -angle

    let newVal = (angle / (2 * faceMax) + .5) * 20
    newVal = Math.min(20, Math.max(0, newVal))

    if (props.onChange)
      props.onChange(newVal)
  }

  const additionalHeight = innerRadius + 4

  const wheelFace = <Arc
    startAngle={radian(-faceMax)}
    endAngle={radian(faceMax)}
    innerRadius={innerRadius}
    outerRadius={height}
    fill="#7FDDFF"
    cornerRadius={4}
  />

  return <svg
    className="wheel"
    width={width}
    height={height + additionalHeight}
    onPointerDown={e => { setIsDragging(true); onDrag(e) }}
    onPointerMove={onDrag}
    onPointerUp={e => setIsDragging(false)}
  >
    <Group
      left={width / 2}
      top={height}
    >
      <clipPath id="faceClip">{wheelFace}</clipPath>

      {wheelFace}

      <Group clipPath="url(#faceClip)">
        {targetMarker}
      </Group>

      {hand}
    </Group>
  </svg>
}

function radian(degree: number)
{
  return degree * Math.PI / 180
}

interface Vector
{
  x: number,
  y: number,
}
function angleBetweenVec(a: Vector, b: Vector)
{
  const dotAB = (a.x * b.x + a.y * b.y);
  const lenA = Math.sqrt(a.x * a.x + a.y * a.y);
  const lenB = Math.sqrt(b.x * b.x + b.y * b.y);
  return Math.acos(dotAB / (lenA * lenB)) * 180 / Math.PI
}