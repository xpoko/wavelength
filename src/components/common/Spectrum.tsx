import React from "react";
import { CenteredColumn, CenteredRow } from "./LayoutElements";
import { GetContrastingColors } from "./GetContrastingColors";
import Wheel from "./Wheel";
const throttle = require('lodash.throttle');

export function Spectrum(props: {
  spectrumCard: [string, string];
  handleValue?: number;
  targetValue?: number;
  guessingValue?: number;
  settled?: boolean,
  onChange?: (newValue: number) => void;
})
{
  const onChange =
    typeof props.onChange === 'function'
      ? throttle(props.onChange, 100, { 'leading': true })
      : props.onChange;

  const [primary, secondary] = GetContrastingColors(
    getStringHash(props.spectrumCard[0])
  );

  const handValue = props.handleValue !== undefined
    ? props.handleValue
    : props.guessingValue

  return (
    <div>
      <CenteredColumn style={{ alignItems: "stretch", touchAction: 'none' }}>
        <CenteredRow style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <div className='spectrum-card' style={{ backgroundColor: primary }}>
            {props.spectrumCard[0]}
          </div>
          <div className='spectrum-card' style={{ backgroundColor: secondary }}>
            {props.spectrumCard[1]}
          </div>
        </CenteredRow>
        <Wheel
          target={props.targetValue}
          hand={handValue}
          settled={props.settled || false}
          onChange={onChange}
        />
      </CenteredColumn>
    </div>
  );
}

function getStringHash(value: string)
{
  let acc = 0;
  for (let i = 0; i < value.length; i++)
  {
    acc += value.charCodeAt(i);
  }
  return acc;
}
