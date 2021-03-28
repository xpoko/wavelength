import React from "react";
import { CenteredColumn, CenteredRow } from "./LayoutElements";
import { GetContrastingColors } from "./GetContrastingColors";

import Wheel from "./Wheel";

export function Spectrum(props: {
  spectrumCard: [string, string];
  handleValue?: number;
  targetValue?: number;
  guessingValue?: number;
  settled?: boolean,
  onChange?: (newValue: number) => void;
})
{
  const [primary, secondary] = GetContrastingColors(
    getStringHash(props.spectrumCard[0])
  );

  return (
    <div>
      <CenteredColumn style={{ alignItems: "stretch" }}>
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
          hand={props.handleValue || props.guessingValue}
          settled={props.settled || false}
          onChange={props.onChange}
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
