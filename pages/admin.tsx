import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import {
  EditDroppedCompProps,
  useDroppedComps,
} from "../src/hooks/use-dropped-comps";
import { Paragraph } from "../src/components/paragraph";
import { Button } from "../src/components/button";

export default function Admin() {
  const { droppedComps, addDroppedComp, editDroppedComp, saveToStorage } =
    useDroppedComps();

  const [editingId, setEditingId] = useState<string>("");
  const editingComp = useMemo(() => {
    return droppedComps.find((c) => c.id === editingId);
  }, [editingId, droppedComps]);

  const handleDroppedItems = useCallback(
    (type: string) => addDroppedComp(type),
    [addDroppedComp]
  );

  const paraGraphInputRef = useRef<HTMLInputElement>(null);
  const buttonTextInputRef = useRef<HTMLInputElement>(null);
  const buttonAlertInputRef = useRef<HTMLInputElement>(null);

  const droppedItemsRef = useRef<HTMLDivElement>(null);

  const toggleEditState = useCallback((id: string) => {
    if (id) {
      setEditingId(id);
    }
  }, []);

  const handleDroppedCompChange = useCallback(
    (newProps: EditDroppedCompProps) => {
      if (editingComp) {
        editDroppedComp(editingComp.id, newProps);
      }
    },
    [editingComp, editDroppedComp]
  );

  const handleParaValueChange = useCallback(
    (newValue: string) => {
      handleDroppedCompChange({ paragraphText: newValue || "paragraph" });
    },
    [handleDroppedCompChange]
  );

  const handleButtonTextChange = useCallback(
    (newValue: string) => {
      handleDroppedCompChange({ buttonText: newValue || "button" });
    },
    [handleDroppedCompChange]
  );

  const handleAlertMessageChange = useCallback(
    (newValue: string) => {
      handleDroppedCompChange({ alertMessage: newValue || "alert message" });
    },
    [handleDroppedCompChange]
  );

  useEffect(() => {
    if (editingComp) {
      if (editingComp.type === "paragraph") {
        if (paraGraphInputRef && paraGraphInputRef.current) {
          paraGraphInputRef.current.value = editingComp.paragraphText;
          paraGraphInputRef.current.focus();
        }
      } else if (editingComp.type === "button") {
        if (buttonTextInputRef && buttonTextInputRef.current) {
          buttonTextInputRef.current.value = editingComp.buttonText;
          buttonTextInputRef.current.focus();
        }
        if (buttonAlertInputRef && buttonAlertInputRef.current) {
          buttonAlertInputRef.current.value = editingComp.alertMessage;
        }
      }
    }
  }, [editingComp]);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const onMouseUpdate = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    const element = document.getElementById("dropped-items-wrapper");
    if (element) element.addEventListener("mousemove", onMouseUpdate, false);

    return () => {
      if (element)
        element.removeEventListener("mousemove", onMouseUpdate, false);
    };
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex w-full justify-center my-2">
        <div className="flex flex-row bg-green-500 h-max space-x-2 px-2 select-none">
          <div className="cursor-pointer" onClick={saveToStorage}>
            Save
          </div>
          <div className="cursor-pointer">Undo</div>
          <div className="cursor-pointer">Redo</div>
          <div className="cursor-pointer">Export</div>
          <div className="cursor-pointer">Import</div>
          <a href="/consumer" target="_blank">
            View
          </a>
        </div>
      </div>
      <div className="flex flex-row flex-1 w-full h-full">
        <div className="flex w-[10%] flex-col items-center py-4 space-y-4 border-t-4">
          <div
            className="flex flex-col items-center cursor-pointer select-none"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text", "button");
            }}
          >
            <div className="w-14 h-14 border" />
            <div>Button</div>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer select-none"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text", "paragraph");
            }}
          >
            <div className="w-14 h-14 border" />
            <div>Paragraph</div>
          </div>
        </div>

        <div
          id="dropped-items-wrapper"
          className="flex relative w-full h-full flex-col items-center border-4"
          onDrop={(e) => {
            e.preventDefault();
            handleDroppedItems(e.dataTransfer.getData("text"));
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="absolute left-5 top-5 flex flex-col space-y-4">
            <div>Mouse: {`(${mousePosition.x}, ${mousePosition.y})`}</div>
            <div>Dragging:</div>
            <div>Instances: {droppedComps.length}</div>
            <div>Config: {editingComp && JSON.stringify(editingComp)}</div>
          </div>
          <div className="flex flex-col items-center py-4 space-y-4  h-[80%]">
            {droppedComps.map((comp) => {
              switch (comp.type) {
                case "button":
                  return (
                    <Button
                      key={comp.id}
                      isActive={editingComp && editingComp.id === comp.id}
                      onClick={() => toggleEditState(comp.id)}
                      text={comp.buttonText}
                    />
                  );

                case "paragraph":
                  return (
                    <Paragraph
                      key={comp.id}
                      className={clsx(
                        editingComp &&
                          editingComp.id === comp.id &&
                          "text-blue-500"
                      )}
                      onClick={() => toggleEditState(comp.id)}
                      text={comp.paragraphText}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>

          <div className="w-full min-h-[20%] border-t-4 p-3">
            {editingComp && editingComp.type === "paragraph" && (
              <div className="flex flex-col space-y-2">
                <div>Paragraph Text</div>
                <input
                  ref={paraGraphInputRef}
                  className="border-2 w-56"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleParaValueChange(value.trim());
                  }}
                />
              </div>
            )}
            {editingComp && editingComp.type === "button" && (
              <div className="flex flex-col space-y-2">
                <div>Button Text</div>
                <input
                  ref={buttonTextInputRef}
                  className="border-2 w-56"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleButtonTextChange(value.trim());
                  }}
                />
                <div>Alert Message</div>
                <input
                  ref={buttonAlertInputRef}
                  className="border-2 w-56"
                  onChange={(e) => {
                    const value = e.target.value;
                    handleAlertMessageChange(value.trim());
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
