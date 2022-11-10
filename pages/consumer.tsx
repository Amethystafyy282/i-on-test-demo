import React from "react";
import { useDroppedComps } from "../src/hooks/use-dropped-comps";
import { Button } from "../src/components/button";
import { Paragraph } from "../src/components/paragraph";

export default function Consumer() {
  const { droppedComps } = useDroppedComps();

  return (
    <div className="flex flex-col items-center py-4 space-y-4  h-[80%]">
      {droppedComps.length ? (
        droppedComps.map((c) => {
          switch (c.type) {
            case "button":
              return (
                <Button
                  key={c.id}
                  onClick={() => {
                    alert(c.alertMessage);
                  }}
                  text={c.buttonText}
                />
              );

            case "paragraph":
              return <Paragraph key={c.id} text={c.paragraphText} />;
            default:
              return null;
          }
        })
      ) : (
        <div>No comp has been added</div>
      )}
    </div>
  );
}
