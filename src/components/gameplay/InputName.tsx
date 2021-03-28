import React, { useState } from "react";
import { useRef } from "react";
import { CenteredColumn } from "../common/LayoutElements";
import { LongwaveAppTitle } from "../common/Title";
import { useTranslation } from "react-i18next";
import { Button } from "../common/Button";

export function InputName(props: { initialName: string, setName: (name: string) => void })
{
  const { t } = useTranslation();
  const [Name, setName] = useState(props.initialName)
  const inputRef = useRef<HTMLInputElement>(null);
  const confirm = () => props.setName(Name);
  return (
    <CenteredColumn>
      <LongwaveAppTitle />
      <div>{t("inputname.your_name")}:</div>
      <input
        type="text"
        value={Name}
        ref={inputRef}
        onChange={e =>
        {
          setName(e.target.value)
        }}
        onKeyDown={(event) =>
        {
          if (event.key === "Enter")
            confirm()
        }}
      />
      <Button
        text="OK"
        onClick={confirm} />
    </CenteredColumn>
  );
}
